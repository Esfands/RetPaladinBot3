import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, fetchAPI, getTarget, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const colorCommand: CommandInt = {
  Name: "color",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "This command gives you the color of a specific users username color.",
  DynamicDescription: [
    "Get your own color.",
    "<code>!color</code>",
    "",
    "Get another users color",
    "<code>!color (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    try {
      let color;
      try {
        color = await fetchAPI(`https://api.ivr.fi/twitch/resolve/${target}`);
      } catch (error) {
        await logError(user!, ErrorType.API, `Error fetching api.ivr.fi/twitch/resolve/${target}. API might be down.`, new Date());
        return client.action(channel, `@${user}, FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
      }

      let msg: string = "";
      if (target.toLowerCase() === userstate["username"]) {
        msg = `@${user} your color is: ${color["chatColor"]}`;
      } else msg = `@${user} that users color is: ${color["chatColor"]}`;

      client.action(channel, msg);
    } catch (err) { 
      await logError(user!, ErrorType.COMMAND, `Error finding the user name ${target}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, couldn't find the username "${target}"`); 
    }
  }
}

export = colorCommand;