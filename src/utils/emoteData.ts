import { fetchAPI } from ".";

interface IEmote {
  Name: string;
  ID: string | number;
  Added: Date;
}

let cache: IEmote[] = [];

export async function storeEmotes() {
  const BTTVData = await fetchAPI(`https://api.betterttv.net/3/cached/users/twitch/38746172`);
  const FFZData = await fetchAPI(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/38746172`);
  const sevenTVData = await fetchAPI("https://api.7tv.app/v2/users/esfandtv/emotes");

  

}
