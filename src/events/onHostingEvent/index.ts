import { Actions } from "tmi.js";
import { updateOne } from "../../utils/maria";

export default async (client: Actions, channel: string, target: string, viewers: number) => {
   await updateOne(`UPDATE streamstats SET Hosting='${channel}' WHERE Streamer='esfandtv';`);
}