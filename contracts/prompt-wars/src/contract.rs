use near_sdk::{
    collections::LookupMap, env, ext_contract, json_types::U128, log, near_bindgen, serde_json,
    AccountId, Promise,
};
use num_format::ToFormattedString;
use shared::OutcomeId;
use std::default::Default;

use near_contract_standards::fungible_token::core::ext_ft_core;

use crate::consts::*;
use crate::outcome_token;
use crate::storage::*;

#[ext_contract(ext_self)]
trait Callbacks {
    fn on_ft_transfer_callback(
        &mut self,
        amount: WrappedBalance,
        payee: AccountId,
        outcome_id: OutcomeId,
        amount_payable: WrappedBalance,
    ) -> String;
}

#[ext_contract(ext_feed_parser)]
trait SwitchboardFeedParser {
    fn aggregator_read(&self, msg: String) -> Promise;
}

impl Default for Market {
    fn default() -> Self {
        env::panic_str("ERR_MARKET_NOT_INITIALIZED")
    }
}

#[near_bindgen]
impl Market {
    #[init]
    pub fn new(
        market: MarketData,
        management: Management,
        collateral_token: CollateralToken,
    ) -> Self {
        if env::state_exists() {
            env::panic_str("ERR_ALREADY_INITIALIZED");
        }

        // Add 5 minutes
        let reveal_window = market.ends_at + 300_000;
        // Add 5 minutes
        let resolution_window = reveal_window + 300_000;

        // 30 days
        let self_destruct_window = resolution_window + 2_592_000 * 1_000_000_000;

        Self {
            market,
            outcome_tokens: LookupMap::new(StorageKeys::OutcomeTokens),
            players: Vec::new(),
            resolution: Resolution {
                window: resolution_window,
                reveal_window,
                resolved_at: None,
                result: None,
            },
            fees: Fees {
                price: CREATE_OUTCOME_TOKEN_PRICE,
                fee_ratio: FEE_RATIO,
            },
            collateral_token: CollateralToken {
                balance: 0,
                fee_balance: 0,
                // @TODO collateral_token_decimals should be set by a cross-contract call to ft_metadata
                ..collateral_token
            },
            management: Management {
                self_destruct_window,
                buy_sell_threshold: BUY_SELL_THRESHOLD,
                ..management
            },
        }
    }

    #[private]
    #[payable]
    pub fn create_outcome_token(
        &mut self,
        sender_id: AccountId,
        amount: WrappedBalance,
        payload: CreateOutcomeTokenArgs,
    ) -> WrappedBalance {
        self.assert_is_open();
        self.assert_is_not_resolved();
        self.assert_price(amount);

        let outcome_id = sender_id;
        let prompt = payload.prompt;

        match self.outcome_tokens.get(&outcome_id) {
            Some(_token) => env::panic_str("ERR_CREATE_OUTCOME_TOKEN_outcome_id_EXIST"),
            None => {
                self.internal_create_outcome_token(outcome_id, prompt, amount);
            }
        }

        amount
    }

    #[payable]
    pub fn sell(&mut self) -> WrappedBalance {
        // @TODO if there are participants only in 1 outcome, allow to claim funds after resolution, otherwise funds will be locked
        if self.is_expired_unresolved() {
            return self.internal_sell_unresolved();
        }

        self.assert_is_not_under_resolution();
        self.assert_is_resolved();
        self.assert_is_winner(&env::signer_account_id());

        return self.internal_sell_resolved();
    }

    #[payable]
    pub fn reveal(&mut self, outcome_id: OutcomeId, result: OutcomeTokenResult) {
        self.assert_only_owner();
        self.assert_is_reveal_window_open();
        self.assert_is_not_resolved();
        self.assert_is_valid_outcome(&outcome_id);
        self.assert_is_resolution_window_open();

        let mut outcome_token = self.outcome_tokens.get(&outcome_id).unwrap();
        outcome_token.set_result(result);

        self.outcome_tokens.insert(&outcome_id, &outcome_token);

        self.resolution.resolved_at = Some(self.get_block_timestamp());
    }

    #[payable]
    pub fn resolve(&mut self, outcome_id: OutcomeId) {
        self.assert_only_owner();
        self.assert_is_not_resolved();
        self.assert_is_valid_outcome(&outcome_id);
        self.assert_is_resolution_window_open();

        // @TODO the server (owner) will call this method after the reveal period.
        // @TODO the server should iterate over all participants with a valid outcome_token.result and determine which is closer to 0
        // Or should the contract iterate over all? What's the cost?

        self.resolution.result = Some(outcome_id.clone());

        self.burn_the_losers(outcome_id);

        self.resolution.resolved_at = Some(self.get_block_timestamp());
    }

    #[private]
    pub fn update_collateral_token_balance(&mut self, amount: WrappedBalance) -> WrappedBalance {
        self.collateral_token.balance = amount;

        log!(
            "update_collateral_token_balance: {}",
            amount.to_formatted_string(&FORMATTED_STRING_LOCALE)
        );

        self.collateral_token.balance
    }

