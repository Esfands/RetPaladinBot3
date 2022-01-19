import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { getNHLTeams } from "./data";
const nhlCommand: CommandInt = {
  name: "nhl",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "All things NHL.",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    await getNHLTeams();
  }
}

export = nhlCommand;