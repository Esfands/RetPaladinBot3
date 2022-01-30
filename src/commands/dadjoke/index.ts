import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError } from "../../utils";
const dadjoke = {
  name: "dadjoke",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Classic dad jokes.",
  dynamicDescription: [
    "<code>!dadjoke</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    axios("https://icanhazdadjoke.com/", { method: "GET", headers: { Accept: "application/json", "User-Agent": "axios 0.21.1" } })
    .then(res => {
      client.action(channel, `@${userstate["display-name"]} ${res["data"]["joke"]}`);
    })  
    .catch(async (err) => {
      await logError(userstate["display-name"]!, ErrorType.API, `Error fetching dadjokes from https://icanhazdadjoke.com/`, new Date());
      client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    });
  }
}

export = dadjoke;