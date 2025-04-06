import * as anchor from "@coral-xyz/anchor";
import { setupConnection, findPDAs, initializeContract, setMarketValue } from "./helpers";

async function main() {
  // Use the helper functions
  const { program, user } = setupConnection();
  
  console.log("Program ID:", program.programId.toString());
  console.log("User:", user.toString());
  
  // Find PDAs
  const pdas = findPDAs(program.programId);
  
  console.log("Oracle State PDA:", pdas.oracleStatePda.toString());
  console.log("Task Counter PDA:", pdas.taskCounterPda.toString());
  console.log("Factory PDA:", pdas.factoryPda.toString());
  
  try {
    // Initialize all contracts
    await initializeContract(program, user, pdas);
    
    // Set a sample market value
    const marketId = "polymarket_btc_price";
    const marketValue = new anchor.BN(100);
    
    await setMarketValue(program, user, pdas.oracleStatePda, marketId, marketValue);
    
    console.log("Initialization completed successfully!");
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
); 