#[cfg(feature = "init-if-needed")]
use anchor_lang::prelude::*;

#[cfg(not(feature = "init-if-needed"))]
use anchor_lang::prelude::*;

use std::mem::size_of;

declare_id!("GfJp5WgVVvSkxdAGSRKEgfjZXdDKPWorNKBQ7sWFE5uD");

#[program]
pub mod fatefi {
    use super::*;
    
    // Initialize Oracle
    pub fn initialize_oracle(ctx: Context<InitializeOracle>) -> Result<()> {
        let oracle_state = &mut ctx.accounts.oracle_state;
        oracle_state.admin = ctx.accounts.admin.key();
        oracle_state.market_values = Vec::new();
        oracle_state.bump = ctx.bumps.oracle_state;
        
        msg!("Mock Oracle initialized");
        Ok(())
    }
    
    // Initialize Task Counter
    pub fn initialize_task_counter(ctx: Context<InitializeTaskCounter>) -> Result<()> {
        let task_counter = &mut ctx.accounts.task_counter;
        task_counter.counter = 0;
        task_counter.bump = ctx.bumps.task_counter;
        
        msg!("Task counter initialized");
        Ok(())
    }
    
    // Initialize Factory
    pub fn initialize_factory(ctx: Context<InitializeFactory>) -> Result<()> {
        let factory = &mut ctx.accounts.factory;
        factory.admin = ctx.accounts.admin.key();
        factory.user_executor_count = 0;
        factory.bump = ctx.bumps.factory;
        
        msg!("Factory initialized");
        Ok(())
    }
    
    // Set Market Value
    pub fn set_market_value(ctx: Context<SetMarketValue>, market_id: String, value: u64) -> Result<()> {
        let oracle_state = &mut ctx.accounts.oracle_state;
        
        // Check if this market ID already exists
        let market_id_clone = market_id.clone(); // Clone for use in the message
        for market_value in oracle_state.market_values.iter_mut() {
            if market_value.market_id == market_id_clone {
                // Update existing value
                market_value.value = value;
                msg!("Market value updated: Market ID: {}, Value: {}", market_id_clone, value);
                return Ok(());
            }
        }
        
        // Add new market value
        oracle_state.market_values.push(MarketValue {
            market_id: market_id_clone.clone(),
            value,
        });
        
        msg!("Market value set: Market ID: {}, Value: {}", market_id_clone, value);
        Ok(())
    }
    
    // Get Market Value
    pub fn get_market_value(ctx: Context<GetMarketValue>, market_id: String) -> Result<u64> {
        let oracle_state = &ctx.accounts.oracle_state;
        
        // Find the market value
        for market_value in oracle_state.market_values.iter() {
            if market_value.market_id == market_id {
                return Ok(market_value.value);
            }
        }
        
        // Market ID not found
        err!(FateFiError::MarketNotFound)
    }
    
    // Create Task
    pub fn create_task(
        ctx: Context<CreateTask>,
        market_id: String,
        condition_type: u8,
        expected_value: u64,
        raydium_swap_data: RaydiumSwapData,
    ) -> Result<()> {
        let task_account = &mut ctx.accounts.task_account;
        let task_counter = &mut ctx.accounts.task_counter;
        
        // Initialize task
        task_account.owner = ctx.accounts.user.key();
        task_account.market_id = market_id;
        task_account.condition_type = condition_type;
        task_account.expected_value = expected_value;
        task_account.is_executed = false;
        task_account.ready_for_execution = false;
        task_account.raydium_swap_data = raydium_swap_data;
        task_account.bump = ctx.bumps.task_account;
        
        // Increment task counter
        task_counter.counter += 1;
        
        msg!("Task created with ID: {}", task_counter.counter - 1);
        Ok(())
    }
    
