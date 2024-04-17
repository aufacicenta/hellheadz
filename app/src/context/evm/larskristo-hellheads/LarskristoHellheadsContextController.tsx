import React, { useState } from "react";
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

export const LarskristoHellheadsContextController = ({ children }: LarskristoHellheadsContextControllerProps) => {
  const [contractValues, setContractValues] = useState<LarskristoHellheadsContractValues>();
  const [actions, setActions] = useState<LarskristoHellheadsContextActions>({
    fetchContractValues: {
      isLoading: false,
    },
  });

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

  const props: LarskristoHellheadsContextType = {
    fetchContractValues,
    contractValues,
    actions,
  };

  return <LarskristoHellheadsContext.Provider value={props}>{children}</LarskristoHellheadsContext.Provider>;
};
