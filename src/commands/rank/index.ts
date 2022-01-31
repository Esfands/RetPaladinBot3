import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const rank: CommandInt = {
  Name: "rank",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get Esfand's League of Legends rank and more information.",
  DynamicDescription: [
    "<code>!rank</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    let query = await axios({
      method: "GET",
      url: `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/tVcXlTGiJle6Bjpy3n53bIR3PqNt9ksrfrwdLpmYpmjlozk?api_key=${config.apiKeys.riot}`,
    });

    query.data.forEach((res: any) => {
      if (res["queueType"] === "RANKED_SOLO_5x5") {
        let tier = res["tier"].toLowerCase();
        let currentRank = `${tier.charAt(0).toUpperCase() + tier.slice(1)} ${res["rank"]}`;
        let winLoss = `${res["leaguePoints"]}LP | ${res["wins"]}W ${res["losses"]}L  - OPGG: https://na.op.gg/summoner/userName=Esfand`;
        client.action(channel, `@${tagged} current rank: ${currentRank} - ${winLoss}`);
      }
    });
  }
}

export = rank;