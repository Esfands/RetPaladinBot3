import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { findOne, insertRow } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const optoutCommand: CommandInt = {
  Name: "optout",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Optout of commands such as !randomping",
  DynamicDescription: [
    "<code>!optout</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];

    // TODO: Add specific commands to toggle out of
    let findQuery = await findOne('optout', `Username='${user?.toLowerCase()}'`);
    if (!findQuery) {
      await insertRow(`INSERT INTO optout (ID, Username) VALUES (?, ?);`, [userstate["user-id"], user?.toLowerCase()]);
      return client.action(channel, `@${user} you have opted out of being pinged FeelsOkayMan`);
    } else {
      return client.action(channel, `@${user} you are already opted out, if you'd like to optin do ${config.prefix}optin FeelsOkayMan`);
    }
  }
}

export = optoutCommand;