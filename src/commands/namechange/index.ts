import { Actions, CommonUserstate } from "tmi.js";
import { StreamStat } from "../../schemas/StreamStatsSchema";
import { CommandInt } from "../../validation/CommandSchema";

const namechangeCommand: CommandInt = {
  Name: "namechange",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Change your name to another username.",
  DynamicDescription: [
    "<code>!namechange (oldname)</code>"
  ],
  Testing: true,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    // change mongodb notifications for each notification type.
    let liveNotification = await StreamStat.findOne({ type: "live" });
    let allGameNotification = await StreamStat.findOne({ type: "game" });
    let titleNotification = await StreamStat.findOne({ type: "title" });
    let offlineNotification = await StreamStat.findOne({ type: "offline" });

    // change username and displayname in chatters table
    // change username in notifications table
  }
}

export = namechangeCommand;