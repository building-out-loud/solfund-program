use anchor_lang::prelude::*;

#[program]
mod solfund_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64, data: String) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        msg!("First {}, {}", amount, data);
        my_account.amount = amount;
        my_account.data = data.to_string();

        msg!("Second {} {}", my_account.amount, my_account.data);

        Ok(())
    }

    pub fn update(ctx: Context<Update>, amount: u64, data: String) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        my_account.amount = amount;
        my_account.data = data.to_string();

        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64, data: String) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;

        let k = **ctx
            .accounts
            .my_account
            .to_account_info()
            .try_borrow_lamports()?;

        **ctx
            .accounts
            .my_account
            .to_account_info()
            .try_borrow_mut_lamports()? = 0;

        **ctx.accounts.wallet_address.try_borrow_mut_lamports()? += k;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 100)]
    pub my_account: ProgramAccount<'info, MyAccount>,
    pub user: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub my_account: ProgramAccount<'info, MyAccount>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub my_account: ProgramAccount<'info, MyAccount>,
    #[account(mut)]
    pub wallet_address: AccountInfo<'info>,
}

#[account]
pub struct MyAccount {
    pub amount: u64,
    pub data: String,
}
