import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const roles: CommandInt = {
  name: "roles",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check a users roles courtesy of www.twitchdatabase.com",
  dynamicDescription: [
    "Check your own roles.",
    "<code>!roles</code>",
    "",
    "Check another users roles.",
    "<code>!roles (user)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let target = getTarget(userstate["display-name"], context[0]);
    let link = `https://twitchdatabase.com/roles/${target.substring(1)}`;

    let response = (userstate["username"] === target.substring(1)) ? `here are your roles: ${link}` : `here are ${target}'s roles: ${link}`;
    client.action(channel, `@${userstate["display-name"]} ${response}`);
  }
}

export = roles;