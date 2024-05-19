import { createContext } from "react";

import { DiscordContextType } from "./DiscordContext.types";

export const DiscordContext = createContext<DiscordContextType | undefined>(undefined);
