import { Actions, CommonUserstate } from "tmi.js";
import { shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const shortenurl: CommandInt = {
  name: "shortenurl",
  aliases: ["surl"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Shorten a given URL.",
  dynamicDescription: [
    "<code>!shortenurl (url)</code>",
    "<code>!surl (url)</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let url = context.join(" ");
    let user = userstate["display-name"];

    shortenURL(url)
      .then(res => {
        if (typeof res != null) {
          client.action(channel, `@${user} your shortened link: ${res}`);
        } else client.action(channel, `@${user} there was an issue shortening your link.`);
      })
  }
}

export = shortenurl;