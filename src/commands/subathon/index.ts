import { Actions, CommonUserstate } from "tmi.js";
import { getFollowers } from "../../utils/helix";
export = {
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
    var tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    var currFollowers = await getFollowers("esfandtv");
    var goalFollowers = 1000000 - currFollowers;
    var response = (goalFollowers >= 1000000) ? `Pause 👉 ${goalFollowers.toLocaleString()} followers away from an uncapped subathon.` : `Esfand's at ${currFollowers.toLocaleString('en-US')} followers, he'll start the subathon towards the end of this month FeelsLateMan`;
    client.action(channel, `@${tagged} ${response}`);
  }
}