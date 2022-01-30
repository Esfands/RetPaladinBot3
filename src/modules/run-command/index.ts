import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { getOTFCommandNames, getOTFResponse } from "../../commands/command/OTFCommands";
import { StreamStat } from "../../schemas/StreamStatsSchema";
import { CommandStore } from "../../store/CommandStore";
import { checkMessageBanPhrase, commandUsed, getTarget } from "../../utils";
import { cooldownCanContinue } from "../../utils/cooldowns";
import isUserPermitted from "../../utils/isUserPermitted";
import path from "path";
import fs from "fs";
import { joinWSTGame } from "../../commands/whosaidthat/whosaidthat";

//${user} Type !song to see the name of the song PogBones

const commands = new CommandStore(process.cwd() + "/dist/commands/");

export default async (client: Actions, channel: string, userstate: CommonUserstate, message: string) => {
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
    if (shouldRun == false) return;

    if (isUserPermitted(userstate, command.permissions)) {
      commandUsed('command', command.name);
      return await command.code(client, channel, userstate, context);
    } else
      return await client.say(channel, `@${userstate["display-name"]} you don't have permission to use that command!`);
  } else {
    let otfNames = await getOTFCommandNames();
    if (!commandName) return;
    let matches = otfNames.filter(s => s.includes(commandName));

    if (matches.includes(commandName)) {
      if (matches.length) {
        let user = userstate["display-name"];
        let tagged = getTarget(user, context[0]);

        // Cooldown for the OTF commands
        let shouldRun = await cooldownCanContinue(userstate, commandName, 30, 0);
        if (shouldRun === false) return;

        let response = await getOTFResponse(matches[0], tagged);
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