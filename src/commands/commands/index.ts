import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { getOTFCommandNames } from "../command/OTFCommands";

const otfcommands: CommandInt = {
  name: "otfcommands",
  aliases: ["otfcmds", "otf"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Lists the on the fly commands.",
  dynamicDescription: [
    "<code>!otfcommands</code>",
    "<code>!otfcmds</code>",
    "<code>!otf</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];
    let otfComms = await getOTFCommandNames();
    let res = `@${user} current on the fly commands: ${otfComms.join(", ")}`;
    let message = (res.length >= 450) ? `${user} sorry, the list is too long to post here: https://www.retpaladinbot.com/` : res;
    client.action(channel, message);
  }
}

export = otfcommands;