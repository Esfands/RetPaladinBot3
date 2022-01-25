import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, getTarget, postHastebin } from "../../utils";
import { getUsersFollowers } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
const followingCommand: CommandInt = {
  name: "following",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check who a user is following.",
  dynamicDescription: [
    "Check your own followers.",
    "<code>!following</code>",
    "",
    "Check another users following.",
    "<code>!following (user)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {

    let toTarget = getTarget(userstate["display-name"], context[0]);

    let followerList;
    try {
      followerList = await getUsersFollowers(toTarget);
    } catch (error) {
      followerList = null;
    }

    if (followerList) {
      followerList.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      let streamers = followerList.map(function (streamer) {
        return `${streamer['streamer']} - ${calcDate(new Date(), new Date(streamer["date"]), false)}`;
      });

      let getRandomStreamers = followerList.sort(() => Math.random() - Math.random()).slice(0, 5)
      let randomStreamers = getRandomStreamers.map(function (streamer) {
        return `${streamer["streamer"]}`;
      });

      let pasted = await postHastebin(`Want a cleaner version? https://www.twitchdatabase.com/following/${toTarget}\n\n` + streamers.join("\n"));
      client.action(channel, `@${userstate["display-name"]} @${toTarget} is following ${streamers.length} streams: ${randomStreamers.join(", ")}... ${pasted}`);
    } else client.action(channel, `@${userstate["display-name"]} could not find user "${toTarget}"`);
  }
}

export = followingCommand;