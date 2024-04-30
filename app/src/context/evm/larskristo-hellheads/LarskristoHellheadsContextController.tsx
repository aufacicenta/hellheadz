import React, { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import { LarsKristoHellheads__factory } from "providers/evm/contracts/larskristohellheads/LarsKristoHellheads__factory";
import currency from "providers/currency";
import { ZeroXAddress } from "../wallet-selector/EvmWalletSelectorContext.types";
import evm from "providers/evm";

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
    setTokenForSale: {
      isPending: false,
      isConfirmed: false,
    },
    getTokenPrice: {
      isLoading: false,
    },
  });

  const { address: connectedAccountAddress } = useAccount();
  const { publicClient } = evm;

  const getContractInstance = () =>
    getContract({
      address: contractAddress as ZeroXAddress,
      abi: LarsKristoHellheads__factory.abi,
      client: publicClient,
    });

  const connectedAccountIsOwner = () => owner === connectedAccountAddress;

  const setTokenForSale = async (tokenId: number, price: string) => {
    try {
      setActions((prev) => ({
        ...prev,
        setTokenForSale: {
          isPending: true,
          isConfirmed: false,
        },
      }));

      const contract = getContractInstance();

      const hash = await contract.write.setTokenForSale([BigInt(tokenId), ethers.parseEther(price)], {
        account: connectedAccountAddress as ZeroXAddress,
        chain: undefined,
      });

      console.log({ hash });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log({ receipt });

      setActions((prev) => ({
        ...prev,
        setTokenForSale: {
          isPending: false,
          isConfirmed: true,
          transactionHash: receipt.transactionHash,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const buyToken = async (tokenId: number) => {
    try {
      setActions((prev) => ({
        ...prev,
        buyToken: {
          isPending: true,
          isConfirmed: false,
        },
      }));

      const contract = getContractInstance();

      const hash = await contract.write.buyToken([BigInt(tokenId)], {
        account: connectedAccountAddress as ZeroXAddress,
        value: tokenPrice?.rawValue!,
        chain: undefined,
      });

      console.log({ hash });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log({ receipt });

      setActions((prev) => ({
        ...prev,
        buyToken: {
          isPending: false,
          isConfirmed: true,
          transactionHash: receipt.transactionHash,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getTokenPrice = async (tokenId: number, options?: { excludeExchangeRate?: boolean }) => {
    try {
      setActions((prev) => ({
        ...prev,
        getTokenPrice: {
          isLoading: true,
        },
      }));

      const contract = getContractInstance();

      const rawValue = await contract.read.getTokenPrice([BigInt(tokenId)]);
      const formattedValue = ethers.formatEther(rawValue);

      const values: TokenPrice = {
        rawValue,
        formattedValue,
      };

      if (!options?.excludeExchangeRate) {
        const exchangeRate = await currency.getCoinCurrentPrice("ethereum", "usd");
        const exchangeRateFormatted = currency.formatFiatCurrency(Number(formattedValue) * exchangeRate);
        values.exchangeRate = exchangeRate;
        values.exchangeRateFormatted = exchangeRateFormatted;
      }

      setTokenPrice(values);

      setActions((prev) => ({
        ...prev,
        getTokenPrice: {
          isLoading: false,
        },
      }));

      return values;
    } catch (error) {
      console.error(error);
      setTokenPrice(undefined);
    }

    setActions((prev) => ({
      ...prev,
      getTokenPrice: {
        isLoading: false,
      },
    }));

    return {
      rawValue: BigInt(0),
      formattedValue: "0.00",
    };
  };

  const royaltyInfo = async (tokenId: number) => {
    try {
      const contract = getContractInstance();

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
      const contract = getContractInstance();

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
        client: publicClient,
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
    connectedAccountIsOwner,
    setTokenForSale,
  };

  return <LarskristoHellheadsContext.Provider value={props}>{children}</LarskristoHellheadsContext.Provider>;
};
