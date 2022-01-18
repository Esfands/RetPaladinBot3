import { Actions, CommonUserstate } from "tmi.js";
import { getFollowers } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
const unbotFollowing: CommandInt = {
  name: "",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let currFollowers = await getFollowers("esfandtv");
    let botFollowers = 30488;
    let realFollowers = currFollowers - botFollowers;
    let response = `${realFollowers.toLocaleString()} real followers, about ${botFollowers.toLocaleString()} are bots.`;
    client.action(channel, `@${userstate["display-name"]} ${response}`);
  }
}

export = unbotFollowing;