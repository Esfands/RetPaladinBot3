import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { getFollowers } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
const subathon: CommandInt = {
  Name: "subathon",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "How many more followers until subathon?",
  DynamicDescription: [
    "<code>!subathon</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    let currFollowers = await getFollowers("esfandtv");
    let goalFollowers = 1000000 - currFollowers;
    let response = (goalFollowers >= 1000000) ? `Pause 👉 ${goalFollowers.toLocaleString()} followers away from an uncapped subathon.` : `Esfand's at ${currFollowers.toLocaleString('en-US')} followers, he'll start the subathon February 17th FeelsLateMan`;
    client.action(channel, `@${tagged} ${response}`);
  }
}

export = subathon;