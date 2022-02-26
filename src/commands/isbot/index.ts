import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";

const isbotCommand: CommandInt = {
  Name: "isbot",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check if a Twitch bot is verified.",
  DynamicDescription: [
    "<code>!isbot (target)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    if (context[0]) {
      try {
        let request = await axios.get(`https://api.ivr.fi/twitch/resolve/${context[0]}`);
        let data = await request.data;
  
        let msg = (data.bot) ? `@${user} the account ${data.displayName} is a verified Twitch bot.` : `@${user} the account ${data.displayName} is not a verified Twitch bot.`;
        return client.action(channel, msg);
      } catch (error) {
        return client.action(channel, `@${user} sorry I couldn't find the user "${context[0]}"`);
      } 
    } else return client.action(channel, `@${user} please specific a user to check.`);
  }
}

export = isbotCommand;