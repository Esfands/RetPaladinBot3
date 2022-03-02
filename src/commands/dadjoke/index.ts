import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const dadjoke: CommandInt = {
  Name: "dadjoke",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Classic dad jokes.",
  DynamicDescription: [
    "<code>!dadjoke</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    axios("https://icanhazdadjoke.com/", { method: "GET", headers: { Accept: "application/json", "User-Agent": "axios 0.21.1" } })
    .then(res => {
      client.action(channel, `@${userstate["display-name"]} ${res["data"]["joke"]}`);
    })  
    .catch(async (err) => {
      await logError(userstate["display-name"]!, 'api', `Error fetching dadjokes from https://icanhazdadjoke.com/`, new Date());
      client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    });
  }
}

export = dadjoke;