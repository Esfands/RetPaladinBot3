import { Actions, CommonUserstate } from "tmi.js";
import { getUser } from "../../utils/helix";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const user: CommandInt = {
  name: 'user',
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Grab information about a user",
  dynamicDescription: [
    "Get your own Twitch ID",
    "<code>!user id</code>",
    "",
    "Get a specific user's ID",
    "<code>!user id (user)</code>",
    "",
    "Get your own Twitch color",
    "<code>!user (color/colour)</code>",
    "",
    "Get someone elses Twitch color",
    "<code>!user (color/colour) (user)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const command = context[0].toLowerCase();
    const target = (context[1]) ? context[1].toLowerCase() : userstate["username"];
    const display = userstate["display-name"];

    const userInfo = await getUser(target);

    if (command) {
      if (command === "id") {
        if (userInfo) {
          client.action(channel, `@${display} ID for that user is: ${userInfo["data"][0]["id"]}`);
        } else return client.action(channel, `@${display} sorry I couldn't find the user "${target}"`);

      } else if (command === "color" || command === "colour") {
        if (userInfo) {
          let query = await findOne('chatters', `TID='${userInfo["data"][0]["id"]}'`);
          if (query) {
            client.action(channel, `@${display} color for that user is: ${query["Color"]}`);
          } else client.action(channel, `@${display} sorry I haven't seen that user yet Thinkge`);
        } else client.action(channel, `@${display} sorry I couldn't find that Twitch account Thinkge`);
      }
    } else client.action(channel, `@${display} incorrect syntax: !user (id/color) (user)`);
  }
}

export = user;