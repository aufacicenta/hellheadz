use near_sdk::{env, log};
use shared::OutcomeId;

use crate::{
    storage::{OutcomeToken, WrappedBalance},
    OutcomeTokenResult,
};

impl Default for OutcomeToken {
    fn default() -> Self {
        panic!("OutcomeToken should be initialized before usage")
    }
}

impl OutcomeToken {
    pub fn new(outcome_id: &OutcomeId, prompt: String, initial_supply: WrappedBalance) -> Self {
        Self {
            outcome_id: outcome_id.clone(),
            prompt,
            result: None,
            output_img_uri: None,
            total_supply: initial_supply,
        }
    }

    pub fn burn(&mut self) {
        self.total_supply -= self.total_supply();

        log!(
            "Burned {} of outcome_id [{}]. total_supply: {}",
            self.total_supply(),
            self.outcome_id,
            self.total_supply()
        );
    }

    pub fn set_result(&mut self, result: OutcomeTokenResult) {
        if let Some(_r) = self.result {
            env::panic_str("ERR_SET_RESULT_ALREADY_SET");
        }

        self.result = Some(result);
    }

    pub fn set_output_img_uri(&mut self, output_img_uri: String) {
        if let Some(_r) = &self.output_img_uri {
            env::panic_str("ERR_SET_OUTPUT_IMG_URI_ALREADY_SET");
        }

        self.output_img_uri = Some(output_img_uri);
    }

    pub fn get_balance_of(&self) -> WrappedBalance {
        self.total_supply
    }

    pub fn total_supply(&self) -> WrappedBalance {
        self.total_supply
    }

    pub fn outcome_id(&self) -> OutcomeId {
        self.outcome_id.clone()
    }

    pub fn get_prompt(&self) -> String {
        self.prompt.clone()
    }

    pub fn get_result(&self) -> Option<OutcomeTokenResult> {
        self.result
    }

    pub fn get_output_img_uri(&self) -> Option<String> {
        self.output_img_uri.clone()
    }
}