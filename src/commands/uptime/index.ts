import { Actions, CommonUserstate } from "tmi.js";
import { StreamStat } from "../../schemas/StreamStatsSchema";
import { calcDate, getTarget } from "../../utils";
import { getStreamData } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";

const uptime: CommandInt = {
  Name: "uptime",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get the uptime of the current stream.",
  DynamicDescription: [
    "<code>!uptime</code>",
    "<code>!uptime @user</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);
    
    let streamData = await getStreamData("esfandtv");
    try {
      let startTime = await streamData["data"][0]["started_at"];
      if (typeof startTime === "undefined") return client.say(channel, `@${tagged} stream is offline currently Sadge`);

      let elapsed = calcDate(new Date(), new Date(startTime), false);
      client.say(channel, `@${tagged} Esfand has been streaming for ${elapsed}`)
    } catch (error) {
      let stat = await StreamStat.findOne({ type: "esfandtv" });
      let elapsed = calcDate(new Date(), new Date(stat!["wentOfflineAt"]), false);
      client.say(channel, `@${tagged} stream is offline and has been for ${elapsed} Sadeg`);
    }
  }
}

export = uptime;