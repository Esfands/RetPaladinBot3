import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const chattersCommand: CommandInt = {
  name: "chatters",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check how many offline chatters are Esfand's channel.",
  dynamicDescription: [
    "<code>!chatters</code>"
  ],
  testing: false,
  offlineOnly: true,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);

    let chatters = await fetchAPI(`https://tmi.twitch.tv/group/user/esfandtv/chatters`);
    let chatterCount = chatters["chatter_count"];
    client.action(channel, `@${target} there are ${chatterCount} chatters.`);
  }
}

export = chattersCommand;