import { addStr, fetchAPI } from ".";
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import * as emoteFile from "../datasets/emotes.json";

export function otfResponseEmote(response: string, toTag: string | null) {
  // ${user} 2017(?) Nissan Maxima $e{WICKED, PagMan}
  let emoStr = "";

  // Test if $e{} is found
  // Add a way to check if the $e{} is even in there.

  let emoReg = /(?<=\$e{).+?(?=\})/g
  let emoMatches = emoReg.exec(response);
  if (!emoMatches) {
    emoStr = response;
  } else {
    let emoArr = emoMatches[0].split(", ")
    let emoInd = emoMatches.index - 3;

    let bestEmote = getBestAvailableEmote(emoArr);
    let emoteless = response.substr(0, emoInd);

    emoStr = addStr(emoteless, emoInd, bestEmote);
  }

  // Test if ${user} is found
  let targetReg = /\${user}/gm
  let tarUser = targetReg.exec(emoStr);
  if (!tarUser) {
    emoStr = emoStr;
  } else {
    if (toTag == null) {
      toTag = "";
      emoStr = emoStr.replace(targetReg, toTag);
      emoStr = emoStr.trimStart();
    }
    emoStr = emoStr.replace(targetReg, toTag);
  }

  return emoStr;
}

/** 
 * Get the best available emote from Esfand.
 * 
 * @param {array} array 
 * @param {array} fallback 
 */
export function getBestAvailableEmote(array: Array<string>) {
  let emoteJSON = readFileSync(path.join(__dirname, '../datasets/emotes.json'));
  let emotes = JSON.parse(emoteJSON.toString());

  // Find any matched emotes
  for (let i = 0; i < array.length; i++) {
    if (!emotes.includes(array[i])) {
      // Remove any emotes from array that aren't in json
      let id = array.indexOf(array[i]);
      array.splice(id, 1);
    }
  }

  // Return a random emote
  return array[Math.floor(Math.random() * array.length)];
}

let emoteData: Array<string> = [];
export async function getEmotes() {
  let bttvData = await fetchAPI(`https://api.betterttv.net/3/cached/users/twitch/38746172`);

  let bttvGlobalData = await fetchAPI("https://api.betterttv.net/3/cached/emotes/global");

  let ffzData = await fetchAPI(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/38746172`);

  // Fetching channel and shared BTTV emotes
  if (bttvData) {
    for (let i = 0; i < bttvData["channelEmotes"].length; i++) {
      emoteData.push(bttvData["channelEmotes"][i]["code"]);
    }
    for (let i = 0; i < bttvData["sharedEmotes"].length; i++) {
      emoteData.push(bttvData["sharedEmotes"][i]["code"]);
    }
  }

  // BTTV Global emotes
  if (bttvGlobalData) {
    for (let i = 0; i < bttvGlobalData.length; i++) {
      emoteData.push(bttvGlobalData[i]["code"]);
    }
  }

  // Fetching FFZ emotes
  if (ffzData) {
    for (let i = 0; i < ffzData.length; i++) {
      emoteData.push(ffzData[i]["code"]);
    }
  }

  let sevenTVData = await fetchAPI("https://api.7tv.app/v2/users/esfandtv/emotes");
  if (sevenTVData) {
    for (let i = 0; i < sevenTVData.length; i++) {
      emoteData.push(sevenTVData[i]["name"]);
    }
  }

  writeFileSync(path.join(__dirname, '../datasets/emotes.json'), JSON.stringify(emoteData));
}