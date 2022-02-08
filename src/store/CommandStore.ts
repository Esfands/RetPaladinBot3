import { readdirSync, statSync } from "fs";
import { findOne, findOrCreate, insertRow, updateOne } from "../utils/maria";
import { CommandSchema, CommandInt } from "../validation/CommandSchema";

export class CommandStore {
  _directory: string;
  _commands: Array<CommandInt> = [];

  constructor(directory: string) {
    this._directory = directory;
    this._loadAllCommands();
  }

  _storeAllCommands(commands: Array<CommandInt>) {
    commands.forEach(async (command) => {
      let exists = await findOne(`commands`, `Name='${command.Name}'`);
      if (exists) {
        await updateOne(`UPDATE commands SET Name='${command.Name}', Aliases='${JSON.stringify(command.Aliases)}', Permissions='${JSON.stringify(command.Permissions)}', Description='${command.Description}', DynamicDescription="${JSON.stringify(command.DynamicDescription)}", GlobalCooldown='${command.GlobalCooldown}', Cooldown='${command.Cooldown}', Testing='${(command.Testing) ? "true" : "false"}', OfflineOnly='${(command.OfflineOnly) ? "true" : "false"}', OnlineOnly='${(command.OnlineOnly) ? "true" : "false"}' WHERE Name='${command.Name}';`);
        //console.log('updated');
      } else {
        let queryStr = `INSERT INTO commands (Name, Aliases, Permissions, Description, DynamicDescription, GlobalCooldown, Cooldown, Testing, OfflineOnly, OnlineOnly, Count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        let values = [command.Name, JSON.stringify(command.Aliases), JSON.stringify(command.Permissions), command.Description, JSON.stringify(command.DynamicDescription), command.GlobalCooldown, command.Cooldown, (command.Testing) ? "true" : "false", (command.OfflineOnly) ? "true" : "false", (command.OnlineOnly) ? "true" : "false", 0];
        await insertRow(queryStr, values);
        //console.log('New command');
      }
      //findOrCreate("commands", `Name='${command.name}'`, queryStr, values);
    })
  }

  //return conn.query(`INSERT INTO commands (Name, Aliases, Permissions, Description, DynamicDescription, GlobalCooldown, Cooldown, Testing, OfflineOnly) VALUES (${command.name}, ${command.aliases}, ${command.permissions}, ${command.description}, ${command.dynamicDescription}, ${command.globalCooldown}, ${command.cooldown}, ${command.testing}, ${command.offlineOnly})`)


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
    let found = this._commands.find(cmd => cmd.Name === commandName) || this._commands.find(cmd => cmd.Aliases.includes(commandName));
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