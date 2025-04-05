import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Fatefi } from "../target/types/fatefi";
import { PublicKey, Connection } from "@solana/web3.js";

export interface PDAInfo {
  oracleStatePda: PublicKey;
  oracleStateBump: number;
  taskCounterPda: PublicKey;
  taskCounterBump: number;
  factoryPda: PublicKey;
  factoryBump: number;
}

export function setupConnection() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  const program = anchor.workspace.Fatefi as Program<Fatefi>;
  const user = provider.wallet.publicKey;
  
  return { provider, program, user };
}

export function findPDAs(programId: PublicKey): PDAInfo {
  // Find oracle state PDA
  const [oracleStatePda, oracleStateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("oracle_state")],
    programId
  );
  
  // Find task counter PDA
  const [taskCounterPda, taskCounterBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("task_counter")],
    programId
  );
  
  // Find factory PDA
  const [factoryPda, factoryBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("factory")],
    programId
  );
  
  return {
    oracleStatePda,
    oracleStateBump,
    taskCounterPda,
    taskCounterBump,
    factoryPda,
    factoryBump
  };
}

export function findUserRegistryPDA(programId: PublicKey, user: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("user_registry"), user.toBuffer()],
    programId
  );
}

export function findExecutorPDA(programId: PublicKey, user: PublicKey, taskId: number) {
  const taskIdBuffer = Buffer.alloc(8);
  taskIdBuffer.writeBigUInt64LE(BigInt(taskId), 0);
  
  return PublicKey.findProgramAddressSync(
    [Buffer.from("executor"), user.toBuffer(), taskIdBuffer],
    programId
  );
}

export async function initializeContract(program: Program<Fatefi>, user: PublicKey, pdas: PDAInfo) {
  console.log("Initializing oracle state...");
  try {
    await program.rpc.initializeOracle({
      accounts: {
        admin: user,
        oracleState: pdas.oracleStatePda,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    });
    console.log("Oracle state initialized successfully!");
  } catch (error) {
    console.log("Error initializing oracle state:", error);
  }
  
  console.log("Initializing task counter...");
  try {
    await program.rpc.initializeTaskCounter({
      accounts: {
        admin: user,
        taskCounter: pdas.taskCounterPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    });
    console.log("Task counter initialized successfully!");
  } catch (error) {
    console.log("Error initializing task counter:", error);
  }
  
  console.log("Initializing factory...");
  try {
    await program.rpc.initializeFactory({
      accounts: {
        admin: user,
        factory: pdas.factoryPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    });
    console.log("Factory initialized successfully!");
  } catch (error) {
    console.log("Error initializing factory:", error);
  }
}

export async function setMarketValue(
  program: Program<Fatefi>, 
  user: PublicKey, 
  oracleStatePda: PublicKey, 
  marketId: string, 
  value: anchor.BN
) {
  console.log(`Setting market value for ${marketId} to ${value}...`);
  try {
    await program.rpc.setMarketValue(marketId, value, {
      accounts: {
        oracleState: oracleStatePda,
        admin: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    });
    console.log(`Market value for ${marketId} set to ${value} successfully!`);
    return true;
  } catch (error) {
    console.log("Error setting market value:", error);
    return false;
  }
} 