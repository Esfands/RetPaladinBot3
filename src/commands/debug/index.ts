import { Actions, CommonUserstate } from "tmi.js";
import { fetchChatters, giveAllChattersRetfuel } from "../../modules/retfuel";
import { getEmotes } from "../../utils/emotes";
import { getEventSubs } from "../../utils/EventSub";
import { CommandInt } from "../../validation/CommandSchema";

const debug: CommandInt = {
  name: "debug",
  aliases: ["developer"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Debugger for the bot.",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    if (context[0] === "emotes") {
      await getEmotes();
      client.action(channel, `@${userstate["display-name"]} emotes have been updated!`);

    } else if (context[0] === "say") {
      context.shift();
      client.say(channel, `${context.join(" ")}`);

    } else if (context[0] === "action") {
      context.shift();
      client.action(channel, `${context.join(' ')}`);

    } else if (context[0] === "eventsub") {
      let eventSub = await getEventSubs();
      console.log(eventSub["data"]);
    
    } else if (context[0] === "points") {
      await giveAllChattersRetfuel();
    }
  }
}

export = debug;