import { Actions, CommonUserstate } from "tmi.js";
import { ICommand } from "../../schemas/types";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const help: CommandInt = {
  name: "help",
  aliases: ["about", "commands"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get the URL for the documentation site.",
  dynamicDescription: [
    "<code>!help</code>",
    "<code>!help (command name)</code>",
    "<code>!about</code>",
    "<code>!commands</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
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