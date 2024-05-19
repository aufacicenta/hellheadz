import { createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "wagmi";

const chains = [mainnet, sepolia] as const;

const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export default {
  defaultConfig: config,
};
