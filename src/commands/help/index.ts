import { Actions, CommonUserstate } from "tmi.js";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const help: CommandInt = {
  Name: "help",
  Aliases: ["about", "commands"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get the URL for the documentation site.",
  DynamicDescription: [
    "<code>!help</code>",
    "<code>!help (command name)</code>",
    "<code>!about</code>",
    "<code>!commands</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];
    let commands = await findOne('commands', `Name='${context[0]}'`);

     if (context[0]) {
      if (commands) {
        let aliasParse = JSON.parse(commands["Aliases"]);
        let aliases = (aliasParse.length) ? aliasParse.map((s: string) => "!" + s).join(", ") : "No aliases";
        client.action(channel, `@${user} !${commands["Name"]} (${aliases}): ${commands["Description"]} - ${commands["Cooldown"]}sec cooldown. https://www.retpaladinbot.com/commands/${commands["Name"]}`);
      }
    } else client.action(channel, `@${user} Commands and more information are available here: https://www.retpaladinbot.com/commands`);
  }
}

export = help;