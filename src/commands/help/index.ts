import { Actions, CommonUserstate } from "tmi.js";
import { Command, ICommand } from "../../schemas/CommandSchema";
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
    let commands: Array<ICommand> = await Command.find({ name: context[0] });

    if (context[0]) {
      if (commands) {
        let aliases = (commands[0].aliases.length) ? commands[0].aliases.map((s: string) => "!" + s).join(", ") : "No aliases";
        client.action(channel, `@${user} !${commands[0].name} (${aliases}): ${commands[0].description} - ${commands[0].cooldown}sec cooldown. https://www.retpaladinbot.com/commands/${commands[0].name}`);
      }
    } else client.action(channel, `@${user} Commands and more information are available here: https://www.retpaladinbot.com/commands`);
  }
}

export = help;