import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { createOTFCommand, getOTFCommandNames, getOTFCleanResponse, editOTFCommand, removeOTFCommand, editOTFCommandName } from "./OTFCommands";

export = {
  name: "command",
  aliases: ["cmd"],
  permissions: ["developer", "admin", "moderator", "trusted"],
  globalCooldown: 10,
  cooldown: 30,
  description: "Create/edit/remove commands",
  dynamicDescription: [
    "Create a command with a name and message.",
    "<code>!command create (name) (response)</code>",

    "",
    "Remove a command by its name.",
    "<code>!command remove (name)</code>",

    "",
    "Edit a commands name.",
    "<code>!command edit (command) name (new name)</code>",

    "",
    "Edit a commands message.",
    "<code>!command edit (command) message (new message)</code>",

    "",
    "Check the response of a command.",
    "<code>!command check (name)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = (userstate["display-name"]) ? userstate["display-name"] : "An admin";
    if (!context[0]) return client.action(channel, `@${user} incorrect syntax: visit here for more help https://www.retpaladinbot.com/commands/command`);
    var cmd = context[0].toLowerCase();
    var cmdName = context[1];
    var execute = context[2];

    if (cmd) {
      if (cmdName) {
        
        // check for a command response
        if (cmd === "check") {
          var cmdToSearch = (cmdName.charAt(0) === config.prefix) ? cmdName.substring(1) : cmdName;
          var response = await getOTFCleanResponse(cmdToSearch)
          if (response) {
            client.action(channel, `@${user} the command "${cmdName}" responds with: ${response}`);
          } else client.action(channel, `@${user} the command "${cmdName}" doesn't exist.`);

        } else if (cmd === "edit" || cmd === "update") {
          if (execute) {
            var otfCmdNames = await getOTFCommandNames();
            var matches = otfCmdNames.filter(s => s.includes(cmdName));
            if (matches.length) {
              if (execute === "name") {
                var newResponse = context[3];
                await editOTFCommandName(cmdName, newResponse, user);
                client.action(channel, `@${user} command "${context[1]}" has been changed to "${newResponse}"`);
              
              } else if (execute === "message" || execute === "response") {
                var newResponse = context.splice(3).join(" ");
                await editOTFCommand(cmdName, newResponse, user);
                client.action(channel, `@${user} sucessfully updated "${cmdName}" command.`);
              }
            } 
          }
        } else if (cmd === "create" || cmd === "add") {
          if (execute) {
            var otfCommands = await getOTFCommandNames();
            var matches = otfCommands.filter(s => s.includes(cmdName));
            if (!matches.length) {
              var createdResponse = context.splice(2).join(" ");
              createOTFCommand(cmdName.toLowerCase(), createdResponse, user);
              client.action(channel, `${user} successfully created the command "${cmdName}".`);
            } else client.action(channel, `@${user} the command "${cmdName}" already exists.`);
          }else client.action(channel, `@${user} please provide a response for the new command "${cmdName}".`);

        } else if (cmd === "list") {
          var otfCommands = await getOTFCommandNames();
          var message = `@${user} current commands: ${otfCommands.join(", ")}`;
          var toSend = (message.length > 450) ? `@${user} sorry, the list is too long to post here. Visit: https://www.retpaladinbot.com/commands` : message;
          client.action(channel, toSend);
        
        } else if (cmd === "remove" || cmd === "delete") {
          var removedCommand = await removeOTFCommand(context[1]);
          client.action(channel, `@${user} ${removedCommand}`);
        }

      } else client.action(channel, `@${user} please provide if you'd like to remove, check, edit or delete the command "${cmd}"`);
    } else client.action(channel, `@${user} please provide a command name`);
  }
}