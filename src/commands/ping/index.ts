import { Actions, CommonUserstate } from "tmi.js";
import { secondsToHms } from "../../utils";
export = {
  name: "ping",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Ping the bot",
  dynamicDescription: [
    "<code>!ping</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: []) => {
    var uptime = process.uptime();

    await client.ping().then(function (data) {
      let ping: number = Math.floor(Math.round(data as any * 1000));
      client.say(channel, `@${userstate['display-name']}, FeelsOkayMan 🏓 Uptime: ${secondsToHms(uptime)} Latency to Twitch IRC: ${ping}ms`);
    });
  }
}