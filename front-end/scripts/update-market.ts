import * as anchor from "@coral-xyz/anchor";
import { setupConnection, findPDAs, setMarketValue } from "./helpers";

async function main() {
  // Get market ID and value from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error("Usage: anchor run update-market <market_id> <value>");
    process.exit(1);
  }
  
  const marketId = args[0];
  const marketValue = new anchor.BN(parseInt(args[1]));
  
  // Use the helper functions
  const { program, user } = setupConnection();
  
  console.log("Program ID:", program.programId.toString());
  console.log("User:", user.toString());
  
  // Find PDAs
  const pdas = findPDAs(program.programId);
  
  console.log("Oracle State PDA:", pdas.oracleStatePda.toString());
  
  try {
    // Update the market value
    await setMarketValue(program, user, pdas.oracleStatePda, marketId, marketValue);
    
    // Show all market values for reference
    const oracleState = await program.account.oracleState.fetch(pdas.oracleStatePda);
    console.log("\nCurrent market values:");
    oracleState.marketValues.forEach((mv, index) => {
      console.log(`${index + 1}. ${mv.marketId}: ${mv.value}`);
    });
  } catch (error) {
    console.error("Error updating market value:", error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
); 