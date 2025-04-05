import * as anchor from "@coral-xyz/anchor";
import { setupConnection, findUserRegistryPDA } from "./helpers";

async function main() {
  // Use the helper functions
  const { program, user } = setupConnection();
  
  console.log("Program ID:", program.programId.toString());
  console.log("User:", user.toString());
  
  // Find User Registry PDA
  const [userRegistryPda, userRegistryBump] = findUserRegistryPDA(program.programId, user);
  
  console.log("User Registry PDA:", userRegistryPda.toString());
  
  try {
    // Try to fetch the user registry account directly
    try {
      const userRegistry = await program.account.userRegistry.fetch(userRegistryPda);
      
      // If we can get the registry directly, display executors from it
      console.log(`Found ${userRegistry.executorAddresses.length} executors:`);
      
      for (let i = 0; i < userRegistry.executorAddresses.length; i++) {
        const executorPda = userRegistry.executorAddresses[i];
        console.log(`\nExecutor ${i + 1}: ${executorPda.toString()}`);
        
        try {
          const executorAccount = await program.account.taskAccount.fetch(executorPda);
          
          console.log("Details:");
          console.log(`- Market ID: ${executorAccount.marketId}`);
          console.log(`- Condition: ${executorAccount.conditionType === 0 ? '>' : '<'} ${executorAccount.expectedValue.toString()}`);
          console.log(`- Executed: ${executorAccount.isExecuted}`);
          console.log(`- Ready for execution: ${executorAccount.readyForExecution}`);
          
          // Display swap details
          console.log("Swap Details:");
          console.log(`- Token In: ${executorAccount.raydiumSwapData.tokenInMint.toString()}`);
          console.log(`- Token Out: ${executorAccount.raydiumSwapData.tokenOutMint.toString()}`);
          console.log(`- Amount In: ${executorAccount.raydiumSwapData.amountIn.toString()}`);
          console.log(`- Minimum Amount Out: ${executorAccount.raydiumSwapData.minimumAmountOut.toString()}`);
          console.log(`- Slippage Tolerance: ${executorAccount.raydiumSwapData.slippageTolerance}%`);
          console.log(`- Deadline: ${new Date(executorAccount.raydiumSwapData.deadline.toNumber() * 1000).toLocaleString()}`);
        } catch (err) {
          console.error(`Error fetching details for executor ${i + 1}:`, err);
        }
      }
      
      if (userRegistry.executorAddresses.length === 0) {
        console.log("No executors found. Create a task first with the create-task script.");
      }
    } catch (error) {
      console.error("Error accessing user registry:", error);
      console.log("The user registry may not exist yet. Create a task first with the create-task script.");
    }
  } catch (error) {
    console.error("Error getting tasks:", error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
); 