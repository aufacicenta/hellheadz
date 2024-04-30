import { createContext } from "react";

import { LarskristoHellheadsContextType } from "./LarskristoHellheadsContext.types";

export const LarskristoHellheadsContext = createContext<LarskristoHellheadsContextType | undefined>(undefined);
