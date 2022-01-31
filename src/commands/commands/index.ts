import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { getOTFCommandNames } from "../command/OTFCommands";

const otfcommands: CommandInt = {
  Name: "otfcommands",
  Aliases: ["otfcmds", "otf"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Lists the on the fly commands.",
  DynamicDescription: [
    "<code>!otfcommands</code>",
    "<code>!otfcmds</code>",
    "<code>!otf</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];
    let otfComms = await getOTFCommandNames();
    let res = `@${user} current on the fly commands: ${otfComms.join(", ")}`;
    let message = (res.length >= 450) ? `${user} sorry, the list is too long to post here: https://www.retpaladinbot.com/` : res;
    client.action(channel, message);
  }
}

export = otfcommands;