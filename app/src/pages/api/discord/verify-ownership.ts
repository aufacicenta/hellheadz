import { NextApiRequest, NextApiResponse } from "next";
import { verifyMessage } from "@wagmi/core";

import logger from "providers/logger";
import wagmi from "providers/wagmi";
import moralis from "providers/moralis";
import discord from "providers/discord";
import evm from "providers/evm";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    await moralis.loadClient();
  } catch (error) {
    logger.error(error);
  }

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

    if (!isVerified) {
      throw new Error("api.discord.verify-ownership: Invalid signature");
    }

    const getWalletNFTCollections = await moralis.client.EvmApi.nft.getWalletNFTCollections({
      chain: data.chainId,
      address: data.address,
    });

    logger.info(`api.discord.verify-ownership: getWalletNFTCollections: ${getWalletNFTCollections.result}`);

    const ownedCollections = getWalletNFTCollections.result.map((collection) => collection.tokenAddress.toJSON());

    if (!ownedCollections.includes(evm.ERC721Instance.defaultContractAddress.toLowerCase())) {
      throw new Error("User does not own the NFT");
    }

    const discordClient = new discord.DiscordBotClient();

    const addGuildMemberRole = await discordClient.addGuildMemberRole({
      guildId: process.env.DISCORD_GUILD_ID!,
      userId: data.discordId,
      roleId: "1241796449771982898",
    });

    logger.info(`api.discord.verify-ownership: addGuildMemberRole: ${addGuildMemberRole}`);

    const createMessage = await discordClient.createMessage({
      channelId: "1239988024142725201",
      content: `Welcome to Hellheadz, <@${data.discordId}>! You'll belong to this private channel as long as you hold your LK💀💀's.`,
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
