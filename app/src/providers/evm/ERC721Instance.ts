/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
import { Client, getContract } from "viem";
import axios from "axios";

import { ZeroXAddress } from "context/evm/wallet-selector/EvmWalletSelectorContext.types";

export const SEPOLIA_TESTNET_ADDRESS = "0xB63dB681223223379d15eB7d6E21fDeEeE4ac0D8";
export const ETHEREUM_MAINNET_ADDRESS = "0x853bdaa30Cfd5A2Ec1E1d75935eBca7A0E52626D";

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

  async tokenURI(tokenId: number) {
    return await this.contract.read.tokenURI([BigInt(tokenId)]);
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
    const tokenLimit = await this.contract.read.tokenLimit();

    console.log(`ERC721Instance.getTokenMetadata`, tokenLimit);

    return tokenLimit;
  }

  static get defaultContractAddress() {
    return process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet"
      ? SEPOLIA_TESTNET_ADDRESS
      : ETHEREUM_MAINNET_ADDRESS;
  }

  static async getTokenMetadata(tokenURI: string) {
    try {
      const result = await axios.get(tokenURI, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`ERC721Instance.getTokenMetadata`, result.data);

      return result;
    } catch (error) {
      console.error(error);
    }

    return undefined;
  }
}
