import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const chattersCommand: CommandInt = {
  Name: "chatters",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check how many offline chatters are Esfand's channel.",
  DynamicDescription: [
    "<code>!chatters</code>"
  ],
  Testing: false,
  OfflineOnly: true,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);

    let chatterCount;
    try {
      let chatters = await fetchAPI(`https://tmi.twitch.tv/group/user/esfandtv/chatters`);
      chatterCount = chatters["chatter_count"];
    } catch (error) {
      logError(user!, 'api', `Error fetching all the current chatters! https://tmi.twitch.tv/group/user/esfandtv/chatters was unreachable`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${target} there are ${chatterCount} chatters.`);
  }
}

export = chattersCommand;