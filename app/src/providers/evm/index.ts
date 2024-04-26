import client from "./client";

const getBlockExplorerUrl = () =>
  process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet" ? "https://sepolia.etherscan.io" : "https://etherscan.io";

export default {
  client,
  getBlockExplorerUrl,
};
