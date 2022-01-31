import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, getTarget, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const roles: CommandInt = {
  Name: "roles",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check a users roles courtesy of www.twitchdatabase.com",
  DynamicDescription: [
    "Check your own roles.",
    "<code>!roles</code>",
    "",
    "Check another users roles.",
    "<code>!roles (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let target = getTarget(userstate["display-name"], context[0]);

    let link;
    try {
      link = `https://twitchdatabase.com/roles/${target}`;
    } catch (error) {
      await logError(userstate["display-name"]!, ErrorType.API, `Error fetching API for !roles - https://twitchdatabase.com/roles/${target}`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    let response = (userstate["username"] === target) ? `here are your roles: ${link}` : `here are ${target}'s roles: ${link}`;
    client.action(channel, `@${userstate["display-name"]} ${response}`);
  }
}

export = roles;