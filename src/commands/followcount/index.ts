import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const followCountCommand: CommandInt = {
  Name: "followcount",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check how many followers a channel has, by default it's EsfandTV.",
  DynamicDescription: [
    "Check how many followers Esfand has.",
    "<code>!followcount</code>",
    "",
    "Check how many followers a channel has,",
    "<code>!followcount (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];

    let targetChannel = context[0];
    if (!targetChannel) targetChannel = 'esfandtv';
    if (targetChannel.startsWith("@")) {
      targetChannel = targetChannel.substring(1);
    } else targetChannel = targetChannel;

    let followCount;
    try {
      followCount = await fetchAPI(`https://decapi.me/twitch/followcount/${targetChannel}`);
    } catch (error) {
      logError(user!, 'api', `Error fetching API for !followcount: https://decapi.me/twitch/followcount/${targetChannel}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    if (followCount === 0) {
      return client.action(channel, `@${user} couldn't find the channel "${targetChannel}"`);
    } else return client.action(channel, `@${user} the channel "${targetChannel}" has ${followCount.toLocaleString()} followers!`);

  }
}

export = followCountCommand;