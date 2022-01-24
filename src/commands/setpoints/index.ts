import { Actions, CommonUserstate } from "tmi.js";
import { setRetfuel } from "../../modules/retfuel";
import { getUserId } from "../../utils/helix";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const setPoints: CommandInt = {
  name: "setpoints",
  aliases: [],
  permissions: ["developer"],
  globalCooldown: 10,
  cooldown: 30,
  description: "Set a users RetFuel",
  dynamicDescription: [
    "Set another users points.",
    "<code>!setpoints (user) (amount)</code>",
    "",
    "Set your own points.",
    "<code>!setpoints (amount)</code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let toQuery = (Number(context[0])) ? userstate["username"] : context[0].toString();

    toQuery = (toQuery.startsWith("@")) ? toQuery.substring(1) : toQuery;
    
    var query = await findOne('chatters', `Username='${userstate['username']}'`);
    if (query) {
      let toGive = (Number(context[0])) ? context[0] : context[1];
      let given = await setRetfuel(toQuery, parseInt(toGive));
      /* if (given) {
        return client.action(channel, `@${userstate["display-name"]} you set ${toQuery}'s RetFuel to ${parseInt(toGive)}.`);
      } else return client.action(channel, `@${userstate["display-name"]} failed to give ${toQuery} any RetFuel.`); */
    } else return client.action(channel, `@${userstate["display-name"]} sorry, I couldn't find "${context[0]}" to give RetFuel to.`);
  }
}

export = setPoints;