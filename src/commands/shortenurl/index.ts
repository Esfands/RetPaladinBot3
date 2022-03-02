import { Actions, CommonUserstate } from "tmi.js";
import { logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const shortenurl: CommandInt = {
  Name: "shortenurl",
  Aliases: ["surl"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Shorten a given URL.",
  DynamicDescription: [
    "<code>!shortenurl (url)</code>",
    "<code>!surl (url)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let url = context.join(" ");
    let user = userstate["display-name"];

    shortenURL(url)
      .then(res => {
        if (typeof res != null) {
          client.action(channel, `@${user} your shortened link: ${res}`);
        } else {
          logError(user!, 'api', `Error fetching API for !shortenurl - l.mahcks.com`, new Date());
          client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
        }
      })
  }
}

export = shortenurl;