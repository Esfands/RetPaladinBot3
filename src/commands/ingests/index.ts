import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const ingestCommand: CommandInt = {
  name: "ingests",
  aliases: ["ingest"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "The Twitch ingesting system is the first stop for a broadcast stream. An ingest server receives your stream, and the ingesting system authorizes and registers streams, then prepares them for viewers. This checks the health status of those.",
  dynamicDescription: [
    "<code>!ingests</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];

    let ingests = await fetchAPI('https://decapi.me/twitch/ingests');
    console.log(ingests.split("Name"));
  }
}

export = ingestCommand;