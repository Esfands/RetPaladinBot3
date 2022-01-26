import { fetchAPI } from ".";
import { findQuery, insertRow, removeOne } from "./maria";

enum EmoteTypes {
  seventv,
  bttv,
  ffz
}

interface IEmote {
  Name: string;
  ID: string | number;
  Type: EmoteTypes;
  URL: string;
  Added: Date;
}

let cache: IEmote[] = [];

export async function storeEmotes() {
  const FFZData = await fetchAPI(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/38746172`);

  const emotes = await findQuery(`SELECT * FROM emotes`);

  let errMessage = "";
  try {
    const sevenTVData = await fetchAPI("https://api.7tv.app/v2/users/esfandtv/emotes");

    if (!sevenTVData.length) {
      throw "err";
    }

    const checkForRepeatedEmotesSeventv = async (emote: string, id: string, type: string) => {
      if (!sevenTVData) return "";

      const updateEmotes = emotes.find((i: any) => i.id === id);

      if (!updateEmotes) {
        const findEmote = sevenTVData.filter((i: any) => i.id === id);
        let emoteLink = findEmote[0].urls[0][1];
        emoteLink = emoteLink.substring(0, emoteLink.length - 2);

        await insertRow(`INSERT INTO emotes (Name, ID, Type, URL, Added) VALUES (?, ?, ?, ?, ?)`, [emote, id, type, emoteLink, new Date()])
      }
    }
    sevenTVData.map((i: any) => checkForRepeatedEmotesSeventv(i.name, i.id, "7tv"));
  } catch (err) { errMessage += "7tv " };

  try {
    const BTTVData = await fetchAPI(`https://api.betterttv.net/3/cached/users/twitch/38746172`);
    const allBttvemotes = BTTVData.channelEmotes.concat(BTTVData.sharedEmotes);

    const checkForRepeatedEmotesBttv = async (emote: string, id: string | number, type: string) => {
      console.log(emote, id, type);
      const updateEmotes = emotes.find((i: any) => i.url.replace('https://cdn.betterttv.net/emote/', '').replace('/1x', '') === id);
      console.log()
      if (!updateEmotes) {
        const findEmote = allBttvemotes.filter((i: any) => i.id === id);
        const emoteLink = `https://cdn.betterttv.net/emote/${findEmote[0].id}/1x`;

        await insertRow(`INSERT INTO emotes (Name, ID, Type, URL, Added) VALUES (?, ?, ?, ?, ?)`, [emote, id, type, emoteLink, new Date()])
      }
    }

    for (let j = 0; j < emotes.length; j++) {
      if (!BTTVData) break;

      if (emotes[j].type === "bttv") {
        if (!allBttvemotes.some((i: any) => emotes[j].url.replace('https://cdn.betterttv.net/emote/', '').replace('/1x', '') === (i.id))) {
          await removeOne('emotes', `ID=?`, [emotes[j].ID]);
        }
      }
    }

    allBttvemotes.map((i: any) => checkForRepeatedEmotesBttv(i.code, i.id, "bttv"));
  } catch (err) { errMessage += "bttv " };


}
