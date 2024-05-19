import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import logger from "providers/logger";
import { OAuthTokenStoreKey } from "../oauth.types";
import { routes } from "hooks/useRoutes/useRoutes";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`api.oauth.discord.callback`);

    const { code, state } = request.query;

    const data = {
      grant_type: "authorization_code",
      code,
      redirect_uri: routes.api.oauth.discord.callback(),
    };

    const result = await axios.request({
      method: "POST",
      url: "https://discord.com/api/oauth2/token",
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.DISCORD_CLIENT_ID!,
        password: process.env.DISCORD_CLIENT_SECRET!,
      },
    });

    logger.info(result.data);

    logger.info(`api.oauth.discord.callback: setting cookie ${OAuthTokenStoreKey.discord_oauth} and redirecting`);

    response.setHeader("Set-Cookie", [`${OAuthTokenStoreKey.discord_oauth}=${JSON.stringify(result.data)}; Path=/`]);

    response.redirect(301, routes.oauth.discord());
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
