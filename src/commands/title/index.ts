import { Actions, CommonUserstate } from "tmi.js";
import { StreamStat } from "../../schemas/StreamStatsSchema";

export = {
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
    var tagged = (context[0]) ? context[0] : user; // Might need to change.
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    // Grabs it from StreamStats so it works even if he's offline
    var currentStatus = await StreamStat.find({}).select({ title: 1, _id: 0 });
    var currentTitle = await currentStatus[0]["title"];
    client.say(channel, `@${user} current title: ${currentTitle}`);
  }
}