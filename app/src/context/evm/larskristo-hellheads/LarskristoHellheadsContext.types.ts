import { ReactNode } from "react";

import { ZeroXAddress } from "../wallet-selector/EvmWalletSelectorContext.types";
import { ERC721Instance } from "providers/evm/ERC721Instance";

export type LarskristoHellheadsContextControllerProps = {
  children: ReactNode;
};

export type LarskristoHellheadsContextActions = {
  fetchContractValues: { isLoading: boolean };
  getTokenPrice: { isLoading: boolean };
  buyToken: { isPending: boolean; isConfirmed: boolean; transactionHash?: string };
  setTokenForSale: { isPending: boolean; isConfirmed: boolean; transactionHash?: string };
};

export type LarskristoHellheadsContractValues = {
  name: string;
  symbol: string;
  author: string;
  totalSupply: number;
  tokenLimit: number;
};

export type TokenPrice = {
  rawValue: bigint;
  formattedValue: string;
  exchangeRate?: number;
  exchangeRateFormatted?: string;
};

export type Royalty = {
  rawValue: bigint;
  percentage: number;
  percentageFormatted: string;
};

export type LarskristoHellheadsContextType = {
  contractValues?: LarskristoHellheadsContractValues;
  contract?: ERC721Instance;
  actions: LarskristoHellheadsContextActions;
  owner?: ZeroXAddress;
  tokenPrice?: TokenPrice;
  royalty?: Royalty;
  fetchContractValues: (address: string) => Promise<void>;
  ownerOf: (tokenId: number) => Promise<void>;
  connectedAccountIsOwner: () => boolean;
};
