import { Config } from "@wagmi/core";
import { ReactNode } from "react";

export type ZeroXAddress = `0x${string}`;

export type EvmWalletSelectorContextControllerProps = {
  children: ReactNode;
};

export type EvmWalletSelectorContextType = {
  wagmiConfig: Config;
};