    // Create executor through the factory
    pub fn create_executor(
        ctx: Context<CreateExecutor>,
        market_id: String,
        condition_type: u8,
        expected_value: u64,
        raydium_swap_data: RaydiumSwapData,
    ) -> Result<()> {
        let factory = &mut ctx.accounts.factory;
        let user_registry = &mut ctx.accounts.user_registry;
        let executor_account = &mut ctx.accounts.executor_account;
        let task_counter = &mut ctx.accounts.task_counter;
        
        // Initialize user registry if this is the first executor
        if user_registry.executor_count == 0 {
            user_registry.owner = ctx.accounts.user.key();
            user_registry.executor_count = 0;
            user_registry.executor_addresses = Vec::new();
            user_registry.bump = ctx.bumps.user_registry;
        }
        
        // Initialize executor account directly
        executor_account.owner = ctx.accounts.user.key();
        executor_account.market_id = market_id;
        executor_account.condition_type = condition_type;
        executor_account.expected_value = expected_value;
        executor_account.is_executed = false;
        executor_account.ready_for_execution = false;
        executor_account.raydium_swap_data = raydium_swap_data;
        executor_account.bump = ctx.bumps.executor_account;
        
        // Increment task counter
        task_counter.counter += 1;
        
        // Add executor to user registry
        user_registry.executor_addresses.push(ctx.accounts.executor_account.key());
        user_registry.executor_count += 1;
        
        // Increment factory counter
        factory.user_executor_count += 1;
        
        msg!("Executor created with ID: {} for user: {}", 
            task_counter.counter - 1,
            ctx.accounts.user.key());
        Ok(())
    }
    
    // Get user executors
    pub fn get_user_executors(ctx: Context<GetUserExecutors>) -> Result<Vec<Pubkey>> {
        let user_registry = &ctx.accounts.user_registry;
        
        // Return the list of executor addresses
        Ok(user_registry.executor_addresses.clone())
    }
    
    // Check if condition is met and execute if needed
    pub fn check_and_execute(ctx: Context<CheckAndExecute>, task_id: u64) -> Result<()> {
        let task_account = &mut ctx.accounts.task_account;
        let oracle_state = &ctx.accounts.oracle_state;
        
        // Find the market value
        let mut current_value: Option<u64> = None;
        for market_value in oracle_state.market_values.iter() {
            if market_value.market_id == task_account.market_id {
                current_value = Some(market_value.value);
                break;
            }
        }
        
        // Market ID not found
        if current_value.is_none() {
            return err!(FateFiError::MarketNotFound);
        }
        
        let current_value = current_value.unwrap();
        
        // Check condition
        let condition_met = match task_account.condition_type {
            0 => current_value > task_account.expected_value,  // >
            1 => current_value >= task_account.expected_value, // >=
            2 => current_value < task_account.expected_value,  // <
            3 => current_value <= task_account.expected_value, // <=
            4 => current_value == task_account.expected_value, // ==
            _ => return err!(FateFiError::InvalidConditionType),
        };
        
        // Update task status
        if condition_met && !task_account.ready_for_execution {
            task_account.ready_for_execution = true;
            msg!("Condition met for task ID: {}", task_id);
        } else if !condition_met && task_account.ready_for_execution {
            task_account.ready_for_execution = false;
            msg!("Condition no longer met for task ID: {}", task_id);
        }
        
        Ok(())
    }
    
    // Execute task if condition is met
    pub fn execute_task(ctx: Context<ExecuteTask>, task_id: u64) -> Result<()> {
        let task_account = &mut ctx.accounts.task_account;
        
        // Check if task is ready for execution
        if !task_account.ready_for_execution {
            return err!(FateFiError::ConditionNotMet);
        }
        
        // Check if task is already executed
        if task_account.is_executed {
            return err!(FateFiError::TaskAlreadyExecuted);
        }
        
        // Mock execution of the swap (in a real implementation, this would call Raydium)
        msg!("Executing swap on Raydium with the following parameters:");
        msg!("   Token In: {}", task_account.raydium_swap_data.token_in_mint);
        msg!("   Token Out: {}", task_account.raydium_swap_data.token_out_mint);
        msg!("   Pool Address: {}", task_account.raydium_swap_data.pool_address);
        msg!("   Amount In: {}", task_account.raydium_swap_data.amount_in);
        msg!("   Minimum Amount Out: {}", task_account.raydium_swap_data.minimum_amount_out);
        
        // Mark as executed
        task_account.is_executed = true;
        
        msg!("Task ID: {} executed successfully", task_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 4 + (128 + 8) * 10 + 1, // Space for admin pubkey + up to 10 market values
        seeds = [b"oracle_state"],
        bump
    )]
    pub oracle_state: Account<'info, OracleState>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeTaskCounter<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + 8 + 1, // Space for u64 counter + bump
        seeds = [b"task_counter"],
        bump
    )]
    pub task_counter: Account<'info, TaskCounter>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeFactory<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 8 + 1, // Space for admin pubkey + u64 counter + bump
        seeds = [b"factory"],
        bump
    )]
    pub factory: Account<'info, Factory>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetMarketValue<'info> {
    #[account(
        mut,
        seeds = [b"oracle_state"],
        bump = oracle_state.bump
    )]
    pub oracle_state: Account<'info, OracleState>,
    
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetMarketValue<'info> {
    #[account(
        seeds = [b"oracle_state"],
        bump = oracle_state.bump
    )]
    pub oracle_state: Account<'info, OracleState>,
}

