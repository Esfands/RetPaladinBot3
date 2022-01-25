import { Actions, CommonUserstate } from "tmi.js";
import { StreamStat } from "../../schemas/StreamStatsSchema";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const title: CommandInt = {
  name: "title",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get the title of the current stream.",
  dynamicDescription: [
    "<code>!title</code>",
    "<code>!title @user</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    // Grabs it from StreamStats so it works even if he's offline
    let currentStatus = await StreamStat.find({}).select({ title: 1, _id: 0 });
    let currentTitle = await currentStatus[0]["title"];
    client.say(channel, `@${user} current title: ${currentTitle}`);
  }
}

export = title;