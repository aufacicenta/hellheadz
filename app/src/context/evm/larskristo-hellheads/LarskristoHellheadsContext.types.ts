import { ReactNode } from "react";

export type LarskristoHellheadsContextControllerProps = {
  children: ReactNode;
};

export type LarskristoHellheadsContextActions = {
  fetchContractValues: { isLoading: boolean };
};

export type LarskristoHellheadsContractValues = {
  name: string;
  symbol: string;
};

export type LarskristoHellheadsContextType = {
  contractValues?: LarskristoHellheadsContractValues;
  contractAddress?: string;
  actions: LarskristoHellheadsContextActions;
  fetchContractValues: (address: string) => Promise<void>;
  ownerOf: (tokenId: number) => Promise<`0x${string}`>;
};
