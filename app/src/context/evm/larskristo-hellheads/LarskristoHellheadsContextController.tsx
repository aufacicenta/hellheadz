import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { LarsKristoHellheadz__factory } from "providers/evm/contracts/larskristohellheads/LarsKristoHellheadz__factory";
import { ZeroXAddress } from "../wallet-selector/EvmWalletSelectorContext.types";
import { publicClient } from "providers/evm/client";
import { ERC721Instance } from "providers/evm/ERC721Instance";

import { LarskristoHellheadsContext } from "./LarskristoHellheadsContext";
import {
  LarskristoHellheadsContextActions,
  LarskristoHellheadsContextControllerProps,
  LarskristoHellheadsContextType,
  LarskristoHellheadsContractValues,
  Royalty,
} from "./LarskristoHellheadsContext.types";

export const LarskristoHellheadsContextController = ({ children }: LarskristoHellheadsContextControllerProps) => {
  const [contract, setContractInstance] = useState<ERC721Instance | undefined>();
  const [contractValues, setContractValues] = useState<LarskristoHellheadsContractValues>();
  const [owner, setOwner] = useState<ZeroXAddress>();
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

  const connectedAccountIsOwner = () => !!owner && !!connectedAccountAddress && owner === connectedAccountAddress;

  const ownerOf = async (tokenId: number) => {
    if (!contract) return;

    try {
      const result = await contract.ownerOf(tokenId);

      setOwner(result);
    } catch (error) {
      console.error(error);
    }
  };

  const tokenURI = async (tokenId: number) => {
    if (!contract) return undefined;

    try {
      const result = await contract.tokenURI(tokenId);

      return result;
    } catch (error) {
      console.error(error);
    }

    return undefined;
  };

  const fetchContractValues = async () => {
    if (!contract) return;

    setActions((prev) => ({
      ...prev,
      fetchContractValues: {
        isLoading: true,
      },
    }));

    try {
      const [name, symbol, author, totalSupply, tokenLimit] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.author(),
        contract.totalSupply(),
        contract.tokenLimit(),
      ]);

      const values: LarskristoHellheadsContractValues = {
        name,
        symbol,
        author,
        totalSupply: totalSupply.toString(),
        tokenLimit: tokenLimit.toString(),
      };

      setContractValues(values);
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
    const ERC721 = new ERC721Instance(
      ERC721Instance.defaultContractAddress,
      LarsKristoHellheadz__factory.abi,
      publicClient,
    );

    setContractInstance(ERC721);
  }, []);

  useEffect(() => {
    if (!contract) return;

    (async () => {
      await fetchContractValues();
    })();
  }, [contract]);

  const props: LarskristoHellheadsContextType = {
    fetchContractValues,
    contractValues,
    actions,
    contract,
    ownerOf,
    tokenURI,
    owner,
    royalty,
    connectedAccountIsOwner,
  };

  return <LarskristoHellheadsContext.Provider value={props}>{children}</LarskristoHellheadsContext.Provider>;
};
