import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import { getTarget, humanizeNumber } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const subathonStats: CommandInt = {
  Name: "subathon",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get your stats or another users subathon stats.",
  DynamicDescription: [
    "<code>!subathon</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let target = getTarget(user, context[0]);

    try {
      let stats = await axios.get(`https://api.retpaladinbot.com/subathon/${target}`);
      console.log(stats.data);
      let sData = stats.data;
      if (sData.id === null) return client.say(channel, `@${user} that user wasn't found Despair`);
      client.say(channel, `@${user} messages sent: (#${humanizeNumber(sData.messageRank)}) ${humanizeNumber(sData.messageCount)} | subs gifted: (#${humanizeNumber(sData.subRank)}) ${humanizeNumber(sData.giftedSubs)} | bits donated: (#${humanizeNumber(sData.bitsRank)}) ${humanizeNumber(sData.bitsDonated)} - https://www.mahcks.com/esfands/subathon/${target}`);

    } catch (err) {
      client.say(channel, `@${user} FeelsDankMan there was an issue gathering subathon stats. Please try again later.`)
    }
  }
}

export = subathonStats;