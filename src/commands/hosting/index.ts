import { Actions, CommonUserstate } from "tmi.js";
import { StreamStat } from "../../schemas/StreamStatsSchema";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const hostingCommand: CommandInt = {
  Name: "host",
  Aliases: ["hosting"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check what streamer is being hosted.",
  DynamicDescription: [
    "<code>!host</code>",
    "<code>!hosting</code>"
  ],
  Testing: false,
  OfflineOnly: true,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    var streamStats = await StreamStat.findOne({ type: "esfandtv" });
    if (!streamStats) return client.action(channel, `@${userstate["display-name"]} had issue finding who Esfand is currently hosting.`);
    if (streamStats["hosting"]) {
      if (streamStats["status"] === "live") return client.action(channel, `@${userstate["display-name"]} Esfand is currenty live so he isn't hosting anyone Okayge`);
      client.action(channel, `@${userstate["display-name"]} currently hosting ${streamStats["hosting"]}`);
    } else return client.action(channel, `@${userstate["display-name"]} Esfand isn't hosting anyone currently.`);
  }
}

export = hostingCommand;