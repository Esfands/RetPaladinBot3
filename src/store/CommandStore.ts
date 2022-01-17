import { readdirSync, statSync } from "fs";
import { Command } from "../schemas/CommandSchema";
import { CommandSchema, commandInt } from "../validation/CommandSchema";

export class CommandStore {
  _directory: string;
  _commands: Array<commandInt> = [];

  constructor(directory: string) {
    this._directory = directory;
    this._loadAllCommands();
  }

  _storeAllCommands(commands: Array<commandInt>) {
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
      var checkNonCommands = file.split("/");
      var nonCmds = checkNonCommands[checkNonCommands.length - 1];
      if (nonCmds === "index.js") {
        try {
          const command = require(`${file}`);
          const validated = CommandSchema.validate(command);
          var cmdDirString = file.substring(0, file.lastIndexOf("/") + 1);
          var cmdArr = cmdDirString.split("/");

          var cmdName: string = cmdArr[4];
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

var _getAllFilesFromFolder = function (dir: string) {
  var results: string[] = [];
  readdirSync(dir).forEach(function (file) {
    file = dir + '/' + file;
    var stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(_getAllFilesFromFolder(file))
    } else results.push(file);
  });

  return results;
};