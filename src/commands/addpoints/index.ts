import { Actions, CommonUserstate } from "tmi.js";
import { giveRetfuel } from "../../modules/retfuel";
import { Chatter } from "../../schemas/ChatterSchema";
import { getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
const addPoints: CommandInt = {
  name: "addpoints",
  aliases: [],
  permissions: ["developer"],
  globalCooldown: 10,
  cooldown: 30,
  description: "Give points to a viewer or everyone.",
  dynamicDescription: [
    "<code>!givepoints (user) (amount)</code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {

    let toQuery = (Number(context[0])) ? userstate["username"] : context[0].toString();

    toQuery = (toQuery.startsWith("@")) ? toQuery.substring(1) : toQuery;
    
    var query = await Chatter.findOne({ username: toQuery });
    if (query) {
      // Increase amount by given number
      let toGive = (Number(context[0])) ? context[0] : context[1];
      let given = await giveRetfuel(toQuery, parseInt(toGive));
      if (given) {
        return client.action(channel, `@${userstate["display-name"]} you gave ${toQuery} ${parseInt(toGive)} RetFuel.`);
      } else return client.action(channel, `@${userstate["display-name"]} failed to give ${toQuery} any RetFuel.`);
    } else return client.action(channel, `@${userstate["display-name"]} sorry, I couldn't find "${context[0]}" to give RetFuel to.`)
  }
}

export = addPoints;