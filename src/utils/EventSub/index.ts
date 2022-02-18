import axios from "axios";
import config from "../../cfg/config";
import { refreshEsfandToken, validateToken } from "../helix";
import { findOne } from "../maria";

export async function createEventSub(event: string) {
  //console.log(`created ${event} event`);
  let eId = await findOne('tokens', `Username='esfandtv'`);
  let checkRequest = await axios({
    method: "GET",
    url: "https://id.twitch.tv/oauth2/validate",
    headers: {
      "Authorization": "Bearer " + eId.AccessToken
    }
  });

  console.log(checkRequest);
  axios({
    method: "POST",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: {
      "Client-ID": config.helixOptions.clientId,
      "Authorization": "Bearer " + config.helixOptions.appToken
    },
    data: {
      "type": event,
      "version": "1",
      "condition": { "broadcaster_user_id": "47529299" },
      "transport": {
        "method": "webhook",
        "callback": "https://api.retpaladinbot.com/eventsub",
        "secret": "dd478c6a25727073f183a56728575ed94618d9cce600c4add602e7a66b78eeac"
      }
    }
  });
}

/* To remove
  a0b023fa-ba82-4015-93ef-d2a947693dec X
  e5dd5c93-a8d1-4910-9aeb-f483a9c57a25 X
  7abd8f17-eace-47c3-8c41-bd9f58a1ea18 X
  3b6d2150-25e7-456d-91be-fd85ca39c2ce X
  5c98734b-22af-4884-826d-cae5840c6554 X
  522b4dad-2a04-4025-92b7-eb2394c038f8 X
*/

export async function deleteEventSub(eventId: string) {
  let res = await axios({
    method: "DELETE",
    url: "ttps://api.twitch.tv/helix/eventsub/subscriptions?id="+eventId,
    headers: {
      "Client-ID": config.helixOptions.clientId,
      "Authorization": "Bearer " + config.helixOptions.appToken
    }
  });
  console.log(res.data);
}

export async function getEventSubs() {


  const response = await axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: {
      "Client-ID": config.helixOptions.clientId,
      "Authorization": "Bearer " + config.helixOptions.appToken
    }
  });

  return await response.data;
}

export async function appAccessToken() {
  let test = await validateToken(config.helixOptions.token);
  console.log(test);
}

export async function refreshToken(username: string) {
  console.log(username);
  let eId = await findOne('tokens', `Username='${username}'`);
  console.log(eId);
  /*   let checkRequest = await axios({
      method: "GET",
      url: "https://id.twitch.tv/oauth2/validate",
      headers: {
        "Authorization": "Bearer " + eId.AccessToken
      }
    }); */

  // console.log(checkRequest);
}