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

    let one = Math.trunc(6/18 * 100) + "% - 10 gifted subs.";
    let two = Math.trunc(5/18  * 100) + "% - 20 gifted subs.";
    let three = Math.trunc(4/18 * 100) + "% - 40 gifted subs.";
    let four = Math.trunc(2/18 * 100) + "% - power hour.";
    let five = Math.trunc(1/18 * 100) + "% - 60 gifted subs.";

    console.log(one, two, three, four, five)
    let wheelStats = await findQuery(`SELECT * FROM wheelspin`);
    return client.action(channel, `@${target} to spin the wheel it requires a cumulative amount of ${wheelStats[0].AmountNeeded} subs. We're at ${wheelStats[0].Gifted} and Esfand owes ${wheelStats[0].WheelSpins} spins. ${one} ${two} ${three} ${four} ${five}`);
  }
}

export = wheelspinCommand;