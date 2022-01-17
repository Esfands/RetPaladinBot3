import axios from "axios";
import config from "../cfg/config";

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
    let streamers = {streamer: data.data[i]["to_name"], date: data.data[i]["followed_at"]};
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
      total.push({streamer: pages[i][j]["to_name"], date: pages[i][j]["followed_at"]});
    }
  }
  return total;
}