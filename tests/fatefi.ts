import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fatefi } from "../target/types/fatefi";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import { expect } from "chai";

describe("fatefi", () => {
  // Configure the client to use the local cluster
  const connection = new Connection("http://localhost:8899", "confirmed");
  const wallet = new anchor.Wallet(Keypair.generate());
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);

  const program = anchor.workspace.Fatefi as Program<Fatefi>;
  const user = provider.wallet.publicKey;
  
  // Generate a random market ID for testing
  const marketId = Keypair.generate().publicKey;
  
  // PDA for oracle state
  let oracleStatePda: PublicKey;
  let oracleStateBump: number;
  
  // PDA for task counter
  let taskCounterPda: PublicKey;
  let taskCounterBump: number;
  
  // Task ID and PDA
  let taskId = 0;
  let taskPda: PublicKey;
  let taskBump: number;

  // Find PDAs before tests
  before(async () => {
    // Find oracle state PDA
    const [oraclePda, oracleBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("oracle_state")],
      program.programId
    );
    oracleStatePda = oraclePda;
    oracleStateBump = oracleBump;
    
    // Find task counter PDA
    const [counterPda, counterBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("task_counter")],
      program.programId
    );
    taskCounterPda = counterPda;
    taskCounterBump = counterBump;
    
    // Find task PDA (for task ID 0)
    const taskIdBuffer = Buffer.alloc(8);
    taskIdBuffer.writeBigUInt64LE(BigInt(taskId), 0);
    
    const [tPda, tBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("task"), user.toBuffer(), taskIdBuffer],
      program.programId
    );
    taskPda = tPda;
    taskBump = tBump;
    
    console.log("Program ID:", program.programId.toString());
    console.log("User:", user.toString());
    console.log("Oracle State PDA:", oracleStatePda.toString());
    console.log("Task Counter PDA:", taskCounterPda.toString());
    console.log("Task PDA:", taskPda.toString());
    
    // Airdrop SOL to the wallet for testing
    const airdropSignature = await connection.requestAirdrop(user, 2 * 10**9);
    await connection.confirmTransaction(airdropSignature);
    
    console.log("Airdropped SOL to wallet");
  });

  it("Initializes the mock oracle", async () => {
    try {
      await program.methods
        .initializeOracle()
        .accounts({
          admin: user,
          oracleState: oracleStatePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the oracle state and verify it was initialized correctly
      const oracleState = await program.account.oracleState.fetch(oracleStatePda);
      expect(oracleState.admin.toString()).to.equal(user.toString());
      expect(oracleState.marketValues.length).to.equal(0);
    } catch (e) {
      console.error("Error in initialize oracle:", e);
      throw e;
    }
  });

  it("Initializes the task counter", async () => {
    try {
      await program.methods
        .initializeTaskCounter()
        .accounts({
          admin: user,
          taskCounter: taskCounterPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the task counter and verify it was initialized correctly
      const taskCounter = await program.account.taskCounter.fetch(taskCounterPda);
      expect(taskCounter.counter.toNumber()).to.equal(0);
    } catch (e) {
      console.error("Error in initialize task counter:", e);
      throw e;
    }
  });

  it("Sets a market value in the oracle", async () => {
    try {
      const marketValue = new anchor.BN(100);
      
      await program.methods
        .setMarketValue(marketId, marketValue)
        .accounts({
          oracleState: oracleStatePda,
          admin: user,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the oracle state and verify the market value was set
      const oracleState = await program.account.oracleState.fetch(oracleStatePda);
      expect(oracleState.marketValues.length).to.equal(1);
      expect(oracleState.marketValues[0].marketId.toString()).to.equal(marketId.toString());
      expect(oracleState.marketValues[0].value.toNumber()).to.equal(100);
    } catch (e) {
      console.error("Error in set market value:", e);
      throw e;
    }
  });

  it("Creates a conditional task", async () => {
    try {
      // Create a task that executes when the market value > 150
      const conditionType = 0; // ">"
      const expectedValue = new anchor.BN(150);
      
      // Dummy Raydium swap data for testing
      const raydiumSwapData = {
        tokenInMint: Keypair.generate().publicKey,
        tokenOutMint: Keypair.generate().publicKey,
        poolAddress: Keypair.generate().publicKey,
        amountIn: new anchor.BN(1000000000), // 1 SOL
        minimumAmountOut: new anchor.BN(10000000), // 0.01 USDC
        slippageTolerance: 1, // 1%
        deadline: new anchor.BN(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
        reserved: Array(32).fill(0),
      };
      
      await program.methods
        .createTask(marketId, conditionType, expectedValue, raydiumSwapData)
        .accounts({
          user: user,
          taskAccount: taskPda,
          taskCounter: taskCounterPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the task account and verify it was created correctly
      const taskAccount = await program.account.taskAccount.fetch(taskPda);
      expect(taskAccount.owner.toString()).to.equal(user.toString());
      expect(taskAccount.marketId.toString()).to.equal(marketId.toString());
      expect(taskAccount.conditionType).to.equal(conditionType);
      expect(taskAccount.expectedValue.toNumber()).to.equal(150);
      expect(taskAccount.isExecuted).to.equal(false);
      expect(taskAccount.readyForExecution).to.equal(false);
      
      // Verify the task counter was incremented
      const taskCounter = await program.account.taskCounter.fetch(taskCounterPda);
      expect(taskCounter.counter.toNumber()).to.equal(1);
    } catch (e) {
      console.error("Error in create task:", e);
      throw e;
    }
  });

  it("Checks if the condition is met (should not be met yet)", async () => {
    try {
      await program.methods
        .checkAndExecute(new anchor.BN(taskId))
        .accounts({
          user: user,
          taskAccount: taskPda,
          oracleState: oracleStatePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the task account and verify the condition is not met
      const taskAccount = await program.account.taskAccount.fetch(taskPda);
      expect(taskAccount.readyForExecution).to.equal(false);
    } catch (e) {
      console.error("Error in check and execute (not met):", e);
      throw e;
    }
  });

  it("Updates the market value to meet the condition", async () => {
    try {
      const newMarketValue = new anchor.BN(200); // Now greater than 150
      
      await program.methods
        .setMarketValue(marketId, newMarketValue)
        .accounts({
          oracleState: oracleStatePda,
          admin: user,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the oracle state and verify the market value was updated
      const oracleState = await program.account.oracleState.fetch(oracleStatePda);
      expect(oracleState.marketValues[0].value.toNumber()).to.equal(200);
    } catch (e) {
      console.error("Error in update market value:", e);
      throw e;
    }
  });

  it("Checks if the condition is met (should be met now)", async () => {
    try {
      await program.methods
        .checkAndExecute(new anchor.BN(taskId))
        .accounts({
          user: user,
          taskAccount: taskPda,
          oracleState: oracleStatePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the task account and verify the condition is met
      const taskAccount = await program.account.taskAccount.fetch(taskPda);
      expect(taskAccount.readyForExecution).to.equal(true);
    } catch (e) {
      console.error("Error in check and execute (met):", e);
      throw e;
    }
  });

  it("Executes the task when the condition is met", async () => {
    try {
      await program.methods
        .executeTask(new anchor.BN(taskId))
        .accounts({
          user: user,
          taskAccount: taskPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the task account and verify it was executed
      const taskAccount = await program.account.taskAccount.fetch(taskPda);
      expect(taskAccount.isExecuted).to.equal(true);
    } catch (e) {
      console.error("Error in execute task:", e);
      throw e;
    }
  });
});
