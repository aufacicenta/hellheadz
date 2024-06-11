import React, { useEffect, useState } from "react";
import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import axios from "axios";

import { useAuthorizationContext } from "context/authorization/useAuthorizationContext";

import { DiscordContextControllerProps, DiscordContextType } from "./DiscordContext.types";
import { DiscordContext } from "./DiscordContext";

export const DiscordContextController = ({ children }: DiscordContextControllerProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [oauth, setOAuth] = useState<DiscordContextType["oauth"]>(undefined);

  const authContext = useAuthorizationContext();

  useEffect(() => {
    const discordAuthCookie = authContext.getCookieValueAsObject(OAuthTokenStoreKey.discord_oauth);

    if (!discordAuthCookie) return;

    (async () => {
      try {
        const res = await axios.get("https://discord.com/api/oauth2/@me", {
          headers: {
            Authorization: `Bearer ${discordAuthCookie.access_token}`,
          },
        });

        setOAuth(res.data);
        setIsLoggedIn(!!res.data.user.id);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const props: DiscordContextType = {
    isLoggedIn,
    oauth,
  };

  return <DiscordContext.Provider value={props}>{children}</DiscordContext.Provider>;
};
