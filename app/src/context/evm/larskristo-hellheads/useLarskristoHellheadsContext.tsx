import { useContext } from "react";

import { LarskristoHellheadsContext } from "./LarskristoHellheadsContext";

export const useLarskristoHellheadsContext = () => {
  const context = useContext(LarskristoHellheadsContext);

  if (context === undefined) {
    throw new Error("useLarskristoHellheadsContext must be used within a LarskristoHellheadsContext");
  }

  return context;
};
