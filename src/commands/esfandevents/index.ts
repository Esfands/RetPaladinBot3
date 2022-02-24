import { Actions, CommonUserstate } from "tmi.js";
import { checkGameName } from "../../utils/helix";
import { findOne, insertRow, removeOne, updateOne } from "../../utils/maria";
import { CommandInt, CommandPermissions } from "../../validation/CommandSchema";

enum Format {
  REGULAR = "regular",
  COMPACT = "compact"
}

const esfandeventsCommand: CommandInt = {
  Name: "esfandevents",
  Aliases: ["eevents"],
  Permissions: [CommandPermissions.DEVELOPER],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Add/remove/edit games and formats for EsfandEvents overlay.",
  DynamicDescription: [
    "Add/remove/edit a game with a specific format.",
    `<code>!esfandevents (add/remove/edit/check) "game name title" (regular/compact)</code>`,
    `<code>!esfandevents shift (top, middle, #)`
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let command: any = context[0];
    let message = context.join(" ");

    if (command === "shift") {
      let input = context[1];
      if (input) {
        if (parseInt(input)) {
          await updateOne(`UPDATE settings SET Data='${JSON.stringify({ offset: input })}' WHERE Title='esfandevents_offset';`);
          return client.action(channel, `@${user} set offset to ${input}`);
        } else {
          // check if it's middle/top
          if (input === "middle" || input === "top") {
            await updateOne(`UPDATE settings SET Data='${JSON.stringify({ offset: input.toLowerCase() })}' WHERE Title='esfandevents_offset';`);
            return client.action(channel, `@${user} set offset to ${input.toLowerCase()}`);
          } else return client.action(channel, `@${user} make sure "${input}" is either middle/top or a valid number.`);
        }

      } else return client.action(channel, `@${user} please provide an option for offset: top, middle or pixels.`);
    }

    let game = /"(.*?)"/g.exec(message);
    if (!game) return client.action(channel, `@${user} sorry I couldn't find any quotes. Example: "World of Warcraft".`);
    let gameSearch = game[1].toLowerCase();
    let gameTitle = await checkGameName(gameSearch);
    if (gameTitle === null) return client.action(channel, `@${user} sorry, the game "${game[1]}" isn't a category on Twitch.`);

    // whether it's compact or regular
    let action = message.slice(message.lastIndexOf('"') + 2);

    if (command === "add") {
      let isThere = await findOne(`alertsettings`, `Game='${gameSearch}'`);
      if (!isThere) {
        await insertRow(`INSERT INTO alertsettings (Game, Format) VALUES (?, ?)`, [gameSearch, action])
        client.action(channel, `@${user} game has been added with the title: ${gameTitle[0]["name"]}`)
      } else return client.action(channel, `@${user} that game already exists and has the format: ${isThere["Format"]}`);

    } else if (command === "remove") {
      let isThere = await findOne(`alertsettings`, `Game='${gameSearch}'`);
      if (isThere) {
        await removeOne(`alertsettings`, `Game=?`, [gameSearch]);
        client.action(channel, `@${user} game with title ${gameTitle[0]["name"]} has been removed.`);
      } else return client.action(channel, `@${user} a game with that title doesn't exist in the database.`);

    } else if (command === "edit") {
      let isThere = await findOne(`alertsettings`, `Game='${gameSearch}'`);
      if (isThere) {
        if (action === Format.COMPACT || action === Format.REGULAR) {
          await updateOne(`UPDATE alertsettings SET Format='${action}' WHERE Game='${gameSearch}'`);
          client.action(channel, `@${user} updated ${gameSearch}'s format to ${action}.`);
        } else return client.action(channel, `@${user} sorry the format ${action} isn't an option. Choose either regular or compact.`);
      } else return client.action(channel, `@${user} sorry the game ${gameTitle[0]["name"]} doesn't exist in the database so I'm unable to edit it.`);

    } else if (command === "check") {
      let isThere = await findOne('alertsettings', `Game='${gameSearch}'`);
      if (isThere) {
        client.action(channel, `@${user} that game has the format: ${isThere.Format}`);
      } else client.action(channel, `@${user} the game "${gameSearch}" doesn't have a specific format.`);

    }
  }
}

export = esfandeventsCommand;