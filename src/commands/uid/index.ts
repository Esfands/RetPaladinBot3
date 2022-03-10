import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, getTarget } from "../../utils";
import { getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";

const uidCommand: CommandInt = {
  Name: "uid",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "This command gives you the user-id of a yourself or a specified user.",
  DynamicDescription: [
    "Get your own ID.",
    "<code>!uid</code>",
    "",
    "Get another users ID",
    "<code>!uid (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    try {
      let userId = await getUserId(target);

      let msg: string = "";
      if (target.toLowerCase() === userstate["username"]) {
        msg = `@${user} ${userId}`;
      } else msg = `@${user} ${userId}`;

      client.action(channel, msg);
    } catch (err) { 
      let search = await axios.get('https://api.ivr.fi/twitch/resolve/drdisrespect');
      let data = search.data;

      if (data.banned) {
        client.action(channel, `@${user} ${data.id} ⛔`);
      } else client.action(channel, `@${user} FeelsDankMan sorry, couldn't find the username "${target}"`); 
    }
  }
}

export = uidCommand;