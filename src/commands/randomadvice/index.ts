import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const advice: CommandInt = {
  Name: 'advice',
  Aliases: ["randomadvice"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get some random advice that may or may not help in anyway.",
  DynamicDescription: [
    "<code>!randomadvice</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
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