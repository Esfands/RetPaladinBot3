import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
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
    const response = await axios.get("https://api.adviceslip.com/advice");
    const body = await response.data;
    client.action(channel, `@${userstate['display-name']} ${body["slip"]["advice"]}`)
  }
}

export = advice;