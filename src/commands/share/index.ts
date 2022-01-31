import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt, CommandPermissions } from "../../validation/CommandSchema";

const share: CommandInt = {
  Name: "share",
  Aliases: ["broadcast"],
  Permissions: [CommandPermissions.MODERATOR],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Share a message or link a certain number of times.",
  DynamicDescription: [
    "Count is the number of times the message will be sent.",
    "Delay is optional, default is 1/2 a second.",
    "<code>!share (count) (delay) (message)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    // $share (how many times to spam) (delay in seconds (optional)) (message)
    let shareCount = parseInt(context[0], 10);
    let defaultTO = 300;

    // means delay has been added
    let conNum = parseInt(context[1]);
    let isDelay: any = (Number(conNum)) ? conNum * 500 : defaultTO;
    if (context[1].toLowerCase() === "volt") isDelay = 0.01;

    if (shareCount > 80) return client.action(channel, `@${userstate["display-name"]} anything over 80 times the purple snakes will get me monkaOMEGA`);

    let message: string | null = null;
    if (isDelay === defaultTO) {
      context.splice(0, 1)
      message = context.join(" ");
    } else {
      context.splice(0, 2);
      message = context.join(" ");
    }

    let stepCount = 1;
    let shareLinkId = setInterval(function () {
      if (stepCount === shareCount) {
        clearInterval(shareLinkId);
      }
      client.action(channel, `${message}`)
      stepCount++;
    }, isDelay);
  }
}

export = share;