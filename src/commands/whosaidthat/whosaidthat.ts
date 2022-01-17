import { Actions, CommonUserstate } from "tmi.js";
import fs from "fs";
import path from "path";
import axios from "axios";
import config from "../../cfg/config";
import * as imported_gamefile from "../../datasets/whosaidthat.json";

const PATH = path.join(__dirname, "../../datasets/whosaidthat.json")

const MAX_ROUNDS = 5;
export async function checkRoundsNumber(rounds: number) {
  if (typeof rounds === "number") {
    if (rounds < MAX_ROUNDS + 1) {
      return rounds;
    } else return `${rounds} is above the limit of ${MAX_ROUNDS} rounds`;
  } else return `"${rounds}" is not a number`
}

export async function fetchWSTGameData() {
  let storedGame = fs.readFileSync(PATH);
  let rawData = JSON.parse(storedGame.toString());

  return rawData;
}

export async function createWSTGame(gm: CommonUserstate["username"], rounds: number, client: Actions, channel: string) {
  let storedGame = fs.readFileSync(PATH);
  let rawData = JSON.parse(storedGame.toString());

  // Check if game is already going
  if (rawData.length) {
    return false;
  } else {
    // If not add game to data.
    let gameData = { gm: gm, started: true, canJoin: true, rounds: { total: rounds, current: 1 }, quotes: [], contestants: [gm] };

    rawData.push(gameData);
    fs.writeFileSync(PATH, JSON.stringify(rawData), "utf-8");
    /* setTimeout(async () => { await forceStart(client, channel) }, 60000); */ // force start game after a minute
    return true;
  }
}

interface GameData {
  canJoin: boolean | undefined;
  sender: string | undefined;
  message: string | undefined;
}

export async function fetchRandomQuote(users: Array<string>) {
  let gameData: GameData;
  let randUser = users[Math.floor(Math.random() * users.length)];
  const response = await axios.get(`https://logs.ivr.fi/channel/esfandtv/user/${randUser}/random?json`);
  let messageObj = await response.data.messages[0];

  // At least 5 words long
  if (messageObj["text"].trim().split(" ").length >= 5) {
    // Make sure the name matches with participant so it doesn't choose an old username
    if (messageObj["username"] === randUser) {
      // Avoid any very good! spam
      if (!messageObj["text"].includes("ＶＥＲＹ ＧＯＯＤ")) {
        let regex = /\b(\w+\s*\w*)\s+\1\b/gmi;
        if (regex.exec(messageObj["text"]) == null) {
          gameData = { canJoin: false, sender: messageObj["username"], message: messageObj["text"] };
          console.log("this message looks good", gameData);
          return gameData;
        }
      } else { console.log('very good message'); return { canJoin: false, sender: "", message: "" }; };
    } else { console.log("old username"); return { canJoin: false, sender: "", message: "" }; };
  } else { console.log('message is too short'); return { canJoin: false, sender: "", message: "" }; };
}

export async function joinWSTGame(player: CommonUserstate["username"]) {
  let storedGame = fs.readFileSync(PATH);
  let rawData = JSON.parse(storedGame.toString());

  if (rawData[0]["canJoin"]) {
    // Check if player is already a contestant
    if (rawData[0]["contestants"].includes(player)) {
      return "you're already in the game";
    } else {
      // Not in game so add them
      rawData[0].contestants.push(player);
      fs.writeFileSync(PATH, JSON.stringify(rawData), "utf-8");
      return `you have been entered to play!`;
    }
  } else {
    return `sorry, it's too late to join this game. Maybe the next FeelsOkayMan`;
  }
}

export async function startWSTGame(gm: CommonUserstate["username"], client: Actions, channel: string) {
  let storedGame = fs.readFileSync(PATH);
  let rawData = JSON.parse(storedGame.toString());

  if (rawData.length) {
    if (rawData[0]["gm"] === gm) {
      if (!rawData[0]["quotes"].length) {
        if (rawData[0]["contestants"].length !== 1) {
          let quotes = [];

          for (let i = 0; i < rawData[0]["rounds"]["total"]; i++) {
            while (true) {
              let quote = await fetchRandomQuote(rawData[0]["contestants"]);
              if (!quote) return;
              if (quote!["message"] !== "") {
                if (quote!['sender'] == "") return;
                quotes.push({ id: i + 1, sender: quote!["sender"], message: quote!["message"] });
                break;
              }
            }
          }

          rawData[0]["quotes"] = quotes;
          rawData[0]["canJoin"] = false;

          fs.writeFileSync(PATH, JSON.stringify(rawData), "utf-8");

          return `Game has now started! Out of these players: ${rawData[0]["contestants"].join(", ")} Guess who said: ${rawData[0]["quotes"][0]["message"]}`;
        } else return;
      } else return `game has already been started by ${rawData[0]["gm"]}`;
    } else return `only ${rawData[0]["gm"]} can start the game`;
  } else return `to start a game use "${config.prefix}wst create"`;
}

export async function senderGuessed(user: CommonUserstate["username"], sender: string, rid: string) {
  let wstData = fs.readFileSync(PATH, "utf-8");
  let rawData = JSON.parse(wstData)
  let response;

  rawData[0]["rounds"]["current"] = rawData[0]["rounds"]["current"] + 1;
  if (rawData[0]["rounds"]["current"] > rawData[0]["rounds"]["total"]) {
    response = [`${user} guessed "${sender}" correctly!`, `[WST? - ${rawData[0]["rounds"]["total"]}/${rawData[0]["rounds"]["total"]}] Game over! Thanks for playing ${rawData[0]["contestants"].join(", ")} peepoWave`];
    rawData = [];
    let finalData = JSON.stringify(rawData);
    fs.writeFileSync(PATH, finalData, "utf-8");
  } else {
    let roundData = JSON.stringify(rawData);
    fs.writeFileSync(PATH, roundData, "utf-8");

    let newWstData = fs.readFileSync(PATH, "utf-8");
    let newData = JSON.parse(newWstData)
    let quote = newData[0]["quotes"].filter((quote: any) => {
      return quote.id === newData[0]["rounds"]["current"];
    })
    response = [`${user} guessed "${sender}" correctly!`, `[WST? - ${newData[0]["rounds"]["current"]}/${newData[0]["rounds"]["total"]}] Guess who said: ${quote[0].message}`];
  }
  return response;
}

export async function stopWSTGame(userstate: CommonUserstate) {
  let storedGame = fs.readFileSync(PATH);
  let rawData = JSON.parse(storedGame.toString());

  let gm = userstate["username"];

  // If game exists, return owners name in a message
  if (rawData.length) {
    try {
      let userBadges = Object.keys(userstate["badges"]!);
      if (rawData[0]["gm"] === gm || userBadges.includes("broadcaster") || userBadges.includes("moderator")) {
        // Delete the game date
        rawData = [];

        fs.writeFileSync(PATH, JSON.stringify(rawData), "utf-8");
        return `current game of "Who Said That?" has been stopped.`;
      } else {
        return `only ${rawData[0]["gm"]} can stop the game.`;
      }
    } catch (err: any) {
      // On error delete the game anyway.
      rawData = [];

      fs.writeFileSync(PATH, JSON.stringify(rawData), "utf-8");
    }
  } else {
    // No game data, means no game to stop
    return `there is no game running. Start one with "${config.prefix}wst create"`;
  }
}