import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const chucknorris: CommandInt = {
  Name: "chucknorris",
  Aliases: ["chuck", "norris"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Chuck Norris made this BTW.",
  DynamicDescription: [
    "<code>!chucknorris</code>",
    "<code>!chuck</code>",
    "<code>!norris</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let body;

    try {
      const response = await axios.get("https://api.chucknorris.io/jokes/random");
      body = await response.data
    } catch (error) {
      logError(userstate["display-name"]!, 'api', `Error fetching https://api.chucknorris.io/jokes/random for !chucknorris`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${userstate["display-name"]} ${body["value"]}`);
  }
}

export = chucknorris;