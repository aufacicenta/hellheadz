import { MarketData } from "../market/market.types";

export type DeployMarketContractArgs = {
  market: MarketData;
  dao_account_id: string;
  collateral_token_account_id: string;
  staking_token_account_id: string;
  fee_ratio: number;
  collateral_token_decimals: number;
};

export type MarketFactoryContractValues = {
  marketsCount: number;
};

export type MarketContractMethods = {
  get_markets_list: () => Promise<Array<string>>;
  get_markets_count: () => Promise<number>;
  get_markets: () => Promise<Array<string>>;
  create_market: (args: { name: string; args: string }, gas?: number, amount?: string | null) => Promise<boolean>;
};
