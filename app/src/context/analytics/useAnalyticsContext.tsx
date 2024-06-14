import { useContext } from "react";

import { AnalyticsContext } from "./AnalyticsContext";

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error("useAnalyticsContext must be used within a AnalyticsContext");
  }

  return context;
};
