import { mainnet, sepolia } from "viem/chains";
import { createPublicClient, createWalletClient, http } from "viem";

const chain = process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet" ? sepolia : mainnet;

export const localWalletClient = createWalletClient({
  chain,
  transport: http(),
});

export const localPublicClient = createPublicClient({
  chain,
  transport: http(),
});
