/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import { Client, getContract } from "viem";

import { ZeroXAddress } from "context/evm/wallet-selector/EvmWalletSelectorContext.types";

export const SEPOLIA_TESTNET_ADDRESS = "0xF105D9C64EFB6213d01495B862D936023C39D25A";
export const ETHEREUM_MAINNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";

export class ERC721Instance {
  contract: any;

  constructor(address: string, abi: any, client: Client) {
    this.contract = getContract({
      address: address as ZeroXAddress,
      abi,
      client,
    });
  }

  async ownerOf(tokenId: number) {
    return await this.contract.read.ownerOf([BigInt(tokenId)]);
  }

  static get defaultContractAddress() {
    return process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet"
      ? SEPOLIA_TESTNET_ADDRESS
      : ETHEREUM_MAINNET_ADDRESS;
  }
}
