import axios from "axios";
import EventSource from "eventsource";
import { Actions } from "tmi.js";
import { pool } from "../../main";
import { findQuery, insertRow, removeOne } from "../../utils/maria";

interface EmoteEventUpdate {
  channel: string;
  emote_id: string;
  name: string;
  action: "ADD" | "REMOVE" | "UPDATE";
  actor: string;
  emote?: ExtraEmoteData;
}

interface ExtraEmoteData {
  name: string;
  visibility: number;
  mime: string;
  tags: string[];
  width: [number, number, number, number];
  height: [number, number, number, number];
  animated: boolean;
  owner: {
    id: string;
    twitch_id: string;
    display_name: string;
    login: string;
  };
  urls: [[string, string]];
}

export const handleSevenTVUpdate = async (client: Actions, event: EmoteEventUpdate) => {
  let eventType = event.action;
  if (eventType === "ADD") {
    client.action(event.channel, `[7tv] ${event.actor} added the emote ${event.name}`);
  } else if (eventType === "REMOVE") {
    client.action(event.channel, `[7tv] ${event.actor} removed the emote ${event.name}`);
  } else if (eventType === "UPDATE") {
    client.action(event.channel, `[7tv] ${event.actor} set the name from ${event.emote?.name} to ${event.name}`);
  }
}

async function handleSevenTv(event: EmoteEventUpdate, client: Actions) {
  if (event.action === "ADD") {
    console.log(`[7tv] Added new emote: ${event.emote?.name}`);
    let values = [event.name, event.emote_id, "7tv", "channel", `${event.emote?.urls[0][1]}`];
    await insertRow(`INSERT INTO emotes (Name, ID, Service, Scope, URL, ZeroWidth) VALUES (?, ?, ?, ?, ?, ?)`, values);
    handleSevenTVUpdate

  } else if (event.action === "UPDATE") {
    console.log(`[7tv] Updated emote: ${event.emote?.name}`);

  } else if (event.action === "REMOVE") {
    console.log(`[7tv] Removed emote: ${event.name}`);
    await removeOne(`emotes`, 'Name=?', [event.name]);
  }

  handleSevenTVUpdate(client, event);
}

export default async function openEmoteListeners(client: Actions) {
  let sevenTvConn = new EventSource("https://events.7tv.app/v1/channel-emotes?channel=esfandtv");

  sevenTvConn.addEventListener("ready", (e: any) => {
    console.log(`[7tv] Ready and connected to: ${e.data}`);
  });

  sevenTvConn.addEventListener("update", async (e: any) => {
    await handleSevenTv(JSON.parse(e.data), client);
  });

  sevenTvConn.addEventListener("open", (e: any) => {
    console.log('[7tv] Opened event source.');
  });

  sevenTvConn.addEventListener("error", (e: any) => {
    if (e.readyState === EventSource.CLOSED) {
      console.log('[7tv] Closed event source.');
    }
  });
}

const bttvZeroWidth: string[] = ['SoSnowy', 'IceCold', 'cvHazmat', 'cvMask'];
const urls: any = {
  twitch: {
    channel: (channelName: string | number) =>
      `https://api.retpaladinbot.com/twitch/emotes?id=${channelName}`,
    cdn: (emoteId: string | number) =>
      `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/static/light/3.0`,
  },
  bttv: {
    channel: (channelId: number) =>
      `https://api.betterttv.net/3/cached/users/twitch/${channelId}`,
    global: () => 'https://api.betterttv.net/3/cached/emotes/global',
    cdn: (emoteId: string | number) => `https://cdn.betterttv.net/emote/${emoteId}/3x`,
  },
  ffz: {
    channel: (channelId: number) =>
      `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${channelId}`,
    global: () =>
      'https://api.betterttv.net/3/cached/frankerfacez/emotes/global',
    cdn: (emoteId: string | number) => `https://cdn.frankerfacez.com/emoticon/${emoteId}/2`,
  },
  stv: {
    channel: (channelName: string) =>
      `https://api.7tv.app/v2/users/${channelName}/emotes`,
    global: () => 'https://api.7tv.app/v2/emotes/global',
    cdn: (emoteId: string | number) => `https://cdn.7tv.app/emote/${emoteId}/3x`,
  },
};

interface EmoteObject {
  name: string;
  id: string | number;
  service: string;
  scope: string;
  url: string;
  zeroWidth: boolean;
  date: Date;
}

