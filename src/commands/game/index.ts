import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { getTarget } from "../../utils";
import { StreamStat } from "../../schemas/StreamStatsSchema";

const gameCommand: CommandInt = {
  Name: "game",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get the current game Esfand is playing.",
  DynamicDescription: [
    "<code>!game</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let toTarget = getTarget(user, context[0]);

    let streamstats = await StreamStat.findOne({ type: "esfandtv" });
    if (streamstats) {
      if (streamstats.category.toLowerCase() === "just chatting") return client.action(channel, `@${toTarget} Esfand is under the category ${streamstats.category}`);
      client.action(channel, `@${toTarget} Esfand is playing ${streamstats.category}`); 
    } else return client.action(channel, `@${toTarget} Esfand isn't currently in a category.`);
  }
}

export = gameCommand;