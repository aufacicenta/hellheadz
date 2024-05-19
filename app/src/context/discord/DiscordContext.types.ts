import { ReactNode } from "react";

export type DiscordContextControllerProps = {
  children: ReactNode;
};

export type DiscordContextType = {
  isLoggedIn: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oauth: Record<string, any> | undefined;
};
