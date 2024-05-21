import { NextApiRequest, NextApiResponse } from "next";

import { routes } from "hooks/useRoutes/useRoutes";
import logger from "providers/logger";

const makeDiscordOAuthURL = () => {
  const data = {
    clientId: process.env.DISCORD_CLIENT_ID,
    redirectURI: routes.api.oauth.discord.callback(),
    scope: "identify",
    state: Date.now(),
  };

  return `https://discord.com/api/oauth2/authorize?client_id=${data.clientId}&redirect_uri=${data.redirectURI}&response_type=code&scope=${data.scope}&state=${data.state}`;
};

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`api.oauth.discord.authorize`);

    const redirectURL = makeDiscordOAuthURL();

    response.redirect(redirectURL);
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
