import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { CommandInt } from "../../validation/CommandSchema";
const rank: CommandInt = {
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
    let tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    let query = await axios({
      method: "GET",
      url: "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/tVcXlTGiJle6Bjpy3n53bIR3PqNt9ksrfrwdLpmYpmjlozk?api_key=RGAPI-cbf8843c-8c94-4535-ae15-a5ebdcb70614",
    });

    let res = query.data[0];
    let tier = res["tier"].toLowerCase();
    let currentRank = `${tier.charAt(0).toUpperCase() + tier.slice(1)} ${res["rank"]}`;
    let winLossRatio = (res["losses"]+res["wins"]) * 100;
    let winLoss = `${res["wins"]}W ${res["losses"]}L %${winLossRatio.toString().slice(0, -2)} win ratio. OPGG: https://na.op.gg/summoner/userName=Esfand`;
    client.action(channel, `@${tagged} current rank: ${currentRank} - ${winLoss}`);
  }
}

export = rank;