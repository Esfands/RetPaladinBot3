import axios from "axios";
import config from "../../cfg/config";
import { refreshEsfandToken } from "../helix";
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

  console.log(checkRequest.data);
/*   axios({
    method: "POST",
    url: "https://api.twitch.tv/helix/eventsub/subscriptions",
    headers: {
      "Client-ID": config.helixOptions.clientId,
      "Authorization": "Bearer " + config.helixOptions.appToken
    },
    data: {
      "type": event,
      "version": "1",
      "condition": { "broadcaster_user_id": "38746172" },
      "transport": {
        "method": "webhook",
        "callback": "https://api.retpaladinbot.com/eventsub",
        "secret": "dd478c6a25727073f183a56728575ed94618d9cce600c4add602e7a66b78eeac"
      }
    }
  }) */
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

