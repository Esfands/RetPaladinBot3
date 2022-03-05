import { Actions, CommonUserstate } from "tmi.js";
import { getUser } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";
import { calcDate, getTarget, logError } from "../../utils";

const accountAge: CommandInt = {
  Name: "accountage",
  Aliases: ["accage"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get your Twitch account age.",
  DynamicDescription: [
    "Check your own account age.",
    "<code>!accountage</code>",
    "",
    "Check another users account age.",
    "<code>!accountage (user)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0])

    let accountInfo = await getUser(tagged);
    try {
      let foundDate = accountInfo["data"][0]["created_at"];
      //let elapsed = calcDate(new Date(), new Date(foundDate), true);
      let elapsed = calcDate(new Date(), new Date(foundDate), ["s", 'm']);
      if (tagged.toLowerCase() === userstate["displayname"]) {
        client.say(channel, `You created your account ${elapsed} ago`);
      } else {
        client.say(channel, `${tagged} created their account ${elapsed} ago`);
      }
    } catch (error) {
      await logError(user!, "command", `Twitch API couldn't find the user ${tagged}`, new Date());
      client.say(channel, `@${user} sorry I couldn't find the account "${tagged}"`);
    }
  }
}

export = accountAge;