import { Actions, CommonUserstate } from "tmi.js";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const nhlCommand: CommandInt = {
  name: "nhl",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get NHL information",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    const search = context[0];

    
  }
}

export = nhlCommand;