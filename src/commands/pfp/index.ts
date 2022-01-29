import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const pfpCommand: CommandInt = {
  name: "pfp",
  aliases: ["profilepic", "avatar"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get a user's profile picture.",
  dynamicDescription: [
    "Get your own profile picture.",
    "<code>!pfp</code>",
    "",
    "Get another user's profile picture.",
    "<code>!pfp (user)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);

    try {
      let res = await fetchAPI(`https://decapi.me/twitch/avatar/${target}`);
      if (res.toLowerCase().includes("user not found")) {
        console.log("not found");
        client.action(channel, `@${user} couldn't find the user "${target}"`);
      } else {
        let link = await shortenURL(res);
        if (target.toLowerCase() === userstate["username"]) {
          client.action(channel, `@${user} here is your profile picture: ${link}`);
        } else client.action(channel, `@${user} here is their profile picture: ${link}`);
      }
    } catch (err) {
      client.action(channel, `@${user} FeelsDankMan sorry, there was an API error.`);
    }
  }
}

export = pfpCommand;