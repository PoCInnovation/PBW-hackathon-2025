import * as anchor from "@coral-xyz/anchor";
import { setupConnection, findPDAs, findExecutorPDA } from "./helpers";

async function main() {
  // Get the task ID from command line arguments, or default to 0
  const args = process.argv.slice(2);
  const taskId = args.length > 0 ? parseInt(args[0]) : 0;
  
  // Use the helper functions
  const { program, user } = setupConnection();
  
  console.log("Program ID:", program.programId.toString());
  console.log("User:", user.toString());
  console.log("Task ID:", taskId);
  
  // Find PDAs
  const pdas = findPDAs(program.programId);
  
  // Calculate executor PDA for the task ID
  const [executorPda, executorBump] = findExecutorPDA(program.programId, user, taskId);
  
  console.log("Oracle State PDA:", pdas.oracleStatePda.toString());
  console.log("Executor PDA:", executorPda.toString());
  
  try {
    // First check if the condition is met
    console.log(`Checking if conditions are met for task ID: ${taskId}...`);
    await program.rpc.checkAndExecute(new anchor.BN(taskId), {
      accounts: {
        user: user,
        taskAccount: executorPda,
        oracleState: pdas.oracleStatePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });
    
    // Fetch the executor account to check if it's ready for execution
    const executor = await program.account.taskAccount.fetch(executorPda);
    
    if (executor.readyForExecution) {
      console.log("Condition is met! Task is ready for execution.");
      
      // Execute the task if it's ready and not already executed
      if (!executor.isExecuted) {
        console.log("Executing task...");
        await program.rpc.executeTask(new anchor.BN(taskId), {
          accounts: {
            user: user,
            taskAccount: executorPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          },
        });
        console.log("Task executed successfully!");
      } else {
        console.log("Task is already executed.");
      }
    } else {
      console.log("Condition is not met yet. Task is not ready for execution.");
      
      // Fetch and display current market value for debugging
      const oracleState = await program.account.oracleState.fetch(pdas.oracleStatePda);
      const marketValue = oracleState.marketValues.find(mv => mv.marketId === executor.marketId);
      
      if (marketValue) {
        console.log(`Current market value for ${executor.marketId}: ${marketValue.value}`);
        console.log(`Expected value: ${executor.conditionType === 0 ? '>' : '<'} ${executor.expectedValue}`);
      } else {
        console.log(`Market ${executor.marketId} not found in oracle state.`);
      }
    }
  } catch (error) {
    console.error("Error checking and executing task:", error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
); 