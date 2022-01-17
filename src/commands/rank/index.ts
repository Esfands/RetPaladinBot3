import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
export = {
  name: "rank",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get Esfand's League of Legends rank and more information.",
  dynamicDescription: [
    "<code>!rank</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    var tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    var query = axios({
      url: "na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/esfand"
    })
  }
}