import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const dog: CommandInt = {
  Name: 'dog',
  Aliases: ['doggo'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Brighten up your day with a doggo!",
  DynamicDescription: [
    "<code>!dog</code>",
    "<code>!doggo</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate['display-name'];
    let body;
    try {
      const response = await axios.get("https://dog.ceo/api/breeds/image/random");
      body = await response.data;
    } catch (error) {
      logError(user!, 'api', `Error fetching API for !dog: https://dog.ceo/api/breeds/image/random`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }
    shortenURL(body["message"]).then((res) => {
      client.action(channel, `@${user} here's your doggo widepeepoHappy 👉 ${res}`)
    });
  }
}

export = dog;