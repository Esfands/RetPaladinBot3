import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI } from "../../utils";
import { getAllChatters } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";

const randomPingCommand: CommandInt = {
  name: "randomping",
  aliases: ["rping", "randping"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Ping a few random chatters.",
  dynamicDescription: [
    "<code>!randomping</code>",
    "<code>!rping</code>",
    "<code>!randping</code>"
  ],
  testing: false,
  offlineOnly: true,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let USERS_TO_PING: number = 5;
    let allChatters: string[] = await getAllChatters("esfandtv");
    let randChatters: string[] = [];
    
    for (let i = 0; i < USERS_TO_PING; i++) {
      randChatters.push(allChatters[Math.floor(Math.random()*allChatters.length)])
    }

    randChatters = randChatters.map(i => "@" + i);
    client.action(channel, `:tf: 🔔 ${randChatters.join(" ")}`);
  }
}

export = randomPingCommand;