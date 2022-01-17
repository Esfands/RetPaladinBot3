import { Actions, CommonUserstate } from "tmi.js";

export = {
  name: "share",
  aliases: ["broadcast"],
  permissions: ["broadcaster", "moderator"],
  globalCooldown: 10,
  cooldown: 30,
  description: "Share a message or link a certain number of times.",
  dynamicDescription: [
    "Count is the number of times the message will be sent.",
    "Delay is optional, default is 1/2 a second.",
    "<code>!share (count) (delay) (message)</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    // $share (how many times to spam) (delay in seconds (optional)) (message)
    var shareCount = parseInt(context[0], 10);
    var defaultTO = 300;

    // means delay has been added
    var conNum = parseInt(context[1]);
    var isDelay: any = (Number(conNum)) ? conNum * 500 : defaultTO;
    if (context[1].toLowerCase() === "volt") isDelay = 0.01;

    if (shareCount > 80) return client.action(channel, `@${userstate["display-name"]} anything over 80 times the purple snakes will get me monkaOMEGA`);

    var message: string | null = null;
    if (isDelay === defaultTO) {
      context.splice(0, 1)
      message = context.join(" ");
    } else {
      context.splice(0, 2);
      message = context.join(" ");
    }

    var stepCount = 1;
    var shareLinkId = setInterval(function () {
      if (stepCount === shareCount) {
        clearInterval(shareLinkId);
      }
      client.action(channel, `${message}`)
      stepCount++;
    }, isDelay);
  }
}