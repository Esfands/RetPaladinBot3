import { Actions, CommonUserstate } from "tmi.js";
export = {
  name: "time",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get Esfands local time.",
  dynamicDescription: [
    "<code>!timezone</code>",
    "<code>!time @user</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    var tagged = (context[0]) ? context[0] : user;
    tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;
    var response = null;

    var date = new Date();
    var cst = date.toLocaleString("en-US", { timeZone: "America/Chicago", hour: 'numeric', minute: 'numeric', hour12: true });
    var mil = date.toLocaleString("en-US", { timeZone: "America/Chicago", hour: 'numeric', minute: 'numeric', hour12: false });
    response = `Esfand's local time is ${cst} CST KKona (${mil})`;

    client.action(channel, `@${tagged} ${response}`);
  }
}