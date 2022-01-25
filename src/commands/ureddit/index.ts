import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const uredditCommand: CommandInt = {
  name: "ureddit",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Grabs a random post from EsfandTV's subreddit",
  dynamicDescription: [
    "<code>!ureddit</code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const date = ["month", "year", "day", "week", "today"];
    const trending = ["top", "hot"];

    let chosenDate = date[Math.floor(Math.random()*date.length)];
    let chosenTrend = trending[Math.floor(Math.random()*trending.length)];

    let url = `https://www.reddit.com/r/esfandtv.json?`;
    url = url.concat(`sort=${chosenTrend}`);
    url = url.concat(`&t=${chosenDate}`);

    try {
      let req = await fetchAPI(url);
      let posts = req["data"]["children"];
      console.log(posts);
      //let randomPost = posts[Math.floor(Math.random()*posts.length)]
      //console.log(randomPost);
    } catch (error) {
      return client.action(channel, `🚨 @${userstate["display-name"]} there was an error fetching Reddit API.`);
    }

  }
}

export = uredditCommand;