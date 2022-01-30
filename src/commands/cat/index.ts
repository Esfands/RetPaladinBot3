import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const cat: CommandInt = {
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
    let body;
    
    try {
      const response = await axios.get("https://api.thecatapi.com/v1/images/search");
      body = await response.data
    } catch(error) {
      await logError(userstate["display-name"]!, ErrorType.API, `cat API error with: https://api.thecatapi.com/v1/images/search`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    shortenURL(body[0]["url"]).then((res) => {
      client.action(channel, `@${userstate['display-name']} here's your kitty widepeepoHappy 👉 ${res}`)
    });
  }
}

export = cat;