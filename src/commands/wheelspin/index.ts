import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";

const wheelspinCommand: CommandInt = {
  Name: "wheelspin",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Wheel spin for subathon.",
  DynamicDescription: [
    "<code>!wheelspin</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);

    let one = Math.trunc(5/18 * 100) + "% - +4 mins.";
    let two = Math.trunc(4/18  * 100) + "% - +8 mins.";
    let three = Math.trunc(3/18 * 100) + "% - +12 mins.";
    let five = Math.trunc(3/18 * 100) + "% - power hour.";
    let four = Math.trunc(2/18 * 100) + "% - +15 mins.";
    let six = Math.trunc(1/18 * 100) + "% - +20 mins.";

    console.log(one, two, three, four, five)
    let wheelStats = await findQuery(`SELECT * FROM wheelspin`);
    if (wheelStats[0].IsCollective === "true") {
      return client.action(channel, `@${target} to spin the wheel it requires a cumulative amount of ${wheelStats[0].AmountNeeded} subs. We're at ${wheelStats[0].Gifted} and Esfand owes ${wheelStats[0].WheelSpins} spins. ${one} ${two} ${three} ${four} ${five}`);
    } else {
      client.action(channel, `@${target} to spin the wheel it's ${wheelStats[0].AmountNeeded} (or ${wheelStats[0].AmountNeeded * 2}) subs at once. ${one} ${two} ${three} ${four} ${five} ${six}`);
    }
  }
}

export = wheelspinCommand;