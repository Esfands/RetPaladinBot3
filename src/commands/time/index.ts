import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const time: CommandInt = {
  Name: "time",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get Esfands local time.",
  DynamicDescription: [
    "<code>!timezone</code>",
    "<code>!time @user</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);
    let response = null;

    function addHours(numOfHours: number, date = new Date()) {
      date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    
      return date;
    }

    let date = new Date();
    let cst = date.toLocaleString("en-US", { timeZone: "America/Chicago", hour: 'numeric', minute: 'numeric', hour12: true });
    let mil = date.toLocaleString("en-US", { timeZone: "America/Chicago", hour: 'numeric', minute: 'numeric', hour12: false });

    response = `Esfand's local time is ${cst} CST KKona (${mil})`;

    client.action(channel, `@${tagged} ${response}`);
  }
}

export = time;