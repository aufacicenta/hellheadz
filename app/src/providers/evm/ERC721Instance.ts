/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import { Client, getContract } from "viem";

import { ZeroXAddress } from "context/evm/wallet-selector/EvmWalletSelectorContext.types";

export const SEPOLIA_TESTNET_ADDRESS = "0xB63dB681223223379d15eB7d6E21fDeEeE4ac0D8";
export const ETHEREUM_MAINNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";

export class ERC721Instance {
  contract: any;

  address: ZeroXAddress;

  constructor(address: string, abi: any, client: Client) {
    this.address = address as ZeroXAddress;
    this.contract = getContract({
      address: address as ZeroXAddress,
      abi,
      client,
    });
  }

  async ownerOf(tokenId: number) {
    return await this.contract.read.ownerOf([BigInt(tokenId)]);
  }

  async name() {
    return await this.contract.read.name();
  }

  async symbol() {
    return await this.contract.read.symbol();
  }

  async author() {
    return await this.contract.read.author();
  }

  async totalSupply() {
    return await this.contract.read.totalSupply();
  }

  async tokenLimit() {
    return await this.contract.read.tokenLimit();
  }

  static get defaultContractAddress() {
    return process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet"
      ? SEPOLIA_TESTNET_ADDRESS
      : ETHEREUM_MAINNET_ADDRESS;
  }
}
