import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const song: CommandInt = {
  Name: "song",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get current song Esfand is playing through Spotify.",
  DynamicDescription: [
    "<code>!song</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let tagged = getTarget(user, context[0]);

    const data = await axios({
      method: "GET",
      url: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=esfandtv&api_key=${config.apiKeys.last_fm}&format=json`
    });

    if (!data) return client.action(channel, `@${user} there was an issue fetching the current song!`);
    let recentSong = await data.data.recenttracks.track[0];
    client.action(channel, `@${tagged} current song: ${recentSong["name"]} - ${recentSong["artist"]["#text"]} | Full history -> https://www.last.fm/user/esfandtv/library`);
  }
}

export = song;