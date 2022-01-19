import { Actions, CommonUserstate } from "tmi.js";
import { Chatter } from "../../schemas/ChatterSchema";
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
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];
    let tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;

    let query = await Chatter.findOne({ username: tagged?.toLowerCase() });
    if (query) {
      let leaderboard = await Chatter.find({ }).sort( { retfuel: -1 } );
      let position = leaderboard.findIndex(elem => elem["username"] == tagged?.toLowerCase());
      if (tagged?.toLowerCase() === userstate["username"]) return client.action(channel, `@${user} you have ${query["retfuel"]} RetFuel. Current rank: ${position+1}`);
      client.action(channel, `@${user} that user has ${query["retfuel"]} RetFuel.`);
    } else return client.action(channel, `@${user} I couldn't find the user "${tagged}"`)
  }
}

export = pointsCommand;

/*

FOR TOP POINTS

    let leaderboards = await Chatter.find({ }).sort( { retfuel : -1, name: 1 } );
    let topFive: string[] = [];
    leaderboards.forEach((user, index) => {
      topFive.push(`${index+1}. ${user["display_name"]}: ${user["retfuel"]}`);
    });

    console.log(topFive.join(" | ")); 


*/