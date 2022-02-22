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

    let wheelStats = await findQuery(`SELECT * FROM wheelspin`);
    return client.action(channel, `@${target} to spin the wheel it requires a cumulative amount of ${wheelStats[0].AmountNeeded} subs. We're at ${wheelStats[0].Gifted} and Esfand owes ${wheelStats[0].WheelSpins} spins.`);
  }
}

export = wheelspinCommand;