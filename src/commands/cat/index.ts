import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const cat: CommandInt = {
  Name: 'cat',
  Aliases: ['kitty'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a random image of a kitty.",
  DynamicDescription: [
    "<code>!cat</code>",
    "<code>!kitty</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let body;
    
    try {
      const response = await axios.get("https://api.thecatapi.com/v1/images/search");
      body = await response.data
    } catch(error) {
      await logError(userstate["display-name"]!, 'api', `cat API error with: https://api.thecatapi.com/v1/images/search`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    shortenURL(body[0]["url"]).then((res) => {
      client.action(channel, `@${userstate['display-name']} here's your kitty widepeepoHappy 👉 ${res}`)
    });
  }
}

export = cat;