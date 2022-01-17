import { Actions, CommonUserstate } from "tmi.js";
import { getStreamData } from "../../utils/helix";
import { timeDifference } from "../../utils";

export = {
  name: "uptime",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get the uptime of the current stream.",
  dynamicDescription: [
    "<code>!uptime</code>",
    "<code>!uptime @user</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    var tagged = (context[0]) ? context[0] : user; // Might need to change.
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    try {
      var streamData = await getStreamData("esfandtv");
      var startTime = await streamData["data"][0]["started_at"];
      if (typeof startTime === "undefined") return client.say(channel, `@${tagged} stream is offline currently Sadge`);

      var elapsed = timeDifference(new Date(), new Date(startTime), false);
      client.say(channel, `@${tagged} Esfand has been streaming for ${elapsed}`)
    } catch (error) {
      client.say(channel, `@${tagged} stream is offline currently Sadge`);
    }
  }
}