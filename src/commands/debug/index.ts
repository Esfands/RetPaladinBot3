import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { storeAllEmotes } from "../../modules/emote-listener";
import { getLatestVideo } from "../../modules/reddit";
import { giveAllChattersRetfuel } from "../../modules/retfuel";
import { addSubToSpin } from "../../modules/wheel-spin-counter";
import { storeEmotes } from "../../utils/emoteData";
import { getEmotes } from "../../utils/emotes";
import { appAccessToken, createEventSub, deleteEventSub, getEventSubs, refreshToken } from "../../utils/EventSub";
import { getChannelEmotes, getEsfandSubs, getVodStart, refreshEsfandToken } from "../../utils/helix";
import { findOne, findQuery, insertRow, updateOne } from "../../utils/maria";
import { CommandInt, CommandPermissions } from "../../validation/CommandSchema";
import { execSync, exec } from 'child_process';

const debug: CommandInt = {
  Name: "debug",
  Aliases: ["developer"],
  Permissions: [CommandPermissions.DEVELOPER],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Debugger for the bot.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {

    function getChanges(arr: any[]) {
      return arr.find(value => /files? changed/.test(value));
    }

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
        url: `https://us.api.blizzard.com/data/wow/pvp-region/1/pvp-season/3/pvp-leaderboard/5v5?namespace=dynamic-classic-us&locale=en_US&access_token=${config.apiKeys.blizzard}`,
      });

      let teams = res.data["entries"];
      teams.forEach(async (team: any) => {
        // West Coast Tragedy = 3v3s
        if (team["team"]["name"] === "Scuffed Gaming") {
          await updateOne(`UPDATE wowarenas SET Rank='${team["rank"]}', Rating='${team["rating"]}', Won='${team["season_match_statistics"]["won"]}', Lost='${team["season_match_statistics"]["lost"]}', LastUpdated='${new Date().getTime()}' WHERE Bracket='5v5';`);
          client.action(channel, `Updated rating: for 5v5s - Ranking: ${team["rank"]} Rating: ${team["rating"]} W ${team["season_match_statistics"]["won"]} L ${team["season_match_statistics"]["lost"]}`);
          return;
        }
      });

    } else if (context[0] === "subemotes") {
      let currentEmotes = await getChannelEmotes(context[1]);
      let emoteData = currentEmotes["data"];
      emoteData.forEach(async (emote: any) => {
        let found = await findOne('subemotes', `ID='${emote["id"]}'`);
        let isAnimated = (emote["format"].includes("animated")) ? true : false;
        let URL = (isAnimated) ? `https://static-cdn.jtvnw.net/emoticons/v2/${emote["id"]}/animated/light/3.0` : emote["images"]["url_4x"];
        console.log(URL);
        if (found) {
          await updateOne(`UPDATE subemotes SET Channel='${context[1].toLowerCase()}' Name='${emote["name"]}', Tier='${emote["tier"]}', EmoteType='${emote["emote_type"]}', URL='${URL}' WHERE ID='${emote["id"]}' AND Channel='${context[1].toLowerCase()}'`);
        } else {
          await insertRow(`INSERT INTO subemotes (Channel, Name, ID, Tier, EmoteType, URL) VALUES (?, ?, ?, ?, ?, ?)`, [context[1].toLowerCase(), emote["name"], emote["id"], emote["tier"], emote["emote_type"], URL]);
        }
        //console.log(emote["name"], emote["id"], emote["tier"], emote["emote_type"], emote["images"]["url_4x"]);
      });

    } else if (context[0] === 'subachatters') {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      function generateString(length: number) {
        let result = ' ';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
      }
      for (let i = 0; i < 500; i++) {
        await insertRow(`INSERT INTO subathonstats (ID, Username, MessageCount, GiftedSubs, BitsDonated) VALUES (?, ?, ?, ?, ?)`, [Math.floor(Math.random() * 1000000000), generateString(15), Math.floor(Math.random() * 90000) + 10000, Math.floor(Math.random() * 90000) + 10000, Math.floor(Math.random() * 90000) + 10000]);
      }
    } else if (context[0] === "reddit") {
      getLatestVideo();

    } else if (context[0] === "rtoken") {
      await refreshEsfandToken();
    } else if (context[0] === 'subs') {
      await getEsfandSubs();
    } else if (context[0] === 'createeventsub') {
      await createEventSub(context[1]);
    } else if (context[0] === "validate") {
      await appAccessToken();
    } else if (context[0] === "deleventsub") {
      await deleteEventSub(context[1]);
    } else if (context[0] === "wheelspin") {
      if (context[1].toLowerCase() === "test") {
        await addSubToSpin(parseInt(context[2]), context[3]);
      } else if (context[1].toLowerCase() === "completed") {
        let currentStats = await findQuery(`SELECT * FROM wheelspin`);
        let newCompleted = currentStats[0].Completed + parseInt(context[2]);
        await updateOne(`UPDATE wheelspin SET Completed=${newCompleted}, WheelSpins=${currentStats[0].WheelSpins - parseInt(context[2])}`);
        client.action(channel, `@${userstate["display-name"]} marked ${context[2]} spins have been completed.`);
      }
    } else if (context[0] === "testemotes") {
      await storeAllEmotes("esfandtv", 38746172);
    } else if (context[0] === "vodstart") {
      console.log(await getVodStart(parseInt(context[1])));
    
    } else if (context[0] === "pull") {
      const res = execSync('git pull').toString().split('\n').filter(Boolean);
      if (res.includes('Already up to date.')) return client.action(channel, `@${userstate['display-name']} no changes detected.`);
      client.action(channel, `@${userstate['display-name']}${getChanges(res) || res.join(' | ')}`);
    
    } else if (context[0] === "restart") {
      const res = execSync('git pull').toString().split('\n').filter(Boolean);
      if (res.includes('Already up to date.')) client.action(channel, `${userstate['display-name']} restarting without any changes.`);
      else client.action(channel, `@${userstate['display-name']} restarting ${getChanges(res) || res.join(" | ")}`);
      exec('npm run pm2');

    }
  }
}

export = debug;

function splitUsers(specificUsers: string[], arg1: string) {
  throw new Error("Function not implemented.");
}
