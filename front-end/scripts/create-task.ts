import * as anchor from "@coral-xyz/anchor";
import { setupConnection, findPDAs, findUserRegistryPDA, findExecutorPDA } from "./helpers";
import { Keypair } from "@solana/web3.js";

export async function createTask(wallet: any) {
  // Use the helper functions
  const { program, user } = await setupConnection(wallet);
  
  console.log("Program ID:", program.programId.toString());
  console.log("User:", user.toString());
  
  // Find PDAs
  const pdas = findPDAs(program.programId);
  const [userRegistryPda, userRegistryBump] = findUserRegistryPDA(program.programId, user);
  
  // Get current task counter
  const taskCounter = await program.account.taskCounter.fetch(pdas.taskCounterPda);
  const taskId = taskCounter.counter.toNumber();
  
  // Calculate executor PDA
  const [executorPda, executorBump] = findExecutorPDA(program.programId, user, taskId);
  
  console.log("Creating task with ID:", taskId);
  console.log("User Registry PDA:", userRegistryPda.toString());
  console.log("Executor PDA:", executorPda.toString());
  
  try {
    const marketId = "polymarket_btc_price";
    const conditionType = 0; // ">" greater than
    const expectedValue = new anchor.BN(150); // BTC price > $150
    
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
    
    // Create executor
    console.log("Creating executor...");
    await program.rpc.createExecutor(marketId, conditionType, expectedValue, raydiumSwapData, {
      accounts: {
        user: user,
        factory: pdas.factoryPda,
        userRegistry: userRegistryPda,
        executorAccount: executorPda,
        taskCounter: pdas.taskCounterPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    
    console.log(`Executor created with task ID: ${taskId}`);
    console.log(`Condition: ${marketId} ${conditionType === 0 ? '>' : '<'} ${expectedValue}`);
    console.log("Task created successfully!");
  } catch (error) {
    console.error("Error creating task:", error);
  }
}