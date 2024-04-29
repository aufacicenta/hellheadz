import { createPublicClient, createWalletClient, custom, http } from "viem";
import { mainnet, sepolia } from "viem/chains";

export const walletClient = createWalletClient({
  chain: process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet" ? sepolia : mainnet,
  transport: window !== undefined && (window as any).ethereum ? custom((window as any).ethereum) : http(),
});

export const publicClient = createPublicClient({
  chain: process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet" ? sepolia : mainnet,
  transport: window !== undefined && (window as any).ethereum ? custom((window as any).ethereum) : http(),
});
