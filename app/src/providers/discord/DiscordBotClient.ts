/* eslint-disable @typescript-eslint/member-ordering */
import axios, { Axios, AxiosInstance } from "axios";

export class DiscordBotClient {
  baseUrl: string = "https://discord.com/api";

  request: AxiosInstance;

  constructor() {
    this.request = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });
  }

  async addGuildMemberRole({
    guildId,
    userId,
    roleId,
  }: {
    guildId: string;
    userId: string;
    roleId: string;
  }): Promise<Axios> {
    const endpoint = `/guilds/${guildId}/members/${userId}/roles/${roleId}`;

    return await this.request.put(endpoint);
  }

  async createMessage({ channelId, content }: { channelId: string; content: string }): Promise<Axios> {
    const endpoint = `/channels/${channelId}/messages`;

    return await this.request.post(endpoint, {
      content,
    });
  }

  async getGuild({ guildId }: { guildId: string }): Promise<Axios> {
    const endpoint = `/guilds/${guildId}`;

    return await this.request.get(endpoint);
  }
}
