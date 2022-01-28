import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { fetchChatters, giveAllChattersRetfuel } from "../../modules/retfuel";
import { storeEmotes } from "../../utils/emoteData";
import { getEmotes } from "../../utils/emotes";
import { getEventSubs } from "../../utils/EventSub";
import { getChannelEmotes } from "../../utils/helix";
import { updateOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const debug: CommandInt = {
  name: "debug",
  aliases: ["developer"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Debugger for the bot.",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    if (context[0] === "emotes") {
      await getEmotes();
      client.action(channel, `@${userstate["display-name"]} emotes have been updated!`);

    } else if (context[0] === "say") {
      context.shift();
      client.say(channel, `${context.join(" ")}`);

    } else if (context[0] === "action") {
      context.shift();
      client.action(channel, `${context.join(' ')}`);

    } else if (context[0] === "eventsub") {
      let eventSub = await getEventSubs();
      console.log(eventSub["data"]);
    
    } else if (context[0] === "points") {
      await giveAllChattersRetfuel();
    
    } else if (context[0] === "te") {
      await storeEmotes();

    } else if (context[0] === "blizz") {
      console.log(new Date());
      let res = await axios({
        method: "GET",
        url: `https://us.api.blizzard.com/data/wow/pvp-region/1/pvp-season/3/pvp-leaderboard/3v3?namespace=dynamic-classic-us&locale=en_US&access_token=${config.apiKeys.blizzard}`,
      });

      let teams = res.data["entries"];
      teams.forEach(async (team: any) => {
        if (team["team"]["name"] === "West Coast Tragedy") {
          await updateOne(`UPDATE wowarenas SET Rank='${team["rank"]}', Rating='${team["rating"]}', Won='${team["season_match_statistics"]["won"]}', Lost='${team["season_match_statistics"]["lost"]}', LastUpdated='${new Date().getTime()}' WHERE Bracket='2v2';`);
          client.action(channel, `Updated rating: for 3v3s - Ranking: ${team["rank"]} Rating: ${team["rating"]} W ${team["season_match_statistics"]["won"]} L ${team["season_match_statistics"]["lost"]}`);
          return;
        }
      });
    
    } else if (context[0] === "subemotes") {
      await getChannelEmotes(context[1]);
    }
  }
}

export = debug;