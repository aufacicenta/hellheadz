import { createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";

const client = createWalletClient({
  chain: sepolia,
  transport: http(),
});

export default client;
