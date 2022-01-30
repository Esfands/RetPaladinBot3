import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const chucknorris: CommandInt = {
  name: "chucknorris",
  aliases: ["chuck", "norris"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Chuck Norris made this BTW.",
  dynamicDescription: [
    "<code>!chucknorris</code>",
    "<code>!chuck</code>",
    "<code>!norris</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let body;

    try {
      const response = await axios.get("https://api.chucknorris.io/jokes/random");
      body = await response.data
    } catch (error) {
      logError(userstate["display-name"]!, ErrorType.API, `Error fetching https://api.chucknorris.io/jokes/random for !chucknorris`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${userstate["display-name"]} ${body["value"]}`);
  }
}

export = chucknorris;