import { setupConnection, findUserRegistryPDA } from "./helpers";

export interface Task {
  marketId: string;
  conditionType: number;
  value: number;
  amount: number;
  isExecuted: boolean;
  readyForExecution: boolean;
}

export async function getTasks(wallet: any) {
  // Use the helper functions
  const { program, user } = await setupConnection(wallet);
  console.log("connection done!");
  
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

      const tasks: Task[] = [];
      
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
          
          tasks.push({
            marketId: executorAccount.marketId,
            conditionType: executorAccount.conditionType,
            value: executorAccount.expectedValue.toNumber(),
            amount: executorAccount.raydiumSwapData.amountIn.toString(),
            isExecuted: executorAccount.isExecuted,
            readyForExecution: executorAccount.readyForExecution
          });

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

      return tasks;
    } catch (error) {
      console.error("Error accessing user registry:", error);
      console.log("The user registry may not exist yet. Create a task first with the create-task script.");
    }
  } catch (error) {
    console.error("Error getting tasks:", error);
  }
}