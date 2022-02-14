import fs from "fs";
import path from "path";
import { Userstate } from "tmi.js";
import * as globalemotes from "../../datasets/global_emotes.json";
import { getEmotes } from "../../utils/emotes";

let twitchEmotes: Array<Buffer> = [];
let emoteString: RegExp;

async function fetchAllEmotes() {
  await getEmotes();
  let thirdParty = fs.readFileSync(path.join(__dirname, '../../datasets/emotes.json'));
  let global = fs.readFileSync(path.join(__dirname, '../../datasets/global_emotes.json'));

  let thirdPartyArr = JSON.parse(thirdParty.toString());
  let globalArr = JSON.parse(global.toString());

  twitchEmotes = thirdPartyArr.concat(globalArr);
  let emoteNames = twitchEmotes.map(function (emote: any) { return "\\b" + emote + "\\b"; });
  emoteString = new RegExp("(" + emoteNames.join("|") + ")");
}

const streakOptions: any = {
  5: "{count}x {emote} combo",
  10: "{user} ruined the {count}x {emote} combo PogU",
  15: "{user} ruined the {count}x {emote} combo PepeHands",
  20: "you don't ruin {count}x {emote} combos {user} DansGame",
  1000: "you don't ruin {count}x {emote} combos {user} DansGame"
};

interface EmoteStreak {
  emote: any;
  count: any;
}

function isBetween(number: number, start: number, end: number) {
  return (number - start) * (number - end) <= 0;
}

function emoteStreakBroken(user: string, emoteStreak: EmoteStreak) {
  let count = emoteStreak.count;
  let emote = emoteStreak.emote;
  let response: string = "";

  let triggers = Object.keys(streakOptions);
  triggers.forEach((trig, index) => {
    if (isBetween(count, parseInt(triggers[index]), parseInt(triggers[index + 1]))) response = streakOptions[triggers[index]];
  });

  let emoteTag = RegExp("({emote})", 'gmi');
  let countTag = RegExp("({count})", 'gmi');
  let userTag = RegExp("({user})", 'gmi');

  // Clueless surely this this the best way to do this.
  let newRes, newRes2, newRes3;
  if (emoteTag.test(response)) {
    newRes = response.replace(emoteTag, emote);
    if (countTag.test(newRes)) {
      newRes2 = newRes.replace(countTag, count);
      if (userTag.test(newRes2)) {
        newRes3 = newRes2.replace(userTag, user);
        return newRes3;
      } else return newRes2;
    } else return newRes;
  }
}

let emoteStreak: EmoteStreak = { emote: null, count: 0 };
export async function checkEmoteStreak(message: string, user: Userstate["username"]) {
  if (twitchEmotes.length === 0) await fetchAllEmotes();

  let test = emoteString.exec(message);
  let broken;
  if (test) {
    // emote streak broken
    if (test[0] !== emoteStreak.emote) {
      broken = emoteStreakBroken(user, { emote: emoteStreak.emote, count: emoteStreak.count });
      emoteStreak.emote = test[0]!;
      emoteStreak.count = 1;
    } else {
      // Continued the streak
      emoteStreak.emote = test[0];
      emoteStreak.count++;
    }
  } else if (test === null) {
    broken = emoteStreakBroken(user, { emote: emoteStreak.emote, count: emoteStreak.count });
    emoteStreak.emote = null;
    emoteStreak.count = 1;
  }

  return broken;
}