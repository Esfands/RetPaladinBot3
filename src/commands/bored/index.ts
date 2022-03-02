import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const bored: CommandInt = {
  Name: "bored",
  Aliases: ["touchgrass"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
	Description: "Bored? This will give you something to do.",
	DynamicDescription: [
		"<code>!bored</code>",
		"<code>!touchgrass</code>"
	],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let body: any;
    
    try {
      const response = await axios.get("http://www.boredapi.com/api/activity/");
      body = response.data;
    } catch (error) {
      await logError(userstate["display-name"]!, 'api', `bored command - error fetching http://www.boredapi.com/api/activity/`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${userstate["display-name"]} ${body["activity"]}`);
  }
}

export = bored;