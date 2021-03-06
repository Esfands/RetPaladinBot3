import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
import { execSync } from "child_process";
import { findQuery } from "../../utils/maria";

const botStatsCommand: CommandInt = {
  Name: "botstats",
  Aliases: ["botstatus"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Gives some stats about this bot.",
  DynamicDescription: [
    "<code>!botstats</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    const target = getTarget(user, context[0]);

    const totalChatters = await findQuery(`SELECT count(*) FROM chatters;`);

    const totalOTF = await findQuery(`SELECT count(*) FROM otf;`);
    const totalCmds = await findQuery(`SELECT count(*) FROM commands;`);
    const totalCommands = totalOTF[0]["count(*)"] + totalCmds[0]["count(*)"];

    const commits = await execSync("git rev-list --all --count");

    let addOldDatabase: number = 50684 + totalChatters[0]["count(*)"]; // number from old database I still have to move over.
    client.action(channel, `@${target} Total commands: ${totalCommands} Chatters logged: ${addOldDatabase.toLocaleString()} Commits: ${commits.toString('utf-8').replace("\n", "")} KKona`);
  }
}

export = botStatsCommand;