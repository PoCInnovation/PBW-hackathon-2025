use anchor_lang::prelude::*;

// Instruction handlers for the Mock Polymarket Oracle
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
    return Err(ErrorCode::MarketNotFound.into());
}

// Account context for the set_market_value instruction
#[derive(Accounts)]
pub struct SetMarketValue<'info> {
    #[account(
        mut,
        seeds = [b"oracle_state"],
        bump,
    )]
    pub oracle_state: Account<'info, OracleState>,
    
    #[account(constraint = admin.key() == oracle_state.admin @ ErrorCode::Unauthorized)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

// Account context for the get_market_value instruction
#[derive(Accounts)]
pub struct GetMarketValue<'info> {
    #[account(seeds = [b"oracle_state"], bump)]
    pub oracle_state: Account<'info, OracleState>,
}

// State account for the mock oracle
#[account]
pub struct OracleState {
    pub admin: Pubkey,
    pub market_values: Vec<MarketValue>,
    pub bump: u8,
}

// Structure to hold market ID and its value
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MarketValue {
    pub market_id: Pubkey,
    pub value: u64,
}

// Initialize the oracle state account
#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 4 + (32 + 8) * 10 + 1, // Space for 10 markets initially
        seeds = [b"oracle_state"],
        bump,
    )]
    pub oracle_state: Account<'info, OracleState>,
    
    pub system_program: Program<'info, System>,
}

// Error codes for the oracle program
#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Market not found")]
    MarketNotFound,
}