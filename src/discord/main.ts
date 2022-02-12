import { Client, GuildEmoji, Intents, TextChannel } from "discord.js";
import { CommonUserstate } from "tmi.js";

export const bot = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

