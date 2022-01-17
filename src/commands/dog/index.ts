import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { shortenURL } from "../../utils";
export = {
  name: 'dog',
  aliases: ['doggo'],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Brighten up your day with a doggo!",
  dynamicDescription: [
    "<code>!dog</code>",
    "<code>!doggo</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    const body = await response.data;
    shortenURL(body["message"]).then((res) => {
      client.action(channel, `@${userstate['display-name']} here's your doggo widepeepoHappy 👉 ${res}`)
    });
  }
}