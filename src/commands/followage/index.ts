import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, getTarget } from "../../utils";
import { isFollowingUser } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
import moment from "moment";
const followage: CommandInt = {
  Name: "followage",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check how long you or someone else has been following the stream.",
  DynamicDescription: [
    "<code>!followage</code>",
    "<code>!followage @user</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

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