#[derive(Accounts)]
pub struct CreateTask<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 128 + 1 + 8 + 1 + 1 + size_of::<RaydiumSwapData>() + 1, // Add space for owner, market_id, condition, expected value, flags, swap data
        seeds = [b"task", user.key().as_ref(), &task_counter.counter.to_le_bytes()],
        bump
    )]
    pub task_account: Account<'info, TaskAccount>,
    
    #[account(
        mut,
        seeds = [b"task_counter"],
        bump = task_counter.bump
    )]
    pub task_counter: Account<'info, TaskCounter>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateExecutor<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"factory"],
        bump = factory.bump
    )]
    pub factory: Account<'info, Factory>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 4 + (32 * 50) + 8 + 1, // Space for owner pubkey + vector of up to 50 executors + counter + bump
        seeds = [b"user_registry", user.key().as_ref()],
        bump
    )]
    pub user_registry: Account<'info, UserRegistry>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 128 + 1 + 8 + 1 + 1 + size_of::<RaydiumSwapData>() + 1, // Add space for owner, market_id, condition, expected value, flags, swap data
        seeds = [b"executor", user.key().as_ref(), &task_counter.counter.to_le_bytes()],
        bump
    )]
    pub executor_account: Account<'info, TaskAccount>,
    
    #[account(
        mut,
        seeds = [b"task_counter"],
        bump = task_counter.bump
    )]
    pub task_counter: Account<'info, TaskCounter>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetUserExecutors<'info> {
    pub user: Signer<'info>,
    
    #[account(
        seeds = [b"user_registry", user.key().as_ref()],
        bump = user_registry.bump
    )]
    pub user_registry: Account<'info, UserRegistry>,
}

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct CheckAndExecute<'info> {
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"executor", user.key().as_ref(), &task_id.to_le_bytes()],
        bump = task_account.bump
    )]
    pub task_account: Account<'info, TaskAccount>,
    
    #[account(
        seeds = [b"oracle_state"],
        bump = oracle_state.bump
    )]
    pub oracle_state: Account<'info, OracleState>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct ExecuteTask<'info> {
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"executor", user.key().as_ref(), &task_id.to_le_bytes()],
        bump = task_account.bump
    )]
    pub task_account: Account<'info, TaskAccount>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct OracleState {
    pub admin: Pubkey,
    pub market_values: Vec<MarketValue>,
    pub bump: u8,
}

#[account]
pub struct TaskCounter {
    pub counter: u64,
    pub bump: u8,
}

#[account]
pub struct Factory {
    pub admin: Pubkey,
    pub user_executor_count: u64,
    pub bump: u8,
}

#[account]
pub struct UserRegistry {
    pub owner: Pubkey,
    pub executor_count: u64,
    pub executor_addresses: Vec<Pubkey>,
    pub bump: u8,
}

#[account]
pub struct TaskAccount {
    pub owner: Pubkey,
    pub market_id: String,
    pub condition_type: u8,
    pub expected_value: u64,
    pub is_executed: bool,
    pub ready_for_execution: bool,
    pub raydium_swap_data: RaydiumSwapData,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MarketValue {
    pub market_id: String,
    pub value: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RaydiumSwapData {
    pub token_in_mint: Pubkey,
    pub token_out_mint: Pubkey,
    pub pool_address: Pubkey,
    pub amount_in: u64,
    pub minimum_amount_out: u64,
    pub slippage_tolerance: u8,
    pub deadline: u64,
    pub reserved: [u8; 32], // Reserved for future use
}

#[error_code]
pub enum FateFiError {
    #[msg("Invalid condition type")]
    InvalidConditionType,
    #[msg("Market not found")]
    MarketNotFound,
    #[msg("Condition not met")]
    ConditionNotMet,
    #[msg("Task already executed")]
    TaskAlreadyExecuted,
}
