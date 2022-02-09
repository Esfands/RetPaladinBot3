import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, getTarget } from "../../utils";
import { isFollowingUser } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
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
    let chTarget = context[1];
    chTarget = (chTarget) ? chTarget : "esfandtv";

    if (!tagged) return;
    let following = await isFollowingUser(chTarget, tagged.toLowerCase());

    if (following["data"].length !== 0) {
      let foundDate = following["data"][0]["followed_at"];
      let elapsed = calcDate(new Date(), new Date(foundDate), true);
      if (tagged.toLowerCase() === userstate["username"]) {
        if (chTarget.toLowerCase() === "esfandtv") {
          client.action(channel, `@${tagged}, you have been following for ${elapsed}`);
        } else return client.action(channel, `@${tagged}, you have been following ${chTarget} for ${elapsed}`);
      } else {
        if (chTarget.toLowerCase() === "esfandtv") {
          client.action(channel, `${tagged} has been following for ${elapsed}`);
        } else return client.action(channel, `${tagged} has been following ${chTarget} for ${elapsed}`);
      }
    } else client.action(channel, `@${user} ${tagged} doesn't follow ${chTarget}.`);
  }
}

export = followage;