import { readdirSync, statSync } from "fs";
import { Command } from "../schemas/CommandSchema";
import { CommandSchema, CommandInt } from "../validation/CommandSchema";

export class CommandStore {
  _directory: string;
  _commands: Array<CommandInt> = [];

  constructor(directory: string) {
    this._directory = directory;
    this._loadAllCommands();
  }

  _storeAllCommands(commands: Array<CommandInt>) {
    commands.forEach(command => {
      Command.findOne({ name: command["name"] }, function (err: Error, obj: object) {
        if (err) throw err;
        if (obj) {
          Command.updateOne({ name: command["name"] }, {
            name: command["name"],
            aliases: command["aliases"],
            permissions: command["permissions"],
            globalCooldown: command["globalCooldown"],
            cooldown: command["cooldown"],
            description: command["description"],
            dynamicDescription: command["dynamicDescription"],
            testing: command["testing"],
            offlineOnly: command["offlineOnly"],
          });
        } else {
          new Command({
            name: command["name"],
            aliases: command["aliases"],
            permissions: command["permissions"],
            globalCooldown: command["globalCooldown"],
            cooldown: command["cooldown"],
            description: command["description"],
            dynamicDescription: command["dynamicDescription"],
            testing: command["testing"],
            offlineOnly: command["offlineOnly"],
            count: 0,
          }).save();
        }
      });

    })
  }

  _loadAllCommands() {
    const files = _getAllFilesFromFolder(this._directory);
    files.forEach(file => {
      let checkNonCommands = file.split("/");
      let nonCmds = checkNonCommands[checkNonCommands.length - 1];
      if (nonCmds === "index.js") {
        try {
          const command: CommandInt = require(`${file}`);
          const validated = CommandSchema.validate(command);
          let cmdDirString = file.substring(0, file.lastIndexOf("/") + 1);
          let cmdArr = cmdDirString.split("/");

          let cmdName: string = cmdArr[4];
          if (validated.error == null) {
            console.log(`Command ${cmdName} has been loaded.`);
            this._commands.push(command)
          } else {
            console.warn(`Command ${cmdName} could not be loaded. Validation: ${validated.error}`);
          }
        } catch (error) {
          console.warn(`A command could not be loaded. ${error}`);
        }
      }
    });
    this._storeAllCommands(this._commands);
  }

  getCommand(commandName: (string | undefined)) {
    if (!commandName) return;
    let found = this._commands.find(cmd => cmd.name === commandName) || this._commands.find(cmd => cmd.aliases.includes(commandName));
    if (!found) return null;
    return found;
  }
}

let _getAllFilesFromFolder = function (dir: string) {
  let results: string[] = [];
  readdirSync(dir).forEach(function (file) {
    file = dir + '/' + file;
    let stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(_getAllFilesFromFolder(file))
    } else results.push(file);
  });

  return results;
};