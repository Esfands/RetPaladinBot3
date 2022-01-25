import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { getFollowers } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
const subathon: CommandInt = {
  name: "subathon",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "How many more followers until subathon?",
  dynamicDescription: [
    "<code>!subathon</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    let currFollowers = await getFollowers("esfandtv");
    let goalFollowers = 1000000 - currFollowers;
    let response = (goalFollowers >= 1000000) ? `Pause 👉 ${goalFollowers.toLocaleString()} followers away from an uncapped subathon.` : `Esfand's at ${currFollowers.toLocaleString('en-US')} followers, he'll start the subathon towards the end of this month FeelsLateMan`;
    client.action(channel, `@${tagged} ${response}`);
  }
}

export = subathon;