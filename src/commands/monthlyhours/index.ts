import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, fetchAPI, logError, minsToHours } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

interface TwitchTrakcer {
  rank: number;
  minutes_streamed: number;
  avg_viewers: number;
  max_viewers: number;
  hours_watched: number;
  followers: number;
  views: number;
  followers_total: number;
  views_total: number;
}

const monthlyhours: CommandInt = {
  name: "monthlyhours",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check how many hours Esfand streamed this month.",
  dynamicDescription: [
    "<code>!monthlyhours</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let monthlyData;

    try {
      monthlyData = fetchAPI("https://twitchtracker.com/api/channels/summary/esfandtv");
    } catch (error) {
      logError(userstate["display-name"]!, ErrorType.API, `Error fetching API for !monthlyhours - https://twitchtracker.com/api/channels/summary/esfandtv`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`)
    }

    let raw: TwitchTrakcer = await monthlyData;
    let monthlyMins: number = raw["minutes_streamed"];

    let hours: number = (raw["minutes_streamed"] / 60);
    let days = Math.round((Math.round(hours) / 24));

    let msg = (days > 1) 
    ? `@${userstate["display-name"]} Esfand has streamed ${days} days (${minsToHours(monthlyMins)}) since the 1st.`
    : `@${userstate["display-name"]} Esfand has streamed ${minsToHours(monthlyMins)} since the 1st.`;
    client.action(channel, msg);
  }
}

export = monthlyhours;