import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { shortenURL, timeDifference } from "../../utils";
export = {
  name: "tweet",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get a users most recent tweet.",
  dynamicDescription: [
    "<code>!tweet</code>",
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    var userSearch = (context[0]) ? context[0] : "EsfandTV";

    // Get user ID
    var headers = {
      "Authorization": `Bearer ${config.apiKeys.twitter.bearer}`
    }

    try {
      var queryUser = await axios(`https://api.twitter.com/2/users/by?usernames=${userSearch}`, { method: "GET", headers: headers });
      var userData = await queryUser.data;
    } catch (error) {
      client.say(channel, `Couldn't find twitter user "${userSearch}"`);
      return;
    }

    // Get users recent tweets
    try {
      var recentTweets = await axios(`https://api.twitter.com/2/users/${userData["data"][0]["id"]}/tweets`, { method: "GET", headers: headers });
      var tweetsData = await recentTweets.data;
    } catch (error) {
      client.say(channel, `Couldn't find twitter user "${userSearch}"`);
      return;
    }

    // Get the most recent tweet
    var recentTweet = await axios(`https://api.twitter.com/2/tweets?ids=${tweetsData["meta"]["newest_id"]}&tweet.fields=created_at`, { method: "GET", headers: headers });
    var recentData = await recentTweet.data;

    var elapsed = timeDifference(new Date(), new Date(recentData["data"][0]["created_at"]), true);
    var twitterLink = `https://twitter.com/${userSearch.toLowerCase()}/status/${recentData["data"][0]["id"]}`;
    var arrowRegex = new RegExp("-&gt;", "g");

    var tweetText = (arrowRegex.test(recentData["data"][0]["text"])) 
    ? recentData["data"][0]["text"].replace(arrowRegex, "->")
    : recentData["data"][0]["text"];

    shortenURL(twitterLink).then((result) => {
      client.say(channel, `(@${userSearch}) ${tweetText} | ${elapsed} ${result}`)
    });
  }
}