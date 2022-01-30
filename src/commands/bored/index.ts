import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const bored: CommandInt = {
  name: "bored",
  aliases: ["touchgrass"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
	description: "Bored? This will give you something to do.",
	dynamicDescription: [
		"<code>!bored</code>",
		"<code>!touchgrass</code>"
	],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let body: any;
    
    try {
      const response = await axios.get("http://www.boredapi.com/api/activity/");
      body = response.data;
    } catch (error) {
      await logError(userstate["display-name"]!, ErrorType.API, `bored command - error fetching http://www.boredapi.com/api/activity/`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${userstate["display-name"]} ${body["activity"]}`);
  }
}

export = bored;