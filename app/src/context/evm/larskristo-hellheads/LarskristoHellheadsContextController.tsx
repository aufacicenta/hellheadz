import React, { useEffect, useState } from "react";
import { getContract } from "viem";
import { useAccount } from "wagmi";

import { LarsKristoHellheadz__factory } from "providers/evm/contracts/larskristohellheads/LarsKristoHellheadz__factory";
import { ZeroXAddress } from "../wallet-selector/EvmWalletSelectorContext.types";
import evm from "providers/evm";

import { LarskristoHellheadsContext } from "./LarskristoHellheadsContext";
import {
  LarskristoHellheadsContextActions,
  LarskristoHellheadsContextControllerProps,
  LarskristoHellheadsContextType,
  LarskristoHellheadsContractValues,
  Royalty,
} from "./LarskristoHellheadsContext.types";

const SEPOLIA_TESTNET_ADDRESS = "0xF105D9C64EFB6213d01495B862D936023C39D25A";
const ETHEREUM_MAINNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";

export const LarskristoHellheadsContextController = ({ children }: LarskristoHellheadsContextControllerProps) => {
  const [contractAddress, setContractAddress] = useState<string | undefined>();
  const [contractValues, setContractValues] = useState<LarskristoHellheadsContractValues>();
  const [owner, setOwner] = useState<`0x${string}`>();
  const [royalty] = useState<Royalty | undefined>();
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
      abi: LarsKristoHellheadz__factory.abi,
      client: publicClient,
    });

  const connectedAccountIsOwner = () => owner === connectedAccountAddress;

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
        abi: LarsKristoHellheadz__factory.abi,
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
    royalty,
    connectedAccountIsOwner,
  };

  return <LarskristoHellheadsContext.Provider value={props}>{children}</LarskristoHellheadsContext.Provider>;
};
