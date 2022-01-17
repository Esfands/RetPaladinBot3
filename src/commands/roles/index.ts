import { Actions, CommonUserstate } from "tmi.js";
export = {
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
    var target = (context[0]) ? `@${context[0]}` : `@${userstate["username"]}`;
    var link = `https://twitchdatabase.com/roles/${target.substring(1)}`;

    var response = (userstate["username"] === target.substring(1)) ? `here are your roles: ${link}` : `here are ${target}'s roles: ${link}`;
    client.action(channel, `@${userstate["display-name"]} ${response}`);
  }
}