export async function storeAllEmotes(channelName: string, channelId: number) {
  let values: any[] = [];
  let fetchedIds: string[] = [];
  let emoteData = await getEmoteData(channelName, channelId);

  emoteData.forEach((emote: EmoteObject) => {
    values.push({
      name: emote.name,
      id: (typeof emote.id === "number") ? emote.id.toString() : emote.id,
      service: emote.service,
      scope: emote.scope,
      url: emote.url,
      zeroWidth: (emote.zeroWidth) ? "true" : "false"
    });

    fetchedIds.push(emote.id.toString());
  });

  // REMOVING: If emote is isn't in data but in table, remove from table.
  let currentTable = await findQuery('SELECT * FROM emotes;');
  let tableEmotes: any[] = [];

  currentTable.forEach((emote: any) => {
    tableEmotes.push({
      name: emote.Name,
      id: (typeof emote.ID === "number") ? emote.ID.toString() : emote.ID,
      service: emote.Service,
      scope: emote.Scope,
      url: emote.URL,
      zeroWidth: (emote.zeroWidth) ? "true" : "false"
    })
  });

  let notInData = tableEmotes.filter((emote) => !values.find(emote2 => emote.id === emote2.id));
  notInData.forEach(async (emote) => {
    await removeOne('emotes', 'ID=?', [emote.id]);
  });

  // ADDING: If emote is in data but not in table, add to table.
  let query = await findQuery('SELECT ID FROM emotes;');
  let queryIds: string[] = [];

  query.forEach((id: any) => {
    queryIds.push(id.ID);
  })

  let difference = fetchedIds.filter(x => queryIds.indexOf(x) === -1);
  let missingEmotes: EmoteObject[] = [];

  difference.forEach((missing: string) => {
    let found = values.find(e => e.id === missing);
    missingEmotes.push(found);
  })

  // Add the emotes missing in the fetched data to the database.
  let toStore: any[] = [];
  missingEmotes.forEach((emote: EmoteObject) => toStore.push(Object.values(emote)));

  if (toStore.length === 0) return console.log('[EMOTES] All emotes are up to date...');
  if (missingEmotes) {
    try {
      pool.batch('INSERT INTO emotes (Name, ID, Service, Scope, URL, ZeroWidth) VALUES (?, ?, ?, ?, ?, ?)', toStore);
    } catch (error) {
      console.log(error);
    }
  }

}

export function getEmoteData(channelName: string, channelId: number) {
  return Promise.allSettled([
    getTwitchEmotes('twitch', 'channel', 'name', channelName),
    getBttvChannelEmotes(channelId),
    getEmotesFromService('bttv', 'global', 'code', ''),
    getEmotesFromService('ffz', 'channel', 'code', channelId),
    getEmotesFromService('ffz', 'global', 'code', ''),
    getEmotesFromService('stv', 'channel', 'name', channelName),
    getEmotesFromService('stv', 'global', 'name', ''),
  ]).then((resAll) =>
    resAll
      .filter((res) => res.status === 'fulfilled')
      .map((res: any) => res.value)
      .flat()
  );
}

function getTwitchEmotes(service: string, type: string, nameProp: string, param: string) {
  console.log(urls[service][type](param));
  return axios
    .get(urls[service][type](param))
    .then((res: any) => mapEmoteData(res?.data.data, service, type, nameProp));
}

function getEmotesFromService(service: string, type: string, nameProp: string, param: string | number) {
  return axios
    .get(urls[service][type](param))
    .then((res) => mapEmoteData(res?.data, service, type, nameProp));
}

function getBttvChannelEmotes(channelId: number) {
  return axios.get(urls.bttv.channel(channelId)).then((res) => {
    const channelEmotes = mapEmoteData(
      res?.data.channelEmotes,
      'bttv',
      'channel',
      'code'
    );
    const sharedEmotes = mapEmoteData(
      res?.data.sharedEmotes,
      'bttv',
      'channel',
      'code'
    );

    return channelEmotes.concat(sharedEmotes);
  });
}

function mapEmoteData(data: any, service: string, type: string, nameProp: string) {
  return (
    data.map((emote: { [x: string]: any; }) => ({
      name: emote[nameProp],
      id: emote.id,
      service: service === 'stv' ? '7tv' : service,
      scope: type,
      url: getCdnUrl(emote, service),
      zeroWidth: isZeroWidth(emote, emote[nameProp]),
      date: new Date()
    })) || []
  );
}

function getCdnUrl(emote: any, service: string) {
  return service === 'twitch' && emote.format?.includes('animated')
    ? urls[service].cdn(emote.id).replace(/\/static\//, '/animated/')
    : urls[service].cdn(emote.id);
}

function isZeroWidth(emote: any, name: any) {
  return (
    !!emote?.visibility_simple?.includes('ZERO_WIDTH') ||
    bttvZeroWidth.includes(name)
  );
}