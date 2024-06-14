import { createContext } from "react";

import { AnalyticsContextType } from "./AnalyticsContext.types";

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);
