import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt, CommandPermissions } from "../../validation/CommandSchema";
import { checkLoop, createLoop, listLoops, removeLoop, toggleLoop, updateLoop } from "./loopcommand";
const loopcommand: CommandInt = {
  Name: "loopcommand",
  Aliases: ["loopcmd"],
  Permissions: [CommandPermissions.MODERATOR, CommandPermissions.TRUSTED],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Create/edit/remove loop commands",
  DynamicDescription: [
    "Creating a loop.",
    "<code>!loopcommand (create/add) (title) (pattern) (response)</code>",
    "",
    "Edit a loop.",
    "<code>!loopcommand (edit/update) (title) (name, pattern, response) a new name, pattern or response",
    "",
    "Check a specific loop by its title.",
    "<code>!loopcommand check (title)</code>",
    "",
    "Remove a loop by its title.",
    "<code>!loopcommand (remove/delete) (title)</code>",
    "",
    "List all current loops.",
    "<code>!loopcommand list</code>",
    "",
    "Toggle on/off a specific loop.",
    "<code>!loopcommand toggle (title)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const command = context[0];
    const display = userstate["display-name"];

    if (command) {
      if (command === "create" || command === "add") {
        // Check if title and time are present
        if (context[1]) {
          let creation = await createLoop(context[1], context, client, channel);
          client.action(channel, `@${display} ${creation}`);
        }

      } else if (command === "list") {
        let list = await listLoops();
        if (list.length === 0) return client.action(channel, `@${display} no jobs are running currently.`);
        client.action(channel, `@${display} ${list}`);

      } else if (command === "check") {
        let checked = await checkLoop(context[1]);
        client.action(channel, `@${display} ${checked}`);

      } else if (command === "remove" || command === "delete") {
        let removed = await removeLoop(context[1]);
        client.action(channel, `@${display} ${removed}`);

      } else if (command === "toggle") {
        let toggled = await toggleLoop(context[1], client, channel);
        client.action(channel, `@${display} ${toggled}`);

      } else if (command === "edit" || command === "update") {
        // =loopcmd edit (name) (name, pattern, response) (whatever)
        let updated = await updateLoop(context, client, channel);
        client.action(channel, `@${display} ${updated}`);
      }
    } else client.action(channel, `Incorrect syntax`);
  }
}

export = loopcommand;