import { NextApiRequest, NextApiResponse } from "next";

import logger from "providers/logger";
import discord from "providers/discord";
import metadataBatch0_21 from "providers/svpervnder/hellheadz/metadata-batch-0-21.json";

export default async function Fn(_request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`api.discord.create-forum-channel-message`);

    const discordClient = new discord.DiscordBotClient();

    // const getChannel = await discordClient.getChannel({
    //   channelId: "1242289603906502686",
    // });

    // logger.info(`api.discord.create-forum-channel-message: getChannel: ${getChannel}`);

    metadataBatch0_21.map(async (token) => {
      const createForumThread = await discordClient.createForumThread({
        channelId: "1242289603906502686",
        name: `${token.name}`,
        content: `Decide on the future of ${token.name}`,
        applied_tags: ["1242290625106415646"],
      });

      logger.info(`api.discord.create-forum-channel-message: createForumThread: ${JSON.stringify(createForumThread)}`);
    });

    response.json({ success: true });
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
