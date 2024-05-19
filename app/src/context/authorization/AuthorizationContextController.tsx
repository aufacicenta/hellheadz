import React, { useState } from "react";
import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";
import { LocalStorageKeys } from "hooks/useLocalStorage/useLocalStorage.types";

import {
  AccessTokens,
  AuthItem,
  AuthorizationContextControllerProps,
  AuthorizationContextType,
} from "./AuthorizationContext.types";
import { AuthorizationContext } from "./AuthorizationContext";

export const AuthorizationContextController = ({ children }: AuthorizationContextControllerProps) => {
  const [accessTokens, setAccessTokens] = useState<AccessTokens>({});
  const [authItems, setAuthItems] = useState<Array<AuthItem>>([
    { name: "Discord", isAuthorized: false, key: OAuthTokenStoreKey.discord_oauth },
  ]);

  const ls = useLocalStorage();

  const setOpenAISessionID = (threadId: string) => {
    ls.set(LocalStorageKeys.openAISessionID, threadId);
  };

  const generateGuestId = () => {
    const id = `guest-${uuidv4().slice(0, 4)}`;

    ls.set(LocalStorageKeys.guestId, id);

    return id;
  };

  const getGuestId = () => ls.get<string>(LocalStorageKeys.guestId);
  const getOpenAISessionID = () => ls.get<string>(LocalStorageKeys.openAISessionID) || undefined;

  const revokeAuth = (key: OAuthTokenStoreKey) => {
    Cookies.remove(key);

    setAccessTokens((prev) => ({ ...prev, [key]: null }));

    setAuthItems((prev) => {
      const i = prev.findIndex((item) => item.key === key);

      const item = prev[i];

      return Object.assign([], { ...prev, [i]: { ...item, isAuthorized: false } });
    });
  };

  const getCookieValueAsObject = (key: OAuthTokenStoreKey) => {
    const discordAuthResponse = Cookies.get(key);

    if (!discordAuthResponse) return undefined;

    const value = JSON.parse(discordAuthResponse!);

    return value;
  };

  const verifyDiscordAuthorization = async () => {
    try {
      const discordAuthResponse = Cookies.get(OAuthTokenStoreKey.discord_oauth);

      const value = JSON.parse(discordAuthResponse!);

      setAccessTokens((prev) => ({
        ...prev,
        [OAuthTokenStoreKey.discord_oauth]: value.access_token,
      }));

      setAuthItems((prev) => {
        const i = prev.findIndex((item) => item.key === OAuthTokenStoreKey.discord_oauth);

        const item = prev[i];

        return Object.assign([], { ...prev, [i]: { ...item, isAuthorized: true } });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const props: AuthorizationContextType = {
    accessTokens,
    getCookieValueAsObject,
    verifyDiscordAuthorization,
    getGuestId,
    getOpenAISessionID,
    generateGuestId,
    authItems,
    revokeAuth,
    setOpenAISessionID,
  };

  return <AuthorizationContext.Provider value={props}>{children}</AuthorizationContext.Provider>;
};
