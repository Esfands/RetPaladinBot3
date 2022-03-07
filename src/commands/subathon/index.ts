import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { getEsfandTotalSubs, getFollowers } from "../../utils/helix";
import { findOne, findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const subathon: CommandInt = {
  Name: "subathon",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "How many more followers until subathon?",
  DynamicDescription: [
    "<code>!subathon</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    let query = await findQuery(`SELECT * FROM wheelspin`);
    let isPowerHour = query.IsPowerHour;
    let powerHour = (isPowerHour === "true") ? true : false;
    let res = `Subathon is now! ${(powerHour ? 60 : 30)} seconds per sub/$5/500 bits. Tier 2 is ${powerHour ? 60*2 : 30*2} seconds. Tier 3 is ${powerHour ? 60*4 : 30*4} seconds.`
    client.action(channel, `@${tagged} ${res}`);
  }
}

export = subathon;