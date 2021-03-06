import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { fetchAPI, getTarget, calcDate, logError } from "../../utils";

const subageCommand: CommandInt = {
  Name: "subage",
  Aliases: ["sa"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check the time a given user has subbed to a given channel along with other information. (By default targets Esfand's channel)",
  DynamicDescription: [
    "If no channel is given it will default to EsfandTV",
    "",
    "Check your subage to EsfandTV.",
    "<code>!subage (YourUsername)</code>",
    "",
    "Check subage for another user in Esfand's channel.",
    "<code>!subage (user)</code>",
    "",
    "Check your subage to a channel.",
    `<code>!subage (YourUsername) (Streamer)</code>`,
    "",
    "Check another users subage to a channel.",
    "<code>!subage (user) (streamer)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    let targetChannel = context[1];
    if (!targetChannel) targetChannel = 'esfandtv';
    if (targetChannel.startsWith("@")) {
      targetChannel = targetChannel.substring(1);
    } else targetChannel = targetChannel;

    let subcheck;
    
    try {
      subcheck = await fetchAPI(`https://api.ivr.fi/twitch/subage/${target.toLowerCase()}/${targetChannel.toLowerCase()}`);
    } catch (error) {
      await logError(user!, 'api', `Error fetching API for !subage - https://api.ivr.fi/twitch/subage/${target.toLowerCase()}/${targetChannel.toLowerCase()}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    if (subcheck["subscribed"] == false) {
      let oldSub = subcheck["cumulative"];
      if (oldSub["months"] === 0 || typeof oldSub["months"] === "undefined") {
        return client.action(channel, `${target} is not subbed to ${targetChannel} and never has been.`);
      } else {
        return client.action(channel, `${target} is not subbed to ${targetChannel} but has been previously for a total of ${oldSub["months"]} months. Sub ended ${calcDate(new Date(), new Date(oldSub["end"]), ['s'])} ago.`);
      }
    } else {
      let subData = subcheck["meta"];
      let subLength = subcheck["cumulative"];
      let substreak = subcheck["streak"];

      if (subData === undefined) return client.action(channel, `@${user} "${target}" or "${targetChannel}" is not a valid username.`);

      if (subData["tier"] === "Custom") {
        return client.action(channel, `${target} is subbed to #${targetChannel} with a permanent sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak.`);
      }
      if (subData["endsAt"] === null) {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData["tier"]} sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. This is a permanent sub.`);
      }
      if (subData["type"] === "prime") {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier 1 prime sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${calcDate(new Date(subData["endsAt"]), new Date(), ['s'])}`);
      }
      if (subData["type"] === "paid") {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData["tier"]} sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${calcDate(new Date(subData["endsAt"]), new Date(), ['s'])}`);
      }
      if (subData["type"] === "gift") {
        let gifter = subData["gift"]["name"];
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData["tier"]} sub, gifted by ${gifter} for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${calcDate(new Date(subData["endsAt"]), new Date(), ['s'])}`);
      }
    }
  }
}

export = subageCommand;