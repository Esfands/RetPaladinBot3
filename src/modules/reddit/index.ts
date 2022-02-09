// Reddit bot that auto-posts the latest YouTube video
import axios from "axios";
import Snoowrap from "snoowrap";
import { } from 'snoostorm';
import config from "../../cfg/config";
import { findOne, insertRow, updateOne } from "../../utils/maria";

// Reddit bot init
let redditClient: Snoowrap;

(async () => {
  redditClient = new Snoowrap({
    userAgent: 'retpaladinbot',
    clientId: config.apiKeys.reddit.id,
    clientSecret: config.apiKeys.reddit.secret,
    accessToken: config.apiKeys.reddit.token,
    refreshToken: config.apiKeys.reddit.refresh
  });

  /* setInterval(checkCurrentVideo, 300 * 1000) // every 5 minutes */

})();

enum PostStatus {
  OLD = "old",
  NEW = "new",
}

async function getVideoData() {
  let request = await axios.get("https://api.onlyfands.net/videos");
  let data = request.data;
  return data;
}

async function checkCurrentVideo() {
  let data = await getVideoData();
  let storedId = await findOne('reddit', `Status='${PostStatus.NEW}'`);

  // if true grab the new video, if not then wait another interval.
  if (storedId["VideoId"] === data["data"]["items"][0]["id"]["videoId"]) {
  } else {
    console.log(`[REDDIT] New video has been posted`)
    await getLatestVideo();
  }
}

export async function getLatestVideo() {
  // Check if cached date is empty, meaning we don't have the cached date.
  let data = await getVideoData();

  let latestVideo = data["data"]["items"][0]["snippet"];

  let videoTitle: string = latestVideo["title"];
  let aposRegex = /&#39;/gm; //&#39; = ' 

  if (aposRegex.test(videoTitle)) videoTitle = videoTitle.replace(aposRegex, "'");

  console.log(videoTitle, `https://www.youtube.com/watch?v=${data["data"]["items"][0]["id"]["videoId"]}`, data["data"]["items"][0]["id"]["videoId"]);
  //await redditPostVideo(videoTitle, `https://www.youtube.com/watch?v=${data["data"]["items"][0]["id"]["videoId"]}`, data["data"]["items"][0]["id"]["videoId"]);
}

async function redditPostVideo(title: string, link: string, id: string) {
  redditClient.getSubreddit('retpaladinbot')
    .submitLink({
      title: title,
      url: link,
      subredditName: ""
    }).then(async (res: any) => {
      let old = await findOne(`reddit`, `Status='${PostStatus.NEW}'`);
      if (old) {
        // TODO: Unsticky the found id.
        await updateOne(`UPDATE reddit SET Status='${PostStatus.OLD}' WHERE Status='${PostStatus.NEW}'`);

        // TODO: Stick the id.
        await insertRow(`INSERT INTO reddit (ID, Title, VideoId, Status) VALUES (?, ?, ?, ?);`, [res.name, title, id, PostStatus.NEW]);
      } else {
        // TODO: Stick the id.
        await insertRow(`INSERT INTO reddit (ID, Title, VideoId, Status) VALUES (?, ?, ?, ?);`, [res.name, title, id, PostStatus.NEW]);
      }
    }).catch((error: any) => {
      console.log(error);
    });
}