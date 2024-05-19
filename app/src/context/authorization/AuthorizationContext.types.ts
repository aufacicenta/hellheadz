import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import { ReactNode } from "react";

export type AccessTokens = {
  [OAuthTokenStoreKey.discord_oauth]?: string | null;
};

export type AuthItem = {
  name: string;
  isAuthorized: boolean;
  key: OAuthTokenStoreKey;
};

export type AuthorizationContextControllerProps = {
  children: ReactNode;
};

export type AuthorizationContextType = {
  accessTokens: AccessTokens;
  authItems: Array<AuthItem>;
  getCookieValueAsObject: (key: OAuthTokenStoreKey) => Record<string, string | number>;
  revokeAuth: (key: OAuthTokenStoreKey) => void;
  getGuestId: () => string | null;
  getOpenAISessionID: () => string | undefined;
  generateGuestId: () => string;
  setOpenAISessionID: (threadId: string) => void;
  verifyDiscordAuthorization: () => Promise<void>;
};
