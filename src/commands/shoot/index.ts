import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
const shoot: CommandInt = {
  name: "shoot",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Timeout a specific user for a short period of time",
  dynamicDescription: [
    "<code>!shoot (user)</code>"
  ],
  testing: false,
  offlineOnly: true,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    if (!context[0]) return client.action(channel, `@${user} please target a user to shoot.`);

    client.timeout(channel, context[0], 15, '!shoot command')
      .then((data) => {
        client.action(channel, `${user} shot ${context[0]} dead!`);
      })
      .catch((err) => {
        client.action(channel, `${user} failed to shoot that user.`);
      })
  }
}

export = shoot;