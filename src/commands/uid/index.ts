import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget } from "../../utils";
import { getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";

const uidCommand: CommandInt = {
  name: "uid",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "This command gives you the user-id of a yourself or a specified user.",
  dynamicDescription: [
    "Get your own ID.",
    "<code>!uid</code>",
    "",
    "Get another users ID",
    "<code>!uid (user)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    try {
      let userId = await getUserId(target);

      let msg: string = "";
      if (target.toLowerCase() === userstate["username"]) {
        msg = `@${user} your ID is: ${userId}`;
      } else msg = `@${user} that users ID is: ${userId}`;

      client.action(channel, msg);
    } catch (err) { return client.action(channel, `@${user} FeelsDankMan sorry, couldn't find the username "${target}"`); }
  }
}

export = uidCommand;