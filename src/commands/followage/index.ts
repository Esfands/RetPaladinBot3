import { Actions, CommonUserstate } from "tmi.js";
import { calcDate } from "../../utils";
import { isFollowingUser } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
import moment from "moment";
const followage: CommandInt = {
  name: "followage",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check how long you or someone else has been following the stream.",
  dynamicDescription: [
    "<code>!followage</code>",
    "<code>!followage @user</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    if (!tagged) return;
    let following = await isFollowingUser("esfandtv", tagged.toLowerCase());

    if (following !== null) {
      let foundDate = following["data"][0]["followed_at"];
      let elapsed = calcDate(new Date(), new Date(foundDate), true);
      if (tagged.toLowerCase() === userstate["username"]) {
        client.action(channel, `@${tagged}, you have been following for ${elapsed}`);
      } else client.say(channel, `${tagged} has been following for ${elapsed}`);
    } else client.say(channel, `@${user} ${tagged} doesn't follow the stream.`);
  }
}

export = followage;