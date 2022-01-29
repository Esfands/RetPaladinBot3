import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const randomLineCommand: CommandInt = {
  name: "randomquote",
  aliases: ["rq"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get a random quote from a user in any chat! By default it's Esfand's.",
  dynamicDescription: [
    "Get a random quote from yourself from Esfand's chat.",
    "<code>!rq</code>",
    "",
    "Fetch a quote for another user from Esfand's chat.",
    "<code>!rq (user)</code>",
    "",
    "Fetch a quote from yourself or another user in a different chat.",
    "<code>!rq (user) (streamer)"
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

    axios.get(`https://api.ivr.fi/logs/rq/${targetChannel}/${target}`)
      .then((response: any) => {
        client.say(channel, `(${response.data["time"]}) ${response.data["user"]}: ${response.data["message"]}`);
      }).catch((error: any) => {
        if (error.response.data.error.toLowerCase() === "invalid channelname") {
          client.say(channel, `@${user} sorry couldn't find the channel "${target}"`);
        } else if (error.response.data.error.toLowerCase() === "invalid username") {
          client.say(channel, `@${user} sorry couldn't find the user "${target}"`);
        } else if (error.response.data.error.toLowerCase() === "not found") {
          client.say(channel, `@${user} sorry that user hasn't chatted in "${targetChannel}"`);
        } else {
          client.say(channel, `@${user} sorry there's an API error. Please contact Mahcksimus FeelsDankMan`);
        }
      });
  }
}

export = randomLineCommand;