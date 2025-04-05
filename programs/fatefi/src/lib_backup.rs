use anchor_lang::prelude::*;

mod oracle;
mod executor;

// Import specific items
pub use oracle::{OracleState, MarketValue, ErrorCode as OracleErrorCode};
pub use executor::{TaskAccount, TaskCounter, RaydiumSwapData, ErrorCode as ExecutorErrorCode};

// Import the account structures from the modules
pub use oracle::{InitializeOracle, SetMarketValue, GetMarketValue};
pub use executor::{InitializeTaskCounter, CreateTask, CheckAndExecute, ExecuteTask};

declare_id!("DqmfAUS38MmoauCmgJWVgfTnRLfbiZ7Q18UL4Hz5hoR5");

#[program]
pub mod fatefi {
    use super::*;
    
    // initialization instructions
    pub fn initialize_oracle(ctx: Context<InitializeOracle>) -> Result<()> {
        let oracle_state = &mut ctx.accounts.oracle_state;
        let admin = &ctx.accounts.admin;
        
        oracle_state.admin = *admin.key;
        oracle_state.market_values = Vec::new();
        oracle_state.bump = ctx.bumps.oracle_state;
        
        msg!("Mock Polymarket Oracle initialized");
        Ok(())
    }
    
    pub fn initialize_task_counter(ctx: Context<InitializeTaskCounter>) -> Result<()> {
        let task_counter = &mut ctx.accounts.task_counter;
        task_counter.counter = 0;
        msg!("Task counter initialized");
        Ok(())
    }
    
    // Mock Oracle instructions
    pub fn set_market_value(ctx: Context<SetMarketValue>, market_id: Pubkey, value: u64) -> Result<()> {
        let oracle_state = &mut ctx.accounts.oracle_state;
        
        // Check if market already exists and update it
        let mut market_found = false;
        for market_value in oracle_state.market_values.iter_mut() {
            if market_value.market_id == market_id {
                market_value.value = value;
                market_found = true;
                break;
            }
        }
        
        // If market not found, add it as a new entry
        if !market_found {
            oracle_state.market_values.push(MarketValue {
                market_id,
                value,
            });
        }
        
        msg!("Market value set: Market ID: {:?}, Value: {}", market_id, value);
        Ok(())
    }
    
    pub fn get_market_value(ctx: Context<GetMarketValue>, market_id: Pubkey) -> Result<u64> {
        let oracle_state = &ctx.accounts.oracle_state;
        
        // Find the market and return its value
        for market_value in oracle_state.market_values.iter() {
            if market_value.market_id == market_id {
                return Ok(market_value.value);
            }
        }
        
        // Market not found
        return Err(OracleErrorCode::MarketNotFound.into());
    }
    
    // FateFi Executor instructions
    pub fn create_task(
        ctx: Context<CreateTask>,
        market_id: Pubkey,
        condition_type: u8,
        expected_value: u64,
        raydium_swap_data: RaydiumSwapData,
    ) -> Result<()> {
        let task_account = &mut ctx.accounts.task_account;
        let user = &ctx.accounts.user;
        let task_counter = &mut ctx.accounts.task_counter;
        
        // Validate condition type
        if condition_type > 2 {
            return Err(ExecutorErrorCode::InvalidConditionType.into());
        }
        
        // Initialize the task account
        task_account.owner = *user.key;
        task_account.market_id = market_id;
        task_account.condition_type = condition_type;
        task_account.expected_value = expected_value;
        task_account.raydium_swap_data = raydium_swap_data;
        task_account.is_executed = false;
        task_account.ready_for_execution = false;
        task_account.bump = ctx.bumps.task_account;
        
        // Increment the task counter
        task_counter.counter += 1;
        
        msg!("Task created for market: {:?} with task ID: {}", market_id, task_counter.counter - 1);
        Ok(())
    }
    
    pub fn check_and_execute(ctx: Context<CheckAndExecute>, _task_id: u64) -> Result<()> {
        let task_account = &mut ctx.accounts.task_account;
        let oracle_state = &ctx.accounts.oracle_state;
        
        // Check if the task is already executed
        if task_account.is_executed {
            return Err(ExecutorErrorCode::TaskAlreadyExecuted.into());
        }
        
        // Get current market value from the oracle
        let mut current_value: Option<u64> = None;
        for market_value in oracle_state.market_values.iter() {
            if market_value.market_id == task_account.market_id {
                current_value = Some(market_value.value);
                break;
            }
        }
        
        let current_value = current_value.ok_or(ExecutorErrorCode::MarketNotFound)?;
        
        // Check if condition is met
        let condition_met = match task_account.condition_type {
            0 => current_value > task_account.expected_value, // ">"
            1 => current_value < task_account.expected_value, // "<"
            2 => current_value == task_account.expected_value, // "=="
            _ => return Err(ExecutorErrorCode::InvalidConditionType.into()),
        };
        
        if condition_met {
            task_account.ready_for_execution = true;
            msg!("Condition met! Task is ready for execution.");
        } else {
            msg!("Condition not met. Current value: {}, Expected: {} with condition type: {}", 
                 current_value, task_account.expected_value, task_account.condition_type);
        }
        
        Ok(())
    }
    
    pub fn execute_task(ctx: Context<ExecuteTask>, _task_id: u64) -> Result<()> {
        let task_account = &mut ctx.accounts.task_account;
        
        // Check if the task is ready for execution
        if !task_account.ready_for_execution {
            return Err(ExecutorErrorCode::TaskNotReadyForExecution.into());
        }
        
        // Check if the task is already executed
        if task_account.is_executed {
            return Err(ExecutorErrorCode::TaskAlreadyExecuted.into());
        }
        
        // In a real implementation, this is where you'd execute the Raydium swap
        // For now, we're just marking it as executed
        task_account.is_executed = true;
        
        msg!("Task executed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {} 