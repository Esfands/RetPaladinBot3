import config from "../../cfg/config";
import { CommandStore } from "../../store/CommandStore";
import isUserPermitted from "../../utils/isUserPermitted";
import { Actions, CommonUserstate } from "tmi.js";
import { getOTFCommandNames, getOTFResponse } from "../../commands/command/OTFCommands";
import { cooldownCanContinue } from "../../utils/cooldowns";
import { checkMessageBanPhrase, commandUsed, delay, updateOrCreateChatter } from "../../utils";
import { checkMessageForRegex } from "../../commands/keyword/keyword";
import { StreamStat } from "../../schemas/StreamStatsSchema";
import { checkEmoteStreak } from "../../modules/emote-streak";
import path from "path";
import fs from "fs";
import { fetchWSTGameData, joinWSTGame, senderGuessed } from "../../commands/whosaidthat/whosaidthat";

const commands = new CommandStore(process.cwd() + "/dist/commands/");

export default async (client: Actions, channel: string, userstate: CommonUserstate, message: string, self: string) => {

  let ignoredBots = ["streamelements", "supibot"];
  if (ignoredBots.includes(userstate["username"])) return;
  if (self) return;

  // Emote streak
  let comboMessage = await checkEmoteStreak(message, userstate["display-name"]);
  if (typeof comboMessage !== "undefined") {
    if (comboMessage) client.action(channel, comboMessage);
  }

  // check if "who said that?" game is going
  let isGameGoing = await fetchWSTGameData();
  if (isGameGoing.length) {
    console.log('game is going')
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

  // Keyword detection
  let toReplyKeyword = await checkMessageForRegex(message, userstate["display-name"]);
  if (toReplyKeyword?.run == true) client.action(channel, `${toReplyKeyword.message.response}`);

  if (message.startsWith(config.prefix)) {
    const context = message.slice(config.prefix.length).split(/ +/);

    // Remove invis character that 7tv uses to avoid spam
    if (context.includes("󠀀")) { let sevenInd = context.indexOf("󠀀"); context.splice(sevenInd, 1); };
    if (context[0] === "") { context.splice(0, 1) };

    const commandName = context?.shift()?.toLowerCase();
    const command = commands.getCommand(commandName);

    // Check for banned phrases
    let checkMessage = await checkMessageBanPhrase(message);
    if (checkMessage["banned"]) return;

    if (command !== null) {
      if (!command) return;

      // Check if command has testing enabled, if it does then it can only be used in testing channels
      if (command.testing && !config["testing-channels"].includes(channel.substring(1))) return;

      // Check if command is offline only. If stream status is live, don't run command.
      if (command.offlineOnly) {
        let currentStatus = await StreamStat.find({}).select({ status: 1, _id: 0 });
        if (currentStatus[0]["status"] === "live") return
      }

      // Check for global/personal cooldowns.
      let shouldRun = await cooldownCanContinue(userstate, command.name, command.cooldown, command.globalCooldown);

      if (isUserPermitted(userstate, command.permissions)) {
        await command.code(client, channel, userstate, context);
      } else
        await client.say(channel, `@${userstate["display-name"]} you don't have permission to use that command!`);
    } else {
      let otfNames = await getOTFCommandNames();
      if (!commandName) return;
      let matches = otfNames.filter(s => s.includes(commandName));

      if (matches.includes(commandName)) {
        if (matches.length) {
          let toTag;
          let tagged = context[0];
          let user = userstate["display-name"];

          // Cooldown for the OTF commands
          let shouldRun = await cooldownCanContinue(userstate, commandName, 30, 0);
          if (shouldRun === false) return;

          // Check for special character that 7tv uses.
          if (tagged === "󠀀") {
            toTag = `@${user}`;
          } else {
            if (tagged) {
              if (tagged.startsWith("@")) {
                toTag = tagged
              } else {
                toTag = `@${tagged}`;
              }
            } else {
              toTag = `@${user}`;
            }
          }

          let response = await getOTFResponse(matches[0], toTag);
          if (!response) return;
          commandUsed("otf", commandName);
          if (response.startsWith("/")) {
            if (response.substring(0, 3) === "/me") {
              let newRes = response.replace(/(\/me\s)/, "");
              client.action(channel, `${newRes}`);
            } else client.say(channel, `${response}`);
          } else client.say(channel, `${response}`);
        } else return;

      } else if (commandName == "join") {
        // Who Said That? game
        let gameData = fs.readFileSync(path.join(__dirname, "../../datasets/whosaidthat.json"))
        let rawData = JSON.parse(gameData.toString());

        if (rawData.length) {
          let gameJoin = await joinWSTGame(userstate["username"]);
          client.action(channel, `@${userstate["username"]} ${gameJoin}`);
        }
      } else return;
    }
  }

  // Save/update chatter in Mongo
  await updateOrCreateChatter(userstate);
}
