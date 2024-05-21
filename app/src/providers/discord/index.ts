import { Client, GatewayIntentBits } from "discord.js";

import { DiscordBotClient } from "./DiscordBotClient";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export default {
  DiscordBotClient,
  client,
};
