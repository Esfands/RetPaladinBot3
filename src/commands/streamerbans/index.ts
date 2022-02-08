import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { calcDate, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const streamerBansCommand: CommandInt = {
  Name: "streamerbans",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get the most recent Tweet from StreamerBans",
  DynamicDescription: [
    "<code>!streamerbans</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let userSearch: string = "streamerbans";
    let userData;
    let tweetsData;
    
    // Get user ID
    let headers = {
      "Authorization": `Bearer ${config.apiKeys.twitter.bearer}`
    }

    try {
      let queryUser = await axios(`https://api.twitter.com/2/users/by?usernames=${userSearch}`, { method: "GET", headers: headers });
      userData = await queryUser.data;
    } catch (error) {
      client.say(channel, `Couldn't find twitter user "${userSearch}"`);
      return;
    }

    // Get users recent tweets
    try {
      let recentTweets = await axios(`https://api.twitter.com/2/users/${userData["data"][0]["id"]}/tweets?&exclude=replies,retweets`, { method: "GET", headers: headers });
      tweetsData = await recentTweets.data;
    } catch (error) {
      client.say(channel, `Couldn't find twitter user "${userSearch}"`);
      return;
    }

    // Get the most recent tweet
    let recentTweet = await axios(`https://api.twitter.com/2/tweets?ids=${tweetsData["meta"]["newest_id"]}&tweet.fields=created_at`, { method: "GET", headers: headers });
    let recentData = await recentTweet.data;

    let elapsed = calcDate(new Date(), new Date(recentData["data"][0]["created_at"]), true);
    let twitterLink = `https://twitter.com/${userSearch.toLowerCase()}/status/${recentData["data"][0]["id"]}`;

    // Check for ->
    let arrowRegex = new RegExp("-&gt;", "g");
    let tweetText = (arrowRegex.test(recentData["data"][0]["text"]))
      ? recentData["data"][0]["text"].replace(arrowRegex, "->")
      : recentData["data"][0]["text"];

    // check for &
    tweetText = (/&amp;/g.test(tweetText))
      ? tweetText.replace(/&amp;/g, "&")
      : tweetText;

    let shortenedLink = await shortenURL(twitterLink);
    client.say(channel, `(@${userSearch}) ${tweetText} | ${elapsed} - ${shortenedLink}`);
  }
}

export = streamerBansCommand;