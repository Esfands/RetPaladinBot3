import { addStr, fetchAPI } from ".";
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
var emoteFile = require("../datasets/emotes.json");

export function otfResponseEmote(response: string, toTag: string | null) {
  // ${user} 2017(?) Nissan Maxima $e{WICKED, PagMan}
  var emoStr = "";

  // Test if $e{} is found
  // Add a way to check if the $e{} is even in there.

  var emoReg = /(?<=\$e{).+?(?=\})/g
  let emoMatches = emoReg.exec(response);
  if (!emoMatches) {
    emoStr = response;
  } else {
    var emoArr = emoMatches[0].split(", ")
    var emoInd = emoMatches.index - 3;

    var bestEmote = getBestAvailableEmote(emoArr);
    var emoteless = response.substr(0, emoInd);

    emoStr = addStr(emoteless, emoInd, bestEmote);
  }

  // Test if ${user} is found
  var targetReg = /\${user}/gm
  var tarUser = targetReg.exec(emoStr);
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
  for (var i = 0; i < array.length; i++) {
    if (!emotes.includes(array[i])) {
      // Remove any emotes from array that aren't in json
      let id = array.indexOf(array[i]);
      array.splice(id, 1);
    }
  }

  // Return a random emote
  return array[Math.floor(Math.random() * array.length)];
}

var emoteData: Array<string> = [];
export async function getEmotes() {
  var bttvData = await fetchAPI(`https://api.betterttv.net/3/cached/users/twitch/38746172`);

  var bttvGlobalData = await fetchAPI("https://api.betterttv.net/3/cached/emotes/global");

  var ffzData = await fetchAPI(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/38746172`);

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

  

  writeFileSync(path.join(__dirname, '../datasets/emotes.json'), JSON.stringify(emoteData));
}