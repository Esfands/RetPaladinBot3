import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
export = {
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
    const response = await axios.get("http://www.boredapi.com/api/activity/");
    const body = await response.data;
    client.action(channel, `@${userstate["display-name"]} ${body["activity"]}`);
  }
}