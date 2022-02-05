import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { findOne, insertRow, removeOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const optoutCommand: CommandInt = {
  Name: "optin",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Optin of commands such as !randomping",
  DynamicDescription: [
    "<code>!optin</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];

    let findQuery = await findOne('optout', `Username='${user?.toLowerCase()}'`);
    if (findQuery) {
      await removeOne('optout', `ID=?`, [userstate["user-id"]]);
      return client.action(channel, `@${user} you have opted in for certain commands FeelsOkayMan`);
    } else {
      return client.action(channel, `@${user} you are already opted in, if you'd like to optout do ${config.prefix}optout FeelsOkayMan`);
    }
  }
}

export = optoutCommand;