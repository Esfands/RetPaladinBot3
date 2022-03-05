import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { calcDate, logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const tweet: CommandInt = {
  Name: "tweet",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a users most recent tweet.",
  DynamicDescription: [
    "Shows Esfand's most recent tweet",
    "<code>!tweet</code>",
    "",
    "Find another users tweet.",
    "<code>!tweet (user)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let userSearch = (context[0]) ? context[0] : "EsfandTV";
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

    try {
      let recentTweet = await axios(`https://api.twitter.com/2/tweets?ids=${tweetsData["meta"]["newest_id"]}&tweet.fields=created_at`, { method: "GET", headers: headers });
      let recentData = await recentTweet.data;

      let elapsed = calcDate(new Date(), new Date(recentData["data"][0]["created_at"]), []);
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
    } catch(error) {
      logError(userstate["display-name"]!, 'api', `Error fetching API for !tweet: ${userSearch}`, new Date());
      return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue trying to get a tweet from "${userSearch}"`);
    }
  }
}

export = tweet;