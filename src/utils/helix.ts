import axios from "axios";
import { CommonUserstate } from "tmi.js";
import { fetchAPI } from ".";
import config from "../cfg/config";
import { pool } from "../main";
import { findOne, findQuery, removeOne, updateOne } from "./maria";

function getHelixURL(endpoint: string, query: object | string) {
  return `https://api.twitch.tv/helix/${endpoint}?${query}`
}

const headers = {
  "Client-ID": config.helixOptions.clientId,
  "Authorization": "Bearer " + config.helixOptions.token
};

async function fetchHelixAPI(endpoint: string, query: object | string) {
  let URL = `https://api.twitch.tv/helix/${endpoint}?${query}`;
  let userInfo = await axios({ method: "get", url: URL, headers: headers });
  return userInfo.data;
}

export async function getUser(user: string | number) {
  return await fetchHelixAPI("users", Number(user) ? `id=${user}` : `login=${user}`);
}

export async function getUserId(username: string) {
  let id = await getUser(username);
  return id["data"][0]["id"];
}

export async function get100Ids(usernames: string[]) {
  for (let i = 0; i < usernames.length; i++) {
    if (i != 0) {
      usernames[i] = "&login=" + usernames[i];
    } else usernames[i] = `login=${usernames[i]}`;
  }

  let usersIds = await fetchHelixAPI("users", usernames.join(""));

  let toSend: object[] = [];
  usersIds["data"].forEach((tid: any) => {
    toSend.push({ name: tid["login"], tid: tid["id"] })
  });

  return toSend;
}

export async function getStream(user: string | number) {
  return await fetchHelixAPI("streams", Number(user) ? `user_id=${user}` : `user_login=${user}`);
}

export async function getStreamData(username: string | number): Promise<any> {
  let id = await getUser(username);
  return await getStream(id["data"][0]["id"]);
}

export async function getFollowers(username: string | number) {
  let id = await getUser(username);
  let query = await fetchHelixAPI("users/follows", `to_id=${id["data"][0]["id"]}&first=1`);
  return query.total;
}

export async function isFollowingUser(streamer: string, user: string) {
  let streamerId = (streamer === "esfandtv") ? 38746172 : await getUserId(streamer);
  let userId;
  try {
    userId = await getUserId(user);
  } catch (err) {
    if (err) return null;
  }

  let response = await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${userId}&to_id=${streamerId}`, {
    method: "GET",
    headers: headers
  });

  return await response.data;
}

export async function getUsersFollowers(username: string) {
  let id = await getUserId(username);

  let response = await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100`, {
    method: "GET",
    headers: headers
  });

  let data = await response.data;
  let total = [];
  for (let i = 0; i < data.data.length; i++) {
    let streamers = { streamer: data.data[i]["to_name"], date: data.data[i]["followed_at"] };
    total.push(streamers);
  }

  let totalPages = Math.ceil(data.total / 100);
  let cursor = data.pagination.cursor;
  let pages = [];
  for (let i = 1; i < totalPages; i++) {
    let response2 = await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100&after=${cursor}`, {
      method: "GET",
      headers: headers
    });

    let datatwo = await response2.data;
    cursor = datatwo.pagination.cursor;
    pages.push(datatwo.data);
  }

  for (let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages[i].length; j++) {
      total.push({ streamer: pages[i][j]["to_name"], date: pages[i][j]["followed_at"] });
    }
  }
  return total;
}

export async function getChannelEmotes(username: string) {
  let userId = await getUserId(username);
  let emotes = await axios({ method: "get", url: `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${userId}`, headers: headers });
  return emotes.data;
}

export async function getAllChatters(channel: string) {
  let chatters: string[] = [];

  let chatData = await fetchAPI(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
  let cd = chatData["chatters"];
  chatters.push(...cd["broadcaster"], ...cd["moderators"], ...cd["staff"], ...cd["admins"], ...cd["global_mods"], ...cd["viewers"]);
  return chatters;
}

export async function checkUserTimeout(userid: CommonUserstate["user-id"]) {
  let found = await findOne('timeouts', `ID='${userid}'`);
  if (found) {
    if (found["ExpiresAt"] < new Date()) {
      let conn;
      try {
        conn = await pool.getConnection();
        await conn.query(`DELETE FROM timeouts WHERE ID='${userid}';`);
        return true;
      } catch (err) {
        throw err;
      } finally {
        if (conn) conn.end()
        return true;
      }
    } else {
      return false;
    }
  }
}

export async function refreshEsfandToken() {
  let query = await findOne('tokens', `Username='esfandtv'`);
  let refresh = query["RefreshToken"];

  let link = `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refresh}&client_id=${config.helixOptions.clientId}&client_secret=${config.helixOptions.clientSecret}`
  let post = await axios({
    method: "POST",
    url: link
  });

  await updateOne(`UPDATE tokens SET AccessToken='${post.data["access_token"]}', RefreshToken='${post.data["refresh_token"]}' WHERE Username='esfandtv'`);
}

export async function getEsfandSubs() {
  let query = await findOne('tokens', `Username='esfandtv'`);
  let request = await axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/subscriptions?broadcaster_id=38746172&first=100",
    headers: {
      "Authorization": "Bearer " + query["AccessToken"],
      "Client-Id": config.helixOptions.clientId
    }
  });

  let data = request.data;
  let subs: string[] = [];
  data["data"].forEach((user: any) => {
    subs.push(user["user_id"]);
  });

  let totalPages: number = Math.ceil(data.total / 100);
  let cursor: string = data["pagination"]["cursor"];
  let pages: any[] = [];

  for (let i = 1; i < totalPages; i++) {
    let request2 = await axios({
      method: "GET",
      url: "https://api.twitch.tv/helix/subscriptions?broadcaster_id=38746172&first=100&after=" + cursor,
      headers: {
        "Authorization": "Bearer " + query["AccessToken"],
        "Client-Id": config.helixOptions.clientId
      }
    });

    let data2 = await request2.data;
    cursor = data2.pagination.cursor;
    pages.push(data2.data);
  }

  for (let i = 0; i < pages.length; i++) {
    pages[i].forEach((user: any) => {
      subs.push(user["user_id"]);
    });
  }

  return subs;
}