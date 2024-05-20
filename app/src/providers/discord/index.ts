import { Client, GatewayIntentBits } from "discord.js";

import { DiscordClient } from "./DiscordClient";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export default {
  DiscordClient,
  client,
};
