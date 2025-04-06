use anchor_lang::prelude::*;
use crate::oracle::OracleState;

// Instruction handlers for the FateFi Executor
pub fn create_task(
    ctx: Context<CreateTask>,
    market_id: Pubkey,
    condition_type: u8,
    expected_value: u64,
    raydium_swap_data: RaydiumSwapData,
) -> Result<()> {
    let task_account = &mut ctx.accounts.task_account;
    let user = &ctx.accounts.user;
    let task_counter = &ctx.accounts.task_counter;
    
    // Validate condition type
    if condition_type > 2 {
        return Err(ErrorCode::InvalidConditionType.into());
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
    
    msg!("Task created for market: {:?} with task ID: {}", market_id, task_counter.counter);
    Ok(())
}

pub fn check_and_execute(ctx: Context<CheckAndExecute>, _task_id: u64) -> Result<()> {
    let task_account = &mut ctx.accounts.task_account;
    let oracle_state = &ctx.accounts.oracle_state;
    
    // Check if the task is already executed
    if task_account.is_executed {
        return Err(ErrorCode::TaskAlreadyExecuted.into());
    }
    
    // Get current market value from the oracle
    let mut current_value: Option<u64> = None;
    for market_value in oracle_state.market_values.iter() {
        if market_value.market_id == task_account.market_id {
            current_value = Some(market_value.value);
            break;
        }
    }
    
    let current_value = current_value.ok_or(ErrorCode::MarketNotFound)?;
    
    // Check if condition is met
    let condition_met = match task_account.condition_type {
        0 => current_value > task_account.expected_value, // ">"
        1 => current_value < task_account.expected_value, // "<"
        2 => current_value == task_account.expected_value, // "=="
        _ => return Err(ErrorCode::InvalidConditionType.into()),
    };
    
    if condition_met {
        task_account.ready_for_execution = true;
        msg!("Condition met! Task is ready for execution.");
        
        // In a real implementation, this is where you'd execute the Raydium swap
        // For now, we're just marking it as ready for execution
        // In the future, this will integrate with Raydium to perform the actual swap
    } else {
        msg!("Condition not met. Current value: {}, Expected: {} with condition type: {}", 
             current_value, task_account.expected_value, task_account.condition_type);
    }
    
    Ok(())
}

// New function to execute a task that is ready for execution
pub fn execute_task(ctx: Context<ExecuteTask>, _task_id: u64) -> Result<()> {
    let task_account = &mut ctx.accounts.task_account;
    
    // Check if the task is ready for execution
    if !task_account.ready_for_execution {
        return Err(ErrorCode::TaskNotReadyForExecution.into());
    }
    
    // Check if the task is already executed
    if task_account.is_executed {
        return Err(ErrorCode::TaskAlreadyExecuted.into());
    }
    
    // In a real implementation, this is where you'd execute the Raydium swap
    // For now, we're just marking it as executed
    task_account.is_executed = true;
    
    msg!("Task executed successfully!");
    Ok(())
}

// Account context for the create_task instruction
#[derive(Accounts)]
pub struct CreateTask<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 1 + 8 + 32 + 32 + 32 + 8 + 8 + 1 + 8 + 32 + 1 + 1 + 1, // Updated space calculation
        seeds = [b"task", user.key().as_ref(), &task_counter.counter.to_le_bytes()],
        bump
    )]
    pub task_account: Account<'info, TaskAccount>,
    
    #[account(
        mut,
        seeds = [b"task_counter"],
        bump,
    )]
    pub task_counter: Account<'info, TaskCounter>,
    
    pub system_program: Program<'info, System>,
}

// Account context for the check_and_execute instruction
#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct CheckAndExecute<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"task", user.key().as_ref(), &task_id.to_le_bytes()],
        bump = task_account.bump,
        constraint = task_account.owner == *user.key @ ErrorCode::Unauthorized
    )]
    pub task_account: Account<'info, TaskAccount>,
    
    #[account(seeds = [b"oracle_state"], bump)]
    pub oracle_state: Account<'info, OracleState>,
    
    pub system_program: Program<'info, System>,
}

// Account context for the execute_task instruction
#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct ExecuteTask<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"task", user.key().as_ref(), &task_id.to_le_bytes()],
        bump = task_account.bump,
        constraint = task_account.owner == *user.key @ ErrorCode::Unauthorized
    )]
    pub task_account: Account<'info, TaskAccount>,
    
    pub system_program: Program<'info, System>,
}

// Initialize the task counter
#[derive(Accounts)]
pub struct InitializeTaskCounter<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + 8,
        seeds = [b"task_counter"],
        bump,
    )]
    pub task_counter: Account<'info, TaskCounter>,
    
    pub system_program: Program<'info, System>,
}

// Task account to store conditional execution details
#[account]
pub struct TaskAccount {
    pub owner: Pubkey,
    pub market_id: Pubkey,
    pub condition_type: u8,
    pub expected_value: u64,
    pub raydium_swap_data: RaydiumSwapData,
    pub is_executed: bool,
    pub ready_for_execution: bool,
    pub bump: u8,
}

// Placeholder for Raydium swap data
// In a real implementation, this would contain all necessary parameters for a Raydium swap
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct RaydiumSwapData {
    // Token mint addresses
    pub token_in_mint: Pubkey,
    pub token_out_mint: Pubkey,
    
    // Pool address
    pub pool_address: Pubkey,
    
    // Swap parameters
    pub amount_in: u64,
    pub minimum_amount_out: u64,
    
    // Additional parameters
    pub slippage_tolerance: u8, // Percentage (0-100)
    pub deadline: i64, // Unix timestamp
    
    // Reserved for future use
    pub reserved: [u8; 32],
}

// Counter to generate unique task IDs
#[account]
pub struct TaskCounter {
    pub counter: u64,
}

// Error codes for the executor program
#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Invalid condition type, must be 0 (>), 1 (<), or 2 (==)")]
    InvalidConditionType,
    #[msg("Market not found in oracle")]
    MarketNotFound,
    #[msg("Task has already been executed")]
    TaskAlreadyExecuted,
    #[msg("Task is not ready for execution")]
    TaskNotReadyForExecution,
}