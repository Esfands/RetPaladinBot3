import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const colorCommand: CommandInt = {
  name: "color",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "This command gives you the color of a specific users username color.",
  dynamicDescription: [
    "Get your own color.",
    "<code>!color</code>",
    "",
    "Get another users color",
    "<code>!color (user)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    try {
      let color = await fetchAPI(`https://api.ivr.fi/twitch/resolve/${target}`);

      let msg: string = "";
      if (target.toLowerCase() === userstate["username"]) {
        msg = `@${user} your color is: ${color["chatColor"]}`;
      } else msg = `@${user} that users color is: ${color["chatColor"]}`;

      client.action(channel, msg);
    } catch (err) { return client.action(channel, `@${user} FeelsDankMan sorry, couldn't find the username "${target}"`); }
  }
}

export = colorCommand;