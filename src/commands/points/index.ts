import { Actions, CommonUserstate } from "tmi.js";
import { findOne, findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const pointsCommand: CommandInt = {
  name: "points",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check how many RetFuel you or another user has.",
  dynamicDescription: [
    "Check your own RetFuel",
    "<code>!points</code>",
    "",
    "Check how many RetFuel another user has.",
    "<code>!points (user)"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];
    let tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;
    let toQuery = (tagged?.toLowerCase() === userstate["username"]) ? userstate["username"] : tagged?.toLowerCase();

    let query = await findOne('chatters', `Username='${toQuery}'`);
    if (query) {
      let leaderboard = await findQuery(`SELECT t.TID, (SELECT COUNT(*) FROM chatters AS X WHERE t.RetFuel <= X.RetFuel) AS POSITION, t.Username, t.RetFuel FROM chatters AS t WHERE t.TID = '${userstate["user-id"]}';`);
      let totalLeaderboard = await findQuery(`SELECT COUNT(*) FROM chatters;`);
      if (!leaderboard) return;
      if (tagged?.toLowerCase() === userstate["username"]) return client.action(channel, `@${user} you have ${query["RetFuel"]} RetFuel. Current rank: ${leaderboard["POSITION"]}/${Object.values(totalLeaderboard)}`);
      client.action(channel, `@${user} that user has ${query["retfuel"]} RetFuel.`);
    } else return client.action(channel, `@${user} I couldn't find the user "${tagged}"`)
  }
}

export = pointsCommand;