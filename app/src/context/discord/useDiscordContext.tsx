import { useContext } from "react";

import { DiscordContext } from "./DiscordContext";

export const useDiscordContext = () => {
  const context = useContext(DiscordContext);

  if (context === undefined) {
    throw new Error("useDiscordContext must be used within a DiscordContext");
  }

  return context;
};
