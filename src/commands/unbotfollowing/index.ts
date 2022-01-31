import { Actions, CommonUserstate } from "tmi.js";
import { getFollowers } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
const unbotFollowing: CommandInt = {
  Name: "unbotfollowing",
  Aliases: ["unbotf"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check how many followers are bots.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: true,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let currFollowers = await getFollowers("esfandtv");
    let botFollowers = 30488;
    let realFollowers = currFollowers - botFollowers;
    let response = `${realFollowers.toLocaleString()} real followers, about ${botFollowers.toLocaleString()} are bots.`;
    client.action(channel, `@${userstate["display-name"]} ${response}`);
  }
}

export = unbotFollowing;