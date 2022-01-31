import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { checkRoundsNumber, createWSTGame, startWSTGame, stopWSTGame } from "./whosaidthat";
const whosaidthat: CommandInt = {
  Name: "whosaidthat",
  Aliases: ["wst"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Guess who said what!",
  DynamicDescription: [
    "A random line will be chosen from all players entered. All players have to guess who said that line.",
    "",
    "Create a lobby and which allows users to join the game.",
    "<code>!whosaidthat create (optional: # of rounds, default is 1)</code>",
    "",
    "Join the lobby created by the GM.",
    "<code>!join</code>",
    "",
    "When the GM is ready to start the game do the command below.",
    "<code>!whosaidthat start</code>",
    "",
    "Does the GM want to cut the game short?",
    "<code>!whosaidthat stop</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const gameMaster = userstate["display-name"];
    const command = context[0];

    console.log('hello?')

    let gameData = {}
    if (command) {
      if (command === "create") {
        // If they provide a number for a round set it to that otherwise the default is one
        let gameRounds = (context[1]) ? await checkRoundsNumber(parseInt(context[1])) : await checkRoundsNumber(1); 
        if (typeof gameRounds === "number") {
          if (gameRounds <= 0) return client.action(channel, `[WST?] ${gameMaster} game can't be created with "${gameRounds}" rounds.`);
          let createGame = await createWSTGame(userstate["username"], gameRounds, client, channel);
          if (createGame) {
            client.action(channel, `[WST? - ${gameRounds} rounds] A game has been created by ${gameMaster}! Type "!join" to join in and ${gameMaster} will type "!wst start" to begin the game.`);
          } else return client.action(channel, `[WST?] ${gameMaster} a game has already started.`);
        } else return client.action(channel, `[WST?] ${gameMaster} ${gameRounds}`)

      } else if (command === "start") {
        let startedGame = await startWSTGame(userstate["username"], client, channel);
        client.action(channel, `[WST?] ${startedGame}`);

      } else if (command === "stop") {
        let gameStop = await stopWSTGame(userstate);
        client.action(channel, `[WST?] @${gameMaster} ${gameStop}`);

      } else if (command === "about") {
        client.action(channel, `[WST?] "Who Said That?" is a game where a random message will be picked from group of players. Commands: https://www.retpaladinbot.com/commands/whosaidthat`);
      }
    } else {
      client.action(channel, `[WST?] Incorrect syntax: visit here for more information - https://www.retpaladinbot.com/commands/whosaidthat`);
    }
  }
}

export = whosaidthat;