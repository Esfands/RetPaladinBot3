import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { fetchAPI, getTarget, calcDate } from "../../utils";

const subageCommand: CommandInt = {
  name: "subage",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check the time a given user has subbed to a given channel along with other information. (By default targets Esfand's channel)",
  dynamicDescription: [
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
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    let targetChannel = context[1];
    if (!targetChannel) targetChannel = 'esfandtv';
    if (targetChannel.startsWith("@")) {
      targetChannel = targetChannel.substring(1);
    } else targetChannel = targetChannel;

    let toSend: string = "";
    let subcheck = await fetchAPI(`https://api.ivr.fi/twitch/subage/${target}/${targetChannel}`);
    if (subcheck["subscribed"] == false) {
      let oldSub = subcheck["cumulative"];

      if (oldSub["months"] === 0) {
        return toSend = `${target} is not subbed to ${targetChannel} and never has been.`;
      } else {
        return toSend = `${target} is not subbed to ${targetChannel} but has been previously for a total of ${oldSub["months"]} months. Sub ended ${calcDate(new Date(), new Date(oldSub["end"]), true)} ago.`;
      }
    } else {
      let subData = subcheck["meta"];
      let subLength = subcheck["cumulative"];
      let substreak = subcheck["streak"];

      if (subData["tier"] === "Custom") {
        return client.action(channel, `${target} is subbed to #${targetChannel} with a permanent sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak.`);
      }
      if (subData["endsAt"] === null) {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData["tier"]} sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. This is a permanent sub.`);
      }
      if (subData["type"] === "prime") {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier 1 prime sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${calcDate(new Date(subData["endsAt"]), new Date(), true)}`);
      }
      if (subData["type"] === "paid") {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData["tier"]} sub and has been subbed for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${calcDate(new Date(subData["endsAt"]), new Date(), true)}`);
      }
      if (subData["type"] === "gift") {
        let gifter = subData["gift"]["name"];
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData["tier"]} sub, gifted by ${gifter} for a total of ${subLength["months"]} months! They are currently on a ${substreak["months"]} months streak. The sub ends/renews in ${calcDate(new Date(subData["endsAt"]), new Date(), true)}`);
      }
    }
  }
}

export = subageCommand;