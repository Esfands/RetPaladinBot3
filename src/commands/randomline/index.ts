import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, fetchAPI, getTarget, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const randomLineCommand: CommandInt = {
  Name: "randomquote",
  Aliases: ["rq"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a random quote from a user in any chat! By default it's Esfand's.",
  DynamicDescription: [
    "Get a random quote from yourself from Esfand's chat.",
    "<code>!rq</code>",
    "",
    "Fetch a quote for another user from Esfand's chat.",
    "<code>!rq (user)</code>",
    "",
    "Fetch a quote from yourself or another user in a different chat.",
    "<code>!rq (user) (streamer)"
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

    axios.get(`https://api.ivr.fi/logs/rq/${targetChannel}/${target}`)
      .then((response: any) => {
        client.say(channel, `(${response.data["time"]}) ${response.data["user"]}: ${response.data["message"]}`);
      }).catch((error: any) => {
        let errorMsg = error.response.data.error.toLowerCase();
        if (errorMsg === "invalid channelname") {
          client.say(channel, `@${user} sorry couldn't find the channel "${target}"`);
        } else if (errorMsg === "invalid username") {
          client.say(channel, `@${user} sorry couldn't find the user "${target}"`);
        } else if (errorMsg === "not found") {
          client.say(channel, `@${user} sorry that user hasn't chatted in "${targetChannel}"`);
        } else {
          logError(user!, ErrorType.API, `Error fetching API for !rq - https://api.ivr.fi/logs/rq/${targetChannel}/${target}`, new Date());
          client.say(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
        }
      });
  }
}

export = randomLineCommand;