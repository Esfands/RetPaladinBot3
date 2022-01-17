import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { shortenURL } from "../../utils";
export = {
  name: 'cat',
  aliases: ['kitty'],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get a random image of a kitty.",
  dynamicDescription: [
    "<code>!cat</code>",
    "<code>!kitty</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search");
    const body = await response.data;
    shortenURL(body[0]["url"]).then((res) => {
      client.action(channel, `@${userstate['display-name']} here's your kitty widepeepoHappy 👉 ${res}`)
    });
  }
}