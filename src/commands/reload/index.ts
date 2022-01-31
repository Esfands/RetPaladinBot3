import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt, CommandPermissions } from "../../validation/CommandSchema";
const reload: CommandInt = {
  Name: "reload",
  Aliases: [],
  Permissions: [CommandPermissions.ADMIN],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {

  }
}

export = reload;