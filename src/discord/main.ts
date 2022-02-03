import { Client, GuildEmoji, Intents, TextChannel } from "discord.js";
import { CommonUserstate } from "tmi.js";

export const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

export function sendMessageLogDiscord(userstate: CommonUserstate, message: string) {
	let twitchBadges = Object.keys(userstate["badges"]!);
	let badges: any[] = [];
	const channel: TextChannel = bot.channels.cache.get('938722986226229308') as TextChannel;
	
	if (!twitchBadges) {
		channel.send(`<:esfandtv:938735935015776277> ${userstate["display-name"]}: ${message}`);
	} else {
		if (!userstate["badges"]) return channel.send(`<:esfandtv:938735935015776277> ${userstate["display-name"]}: ${message}`);
		if (twitchBadges.includes("broadcaster")) badges.push("<:broadcaster:938733735757639733>");
		if (twitchBadges.includes("moderator")) badges.push("<:mod:938739649864667146>");
		if (twitchBadges.includes("vip")) badges.push("<:vip:938739649793372230>");

		let subBadge = new Map(Object.entries(userstate["badges"]));
		if (twitchBadges.includes("subscriber")) {
			// check what badge they have
			let subage = subBadge.get("subscriber");
			if (subage === "0") badges.push("<:00:938731596939395104>");
			if (subage === "3") badges.push("<:03:938731597153308672>");
			if (subage === "6") badges.push("<:06:938731596696141895>");
			if (subage === "12") badges.push("<:12:938731596993949706>");
			if (subage === "24") badges.push("<:24:938731597971202078>");
		}
		if (twitchBadges.includes("glitchcon2020")) badges.push("<:glitchcon:938731596947812393>");
		if (twitchBadges.includes("prime")) badges.push("<:prime:938731597115576350>");
		if (twitchBadges.includes("turbo")) badges.push("<:turbo:938731597161705483>");
		channel.send(`<:esfandtv:938735935015776277> ${badges.join(" ")} **${userstate["display-name"]}**: ${message}`);
	}
}