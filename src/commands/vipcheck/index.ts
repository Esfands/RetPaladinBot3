import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, fetchAPI, getTarget, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const vipCheckCommand: CommandInt = {
  Name: "vipcheck",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check if a user is a VIP in a certain channel. Defaults to Esfand's channel.",
  DynamicDescription: [
    "<code>!vipcheck (user) (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;
    let rTarget = target.toLowerCase();

    let targetChannel = context[1];
    if (!targetChannel) targetChannel = 'esfandtv';
    if (targetChannel.startsWith("@")) {
      targetChannel = targetChannel.substring(1);
    } else targetChannel = targetChannel;

    let vipCheck;
    try {
      vipCheck = await fetchAPI(`https://api.ivr.fi/twitch/modsvips/${targetChannel}`);
    } catch (error) {
      await logError(user!, 'api', `Error fetching API for !vipcheck - https://api.ivr.fi/twitch/modsvips/${targetChannel}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    let isVIP = vipCheck["vips"];
    let vipRes = "";

    await isVIP.forEach(async function (vipstatus: any) {
      if (vipstatus.login == rTarget) {
        let vipDate = vipstatus.grantedAt;
        vipRes = `that user has been a VIP "${targetChannel}" for - ${calcDate(new Date(), new Date(vipDate), ['s'])}`;
      }
    });

    if (vipRes != "") {
      client.action(channel, `@${user} ${vipRes}`);
    } else return client.action(channel, `@${user} that user is not a VIP in "${targetChannel}"`);
  }
}

export = vipCheckCommand;