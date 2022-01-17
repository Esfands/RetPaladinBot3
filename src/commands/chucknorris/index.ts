import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
export = {
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
    const response = await axios.get("https://api.chucknorris.io/jokes/random");
    const body = await response.data;
    client.action(channel, `@${userstate["display-name"]} ${body["value"]}`);
  }
}