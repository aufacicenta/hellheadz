import React, { useEffect, useState } from "react";
import { getContract } from "viem";

import { LarsKristoHellheads__factory } from "providers/evm/contracts/larskristohellheads/LarsKristoHellheads__factory";
import evm from "providers/evm";

import { LarskristoHellheadsContext } from "./LarskristoHellheadsContext";
import {
  LarskristoHellheadsContextActions,
  LarskristoHellheadsContextControllerProps,
  LarskristoHellheadsContextType,
  LarskristoHellheadsContractValues,
} from "./LarskristoHellheadsContext.types";

const SEPOLIA_TESTNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";
const ETHEREUM_MAINNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";

export const LarskristoHellheadsContextController = ({ children }: LarskristoHellheadsContextControllerProps) => {
  const [contractAddress, setContractAddress] = useState<string | undefined>();
  const [contractValues, setContractValues] = useState<LarskristoHellheadsContractValues>();
  const [actions, setActions] = useState<LarskristoHellheadsContextActions>({
    fetchContractValues: {
      isLoading: false,
    },
  });

  const ownerOf = async (tokenId: number) => {
    try {
      const contract = getContract({
        address: contractAddress as `0x{string}`,
        abi: LarsKristoHellheads__factory.abi,
        client: evm.client,
      });

      const owner = await contract.read.ownerOf([BigInt(tokenId)]);

      return owner;
    } catch (error) {
      console.error(error);
    }

    return "0x";
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
        address: address as `0x{string}`,
        abi: LarsKristoHellheads__factory.abi,
        client: evm.client,
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
  };

  return <LarskristoHellheadsContext.Provider value={props}>{children}</LarskristoHellheadsContext.Provider>;
};
