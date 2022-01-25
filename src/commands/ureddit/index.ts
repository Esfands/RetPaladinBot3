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

    let req = await fetchAPI(url);
    let posts = req["data"]["children"];
    //let randomPost = posts[Math.floor(Math.random()*posts.length)]
    //console.log(randomPost);
  }
}

export = uredditCommand;