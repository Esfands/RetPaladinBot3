import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const advice: CommandInt = {
  name: 'advice',
  aliases: ["randomadvice"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get some random advice that may or may not help in anyway.",
  dynamicDescription: [
    "<code>!randomadvice</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let body;

    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      body = await response.data;
    } catch (error) {
      await logError(userstate['display-name']!, ErrorType.API, `Error fetching API for !randomadvice - https://api.adviceslip.com/advice`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${userstate['display-name']} ${body["slip"]["advice"]}`)
  }
}

export = advice;