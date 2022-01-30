import { Actions, CommonUserstate } from "tmi.js";
import { calcDate, fetchAPI, getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const modcheckCommand: CommandInt = {
  name: "modcheck",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "This command tells you if a user is a mod in a given channel, and for how long. It defaults to EsfandTV.",
  dynamicDescription: [
    "Check if a user is moderator in Esfand's chat.",
    "<code>!modcheck (user)</code>",
    "",
    "Check if a user is moderator in another channel.",
    "<code>!modcheck (user) (channel)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;
    let rTarget = target.toLowerCase();

    let targetChannel = context[1];
    if (!targetChannel) targetChannel = 'esfandtv';
    if (targetChannel.startsWith("@")) {
      targetChannel = targetChannel.substring(1);
    } else targetChannel = targetChannel;

    let modCheck = await fetchAPI(`https://api.ivr.fi/twitch/modsvips/${targetChannel}`);
    let isMod = modCheck["mods"];
    let modRes = "";

    await isMod.forEach(async function (modstatus: any) {
      if (modstatus.login == rTarget) {
        let modDate = modstatus.grantedAt;
        modRes = `that user has been a M OMEGALUL D in "${targetChannel}" for - ${calcDate(new Date(), new Date(modDate), true)}`;
      }
    });
    
    if (modRes != "") {
      client.action(channel, `@${user} ${modRes}`);
    } else return client.action(channel, `@${user} that user is not a mod in "${targetChannel}"`);

  }
}

export = modcheckCommand;