import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI } from "../../utils";
import { getAllChatters } from "../../utils/helix";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const randomPingCommand: CommandInt = {
  Name: "randomping",
  Aliases: ["rping", "randping"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 60,
  Description: "Ping a few random chatters.",
  DynamicDescription: [
    "<code>!randomping</code>",
    "<code>!rping</code>",
    "<code>!randping</code>"
  ],
  Testing: false,
  OfflineOnly: true,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let USERS_TO_PING: number = 5;
    let allChatters: string[] = await getAllChatters("esfandtv");
    let randChatters: string[] = [];
   
    let optoutUsers = await findQuery(`SELECT username FROM optout`);
    optoutUsers.forEach((user: any) => {
      let index = allChatters.indexOf(user["username"]);
      if (index > -1) {
        allChatters.splice(index, 1);
      }
    });

    for (let i = 0; i < USERS_TO_PING; i++) {
      randChatters.push(allChatters[Math.floor(Math.random()*allChatters.length)])
    }

    randChatters = randChatters.map(i => "@" + i);
    client.action(channel, `:tf: 🔔 ${randChatters.join(" ")}`);
  }
}

export = randomPingCommand;