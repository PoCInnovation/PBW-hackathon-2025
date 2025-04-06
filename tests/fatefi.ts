import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fatefi } from "../target/types/fatefi";
import { PublicKey, Keypair, Connection } from "@solana/web3.js";
import { expect } from "chai";

describe("fatefi", () => {
  // Configure the client to use the local cluster
  const connection = new Connection("http://localhost:8899", "confirmed");
  const wallet = new anchor.Wallet(Keypair.generate());
  const provider = new anchor.AnchorProvider(
    connection, 
    wallet, 
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);

  const program = anchor.workspace.Fatefi as Program<Fatefi>;
  const user = provider.wallet.publicKey;
  
  // Generate a market ID (now a string)
  const marketId = "polymarket_btc_price";
  
  // PDA for oracle state
  let oracleStatePda: PublicKey;
  let oracleStateBump: number;
  
  // PDA for task counter
  let taskCounterPda: PublicKey;
  let taskCounterBump: number;
  
  // PDA for factory
  let factoryPda: PublicKey;
  let factoryBump: number;
  
  // PDA for user registry
  let userRegistryPda: PublicKey;
  let userRegistryBump: number;
  
  // Task ID and PDA
  let taskId = 0;
  let executorPda: PublicKey;
  let executorBump: number;

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
    
    // Find factory PDA
    const [fPda, fBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("factory")],
      program.programId
    );
    factoryPda = fPda;
    factoryBump = fBump;
    
    // Find user registry PDA
    const [regPda, regBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_registry"), user.toBuffer()],
      program.programId
    );
    userRegistryPda = regPda;
    userRegistryBump = regBump;
    
    // Find executor PDA (for task ID 0)
    const taskIdBuffer = Buffer.alloc(8);
    taskIdBuffer.writeBigUInt64LE(BigInt(taskId), 0);
    
    const [exPda, exBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("executor"), user.toBuffer(), taskIdBuffer],
      program.programId
    );
    executorPda = exPda;
    executorBump = exBump;
    
    console.log("Program ID:", program.programId.toString());
    console.log("User:", user.toString());
    console.log("Oracle State PDA:", oracleStatePda.toString());
    console.log("Task Counter PDA:", taskCounterPda.toString());
    console.log("Factory PDA:", factoryPda.toString());
    console.log("User Registry PDA:", userRegistryPda.toString());
    console.log("Executor PDA:", executorPda.toString());
    
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

  it("Initializes the factory", async () => {
    try {
      await program.methods
        .initializeFactory()
        .accounts({
          admin: user,
          factory: factoryPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the factory and verify it was initialized correctly
      const factory = await program.account.factory.fetch(factoryPda);
      expect(factory.admin.toString()).to.equal(user.toString());
      expect(factory.userExecutorCount.toNumber()).to.equal(0);
    } catch (e) {
      console.error("Error in initialize factory:", e);
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
      expect(oracleState.marketValues[0].marketId).to.equal(marketId);
      expect(oracleState.marketValues[0].value.toNumber()).to.equal(100);
    } catch (e) {
      console.error("Error in set market value:", e);
      throw e;
    }
  });

  it("Creates an executor through the factory", async () => {
    try {
      // Create a executor with condition: market value > 150
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
        .createExecutor(marketId, conditionType, expectedValue, raydiumSwapData)
        .accounts({
          user: user,
          factory: factoryPda,
          userRegistry: userRegistryPda,
          executorAccount: executorPda,
          taskCounter: taskCounterPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the user registry and verify it was created correctly
      const userRegistry = await program.account.userRegistry.fetch(userRegistryPda);
      expect(userRegistry.owner.toString()).to.equal(user.toString());
      expect(userRegistry.executorCount.toNumber()).to.equal(1);
      expect(userRegistry.executorAddresses.length).to.equal(1);
      expect(userRegistry.executorAddresses[0].toString()).to.equal(executorPda.toString());
      
      // Fetch the executor account and verify it was created correctly
      const executor = await program.account.taskAccount.fetch(executorPda);
      expect(executor.owner.toString()).to.equal(user.toString());
      expect(executor.marketId).to.equal(marketId);
      expect(executor.conditionType).to.equal(conditionType);
      expect(executor.expectedValue.toNumber()).to.equal(150);
      expect(executor.isExecuted).to.equal(false);
      expect(executor.readyForExecution).to.equal(false);
      
      // Fetch the factory and verify its counter was incremented
      const factory = await program.account.factory.fetch(factoryPda);
      expect(factory.userExecutorCount.toNumber()).to.equal(1);
      
      // Verify the task counter was incremented
      const taskCounter = await program.account.taskCounter.fetch(taskCounterPda);
      expect(taskCounter.counter.toNumber()).to.equal(1);
    } catch (e) {
      console.error("Error in create executor:", e);
      throw e;
    }
  });

  it("Gets a user's executors", async () => {
    try {
      const executors = await program.methods
        .getUserExecutors()
        .accounts({
          user: user,
          userRegistry: userRegistryPda,
        })
        .view();
      
      expect(executors.length).to.equal(1);
      expect(executors[0].toString()).to.equal(executorPda.toString());
    } catch (e) {
      console.error("Error in get user executors:", e);
      throw e;
    }
  });

  it("Checks if the condition is met (should not be met yet)", async () => {
    try {
      await program.methods
        .checkAndExecute(new anchor.BN(taskId))
        .accounts({
          user: user,
          taskAccount: executorPda,
          oracleState: oracleStatePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the executor account and verify the condition is not met
      const executor = await program.account.taskAccount.fetch(executorPda);
      expect(executor.readyForExecution).to.equal(false);
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
          taskAccount: executorPda,
          oracleState: oracleStatePda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the executor account and verify the condition is met
      const executor = await program.account.taskAccount.fetch(executorPda);
      expect(executor.readyForExecution).to.equal(true);
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
          taskAccount: executorPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      
      // Fetch the executor account and verify it was executed
      const executor = await program.account.taskAccount.fetch(executorPda);
      expect(executor.isExecuted).to.equal(true);
    } catch (e) {
      console.error("Error in execute task:", e);
      throw e;
    }
  });
});
