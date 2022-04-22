import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { calcDate, getTarget, logError } from "../../utils";
import { findOne } from "../../utils/maria";
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
    let target = getTarget(user, context[0]);

    let ranking = await findOne(`wowarenas`, 'Bracket="5v5"');
    let elapsed = calcDate(new Date(), ranking["LastUpdated"], ['s']);
    client.action(channel, `${target} current rating: ${ranking["Rating"]} W${ranking["Won"]} L${ranking["Lost"]} last updated ${elapsed} ago`);
/*     const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    try {
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
    } catch (error) {
      await logError(userstate["display-name"]!, 'api', `Error fetching API for !rank - api.riotgames.com`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue trying to get Esfand's League of Legends rank. Please contact Mahcksimus.`);
    } */
  }
}

export = rank;