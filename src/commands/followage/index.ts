import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, getTarget, logError } from "../../utils";
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
    if (chTarget.includes(",")) chTarget = chTarget.replace(/,/g, '');
    if (chTarget.includes("@")) chTarget = chTarget.replace(/@/g, '');
  
    if (tagged.includes(",")) tagged = tagged.replace(/,/g, '');
    if (tagged.includes("@")) tagged = tagged.replace(/@/g, '');
  
    try {
      let following = await isFollowingUser(chTarget, tagged);
      if (following === null) return client.action(channel, `@${user} "${tagged}" isn't a valid username.`);
  
      if (following["data"].length !== 0) {
        let foundDate = following["data"][0]["followed_at"];
        let elapsed = calcDate(new Date(), new Date(foundDate), ['s', 'm']);
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
    } catch(error) {
      logError(user!, 'api', `Error fetching followage with target "${tagged}" in #${chTarget}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an an issue getting the followage for user(s) ${tagged} in channel ${chTarget}.`);
    }
  }
}

export = followage;