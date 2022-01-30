import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const dog: CommandInt = {
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
    const user = userstate['display-name'];
    let body;
    try {
      const response = await axios.get("https://dog.ceo/api/breeds/image/random");
      body = await response.data;
    } catch (error) {
      logError(user!, ErrorType.API, `Error fetching API for !dog: https://dog.ceo/api/breeds/image/random`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }
    shortenURL(body["message"]).then((res) => {
      client.action(channel, `@${user} here's your doggo widepeepoHappy 👉 ${res}`)
    });
  }
}

export = dog;