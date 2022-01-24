import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
const exampleCommand: CommandInt = {
  name: "top",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Show the top of the RetFuel leaderboard.",
  dynamicDescription: [
    "<code>!top points</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {

    // TODO: Figure out how to sort top 5
   /*  let user = userstate["display-name"];
    if (context[0]) {
      if (context[0] === "points") {
        let leaderboards = await Chatter.find({}).sort({ retfuel: -1, name: 1 }).limit(5);
        let topFive: string[] = [];
        leaderboards.forEach((user, index) => {
          topFive.push(`${index + 1}. ${user["display_name"]}: ${user["retfuel"]}`);
        });

        client.action(channel, `@${user} top 5: ${topFive.join(" | ")}`);
      }
    } else return client.action(channel, `@${user} incorrect syntax: `) */
  }
}


export = exampleCommand;