    #[private]
    pub fn update_collateral_token_fee_balance(
        &mut self,
        amount: WrappedBalance,
    ) -> WrappedBalance {
        self.collateral_token.fee_balance += amount;

        log!(
            "update_collateral_token_fee_balance, in: {}, total: {}",
            amount.to_formatted_string(&FORMATTED_STRING_LOCALE),
            self.collateral_token
                .fee_balance
                .to_formatted_string(&FORMATTED_STRING_LOCALE)
        );

        self.collateral_token.fee_balance
    }
}

impl Market {
    // Mint a new token for the player
    fn internal_create_outcome_token(
        &mut self,
        outcome_id: OutcomeId,
        prompt: String,
        amount: WrappedBalance,
    ) -> WrappedBalance {
        let (amount_mintable, fee) = self.get_amount_mintable(amount);

        let outcome_token = OutcomeToken::new(&outcome_id, prompt, amount_mintable);

        self.players.push(outcome_id.clone());

        self.outcome_tokens.insert(&outcome_id, &outcome_token);

        self.update_collateral_token_balance(self.collateral_token.balance + amount_mintable);
        self.update_collateral_token_fee_balance(fee);

        self.outcome_tokens.insert(&outcome_id, &outcome_token);

        log!("CREATE_OUTCOME_TOKEN amount: {}, fee_ratio: {}, fee_result: {}, outcome_id: {}, sender_id: {}, ot_supply: {}, amount_mintable: {}, ct_balance: {}, fee_balance: {}",
            amount.to_formatted_string(&FORMATTED_STRING_LOCALE),
            self.fees.fee_ratio.to_formatted_string(&FORMATTED_STRING_LOCALE),
            fee.to_formatted_string(&FORMATTED_STRING_LOCALE),
            outcome_token.outcome_id,
            outcome_id,
            outcome_token.total_supply().to_formatted_string(&FORMATTED_STRING_LOCALE),
            amount_mintable.to_formatted_string(&FORMATTED_STRING_LOCALE),
            self.collateral_token.balance.to_formatted_string(&FORMATTED_STRING_LOCALE),
            self.collateral_token.fee_balance.to_formatted_string(&FORMATTED_STRING_LOCALE),
        );

        amount_mintable
    }

    // Sets the is_active flag to false on each losing outcome token
    fn burn_the_losers(&mut self, outcome_id: OutcomeId) {
        for p_id in self.players.iter() {
            if p_id != &outcome_id {
                let mut outcome_token = self.get_outcome_token(&p_id);
                outcome_token.deactivate();
                self.outcome_tokens.insert(&(p_id), &outcome_token);
            }
        }
    }

    fn internal_sell_unresolved(&mut self) -> WrappedBalance {
        let payee = env::signer_account_id();

        let (amount_payable, _weight) = self.get_amount_payable_unresolved(payee.clone());

        self.internal_transfer(payee, amount_payable)
    }

    fn internal_sell_resolved(&mut self) -> WrappedBalance {
        let payee = env::signer_account_id();

        let (amount_payable, _weight) = self.get_amount_payable_resolved();

        self.internal_transfer(payee.clone(), amount_payable)
    }

    fn internal_transfer(
        &mut self,
        payee: AccountId,
        amount_payable: WrappedBalance,
    ) -> WrappedBalance {
        if amount_payable <= 0 {
            env::panic_str("ERR_CANT_SELL_A_LOSING_OUTCOME");
        }

        let outcome_token = self.get_outcome_token(&payee);

        log!(
            "TRANSFER amount: {},  account_id: {}, supply: {}, is_resolved: {}, ct_balance: {}, amount_payable: {}",
            amount_payable.to_formatted_string(&FORMATTED_STRING_LOCALE),
            payee,
            outcome_token.total_supply().to_formatted_string(&FORMATTED_STRING_LOCALE),
            self.is_resolved(),
            self.collateral_token.balance.to_formatted_string(&FORMATTED_STRING_LOCALE),
            amount_payable.to_formatted_string(&FORMATTED_STRING_LOCALE),
        );

        let ft_transfer_promise = ext_ft_core::ext(self.collateral_token.id.clone())
            .with_attached_deposit(FT_TRANSFER_BOND)
            .with_static_gas(GAS_FT_TRANSFER)
            .ft_transfer(payee.clone(), U128::from(amount_payable), None);

        let ft_transfer_callback_promise = ext_self::ext(env::current_account_id())
            .with_attached_deposit(0)
            .with_static_gas(GAS_FT_TRANSFER_CALLBACK)
            .on_ft_transfer_callback(
                amount_payable,
                payee,
                outcome_token.outcome_id,
                amount_payable,
            );

        ft_transfer_promise.then(ft_transfer_callback_promise);

        amount_payable
    }
}
