import config from "../../cfg/config";
import { Actions, CommonUserstate } from "tmi.js";
import { delay, updateOrCreateChatter } from "../../utils";
import { initializeKeywords } from "../../commands/keyword/keyword";
import { checkEmoteStreak } from "../../modules/emote-streak";
import { fetchWSTGameData, senderGuessed } from "../../commands/whosaidthat/whosaidthat";
import { checkForBot } from "../../modules/bot-detection";
import runCommand from "../../modules/run-command";
import { IKeyword } from "../../schemas/types";
import { keyWordCooldown } from "../../utils/cooldowns";
import { otfResponseEmote } from "../../utils/emotes";

export let AllKeywords: Array<IKeyword> = [];
(async () => {
  if (AllKeywords.length === 0) await initializeKeywords();
})();

export default async (client: Actions, channel: string, userstate: CommonUserstate, message: string, self: string) => {

  let ignoredBots = ["streamelements", "supibot"];
  if (ignoredBots.includes(userstate["username"])) return;
  if (self) return;

  // Bot detection.
  checkForBot(client, channel, userstate, message);

  // Keyword detection
  let keyMsg;
  for (let i = 0; i < AllKeywords.length; i++) {
    let parts = AllKeywords[i]["Regex"].split("/");
    let regex = new RegExp(parts[1], parts[2]);
    if (regex.test(message)) {
      let isDisabled = (AllKeywords[i]["Disabled"] === "false") ? false : true;
      if (isDisabled) return keyMsg = "";
      if (!keyWordCooldown(AllKeywords[i]["Title"], AllKeywords[i]["Cooldown"])) return keyMsg = "";
      keyMsg = AllKeywords[i]["Message"];
    }
  }

  if (keyMsg) {
    if (keyMsg.startsWith(config.prefix)) {
      return runCommand(client, channel, userstate, keyMsg);
    } else {
      let userN = (userstate["display-name"]?.startsWith("@")) ? userstate["display-name"] : `@${userstate["display-name"]}`;
      let response = otfResponseEmote(keyMsg, userN);
      if (response.startsWith("/")) {
        if (response.substring(0, 3) === "/me") {
          let newRes = response.replace(/(\/me\s)/, "");
          client.action(channel, `${newRes}`);
        } else client.say(channel, `${response}`);
      } else client.say(channel, `${response}`);
    }
  }

  // Emote streak
  let comboMessage = await checkEmoteStreak(message, userstate["display-name"]);
  if (typeof comboMessage !== "undefined") {
    if (comboMessage) client.action(channel, comboMessage);
  }

  // check if "who said that?" game is going
  let isGameGoing = await fetchWSTGameData();
  if (isGameGoing.length) {
    if (!isGameGoing[0]["canJoin"]) {
      // check if message sender is in game.
      let contestants = isGameGoing[0]["contestants"];
      let rounds = { round: isGameGoing[0]["rounds"]["total"], current: isGameGoing[0]["rounds"]["current"] };

      let roundQuote = isGameGoing[0]["quotes"].filter((quote: any) => {
        return quote.id === rounds.current;
      })
      if (contestants.includes(userstate["username"])) {
        console.log(roundQuote[0].sender.toLowerCase(), message)
        console.log(message.toLowerCase().includes(roundQuote[0].sender.toLowerCase()));
        if (message.toLowerCase().includes(roundQuote[0].sender.toLowerCase())) {
          let guessedCorrectly = await senderGuessed(userstate["display-name"], roundQuote[0].sender, roundQuote[0].id);
          client.action(channel, `${guessedCorrectly[0]}`);
          await delay(2000);
          client.action(channel, `${guessedCorrectly[1]}`)
        }
      }
    }
  }

  if (message.startsWith(config.prefix)) {
    runCommand(client, channel, userstate, message);
  }

  // Save/update chatter in Mongo
  await updateOrCreateChatter(userstate);
}
