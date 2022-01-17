import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI, minsToHours } from "../../utils";

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

export = {
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
    var monthlyData = fetchAPI("https://twitchtracker.com/api/channels/summary/esfandtv");
    var raw: TwitchTrakcer = await monthlyData;
    var monthlyMins: number = raw["minutes_streamed"];
    client.action(channel, `@${userstate["display-name"]} Esfand has streamed ${minsToHours(monthlyMins)} since the 1st.`);
  }
}