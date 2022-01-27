import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, getTarget } from "../../utils";
import { find, findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const ratingCommand: CommandInt = {
  name: "rating",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check Esfand's 3v3 rating in WoW TBC arenas.",
  dynamicDescription: [
    "<code>!rating</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);

    let ranking = await findOne(`wowarenas`, 'Bracket="2v2"');
    let elapsed = calcDate(new Date(), ranking["LastUpdated"], true);
    client.action(channel, `${target} current rating: ${ranking["Rating"]} W${ranking["Won"]} L${ranking["Lost"]} last updated ${elapsed} ago`);
  }
}

export = ratingCommand;