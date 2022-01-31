import { Actions, CommonUserstate } from "tmi.js";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const nhlCommand: CommandInt = {
  Name: "nhl",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get NHL information",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: true,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    const search = context[0];

    
  }
}

export = nhlCommand;