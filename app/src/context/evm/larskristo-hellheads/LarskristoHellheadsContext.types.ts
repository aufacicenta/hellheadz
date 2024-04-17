import { ReactNode } from "react";

import { LarsKristoHellheads } from "providers/evm/contracts/larskristohellheads/LarsKristoHellheads";

export type LarskristoHellheadsContextControllerProps = {
  children: ReactNode;
};

export type LarskristoHellheadsContextActions = {
  fetchContractValues: { isLoading: boolean };
};

export type LarskristoHellheadsContractValues = {
  name: LarsKristoHellheads["name"];
  symbol: LarsKristoHellheads["symbol"];
};

export type LarskristoHellheadsContextType = {
  contractValues?: LarskristoHellheadsContractValues;
  actions: LarskristoHellheadsContextActions;
  fetchContractValues: (address: string) => Promise<void>;
};
