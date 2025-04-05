use anchor_lang::prelude::*;

declare_id!("DqmfAUS38MmoauCmgJWVgfTnRLfbiZ7Q18UL4Hz5hoR5");

#[program]
pub mod fatefi {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
