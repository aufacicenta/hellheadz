import { NextApiRequest, NextApiResponse } from "next";
import { verifyMessage } from "@wagmi/core";

import logger from "providers/logger";
import wagmi from "providers/wagmi";
import discord from "providers/discord";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`api.discord.verify-ownership`);

    const { data } = request.body;

    const isVerified = await verifyMessage(wagmi.defaultConfig, {
      chainId: data.chainId,
      address: data.address,
      message: data.message,
      signature: data.signature,
    });

    logger.info(`api.discord.verify-ownership: isVerified: ${isVerified}`);

    const discordClient = new discord.DiscordClient();

    const addGuildMemberRole = await discordClient.addGuildMemberRole({
      guildId: process.env.DISCORD_GUILD_ID!,
      userId: data.discordId,
      roleId: "1241796449771982898",
    });

    logger.info(`api.discord.verify-ownership: addGuildMemberRole: ${addGuildMemberRole}`);

    const createMessage = await discordClient.createMessage({
      channelId: "1239988024142725201",
      content: `User <@${data.discordUsername}> has verified their ownership of address ${data.address}`,
    });

    logger.info(`api.discord.verify-ownership: createMessage: ${createMessage}`);

    response.json({ isVerified });
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
