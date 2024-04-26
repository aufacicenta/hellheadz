import React, { useEffect, useState } from "react";
import { Client, getContract } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { getClient } from "@wagmi/core";
import { ethers } from "ethers";

import { LarsKristoHellheads__factory } from "providers/evm/contracts/larskristohellheads/LarsKristoHellheads__factory";
import { useEvmWalletSelectorContext } from "../wallet-selector/useEvmWalletSelectorContext";
import currency from "providers/currency";
import { ZeroXAddress } from "../wallet-selector/EvmWalletSelectorContext.types";

import { LarskristoHellheadsContext } from "./LarskristoHellheadsContext";
import {
  LarskristoHellheadsContextActions,
  LarskristoHellheadsContextControllerProps,
  LarskristoHellheadsContextType,
  LarskristoHellheadsContractValues,
  Royalty,
  TokenPrice,
} from "./LarskristoHellheadsContext.types";

const SEPOLIA_TESTNET_ADDRESS = "0x2abbf9c29606b4c752944942aa9952ac2cdf552b";
const ETHEREUM_MAINNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";

export const LarskristoHellheadsContextController = ({ children }: LarskristoHellheadsContextControllerProps) => {
  const [contractAddress, setContractAddress] = useState<string | undefined>();
  const [contractValues, setContractValues] = useState<LarskristoHellheadsContractValues>();
  const [owner, setOwner] = useState<`0x${string}`>();
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | undefined>();
  const [royalty, setRoyaltyInfo] = useState<Royalty | undefined>();
  const [actions, setActions] = useState<LarskristoHellheadsContextActions>({
    fetchContractValues: {
      isLoading: false,
    },
    buyToken: {
      isPending: false,
      isConfirmed: false,
    },
  });

  const { address: connectedAccountAddress, chainId } = useAccount();
  const { wagmiConfig } = useEvmWalletSelectorContext();
  const { data: hash, error: writeContractError, writeContract, isPending } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    setActions((prev) => ({
      ...prev,
      buyToken: {
        isPending: isPending || isConfirming,
        isConfirmed,
        transactionHash: data?.transactionHash,
      },
    }));
  }, [isPending, isConfirming, isConfirmed, data]);

  if (writeContractError) {
    console.error(writeContractError);
  }

  const client = getClient(wagmiConfig, { chainId }) as Client;

  const buyToken = async (tokenId: number) => {
    try {
      await writeContract({
        address: contractAddress as ZeroXAddress,
        abi: LarsKristoHellheads__factory.abi,
        functionName: "buyToken" as "buyToken",
        args: [BigInt(tokenId)],
        account: connectedAccountAddress as ZeroXAddress,
        value: tokenPrice?.rawValue!,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getTokenPrice = async (tokenId: number) => {
    try {
      const contract = getContract({
        address: contractAddress as ZeroXAddress,
        abi: LarsKristoHellheads__factory.abi,
        client,
      });

      const rawValue = await contract.read.getTokenPrice([BigInt(tokenId)]);
      const formattedValue = ethers.formatEther(rawValue);
      const exchangeRate = await currency.getCoinCurrentPrice("ethereum", "usd");
      const exchangeRateFormatted = currency.formatFiatCurrency(Number(formattedValue) * exchangeRate);

      setTokenPrice({
        rawValue,
        formattedValue,
        exchangeRate,
        exchangeRateFormatted,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const royaltyInfo = async (tokenId: number) => {
    try {
      const contract = getContract({
        address: contractAddress as ZeroXAddress,
        abi: LarsKristoHellheads__factory.abi,
        client,
      });

      const [, rawValue] = await contract.read.royaltyInfo([BigInt(tokenId), tokenPrice!.rawValue]);
      const percentage = Number(ethers.formatEther(rawValue)) / Number(ethers.formatEther(tokenPrice!.rawValue));

      setRoyaltyInfo({
        rawValue,
        percentage,
        percentageFormatted: `${(percentage * 100).toFixed(2)}%`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ownerOf = async (tokenId: number) => {
    try {
      const contract = getContract({
        address: contractAddress as ZeroXAddress,
        abi: LarsKristoHellheads__factory.abi,
        client,
      });

      const result = await contract.read.ownerOf([BigInt(tokenId)]);

      setOwner(result);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContractValues = async (address: string) => {
    setActions((prev) => ({
      ...prev,
      fetchContractValues: {
        isLoading: true,
      },
    }));

    try {
      const contract = getContract({
        address: address as ZeroXAddress,
        abi: LarsKristoHellheads__factory.abi,
        client,
      });

      const [name, symbol] = await Promise.all([contract.read.name(), contract.read.symbol()]);

      const values: LarskristoHellheadsContractValues = {
        name,
        symbol,
      };

      setContractValues({ ...values });
    } catch (error) {
      console.error(error);
    }

    setActions((prev) => ({
      ...prev,
      fetchContractValues: {
        isLoading: false,
      },
    }));
  };

  useEffect(() => {
    const address =
      process.env.NEXT_PUBLIC_DEFAULT_NETWORK_ENV === "testnet" ? SEPOLIA_TESTNET_ADDRESS : ETHEREUM_MAINNET_ADDRESS;
    setContractAddress(address);

    (async () => {
      await fetchContractValues(address);
    })();
  }, []);

  const props: LarskristoHellheadsContextType = {
    fetchContractValues,
    contractValues,
    actions,
    contractAddress,
    ownerOf,
    owner,
    buyToken,
    getTokenPrice,
    tokenPrice,
    royaltyInfo,
    royalty,
  };

  return <LarskristoHellheadsContext.Provider value={props}>{children}</LarskristoHellheadsContext.Provider>;
};
