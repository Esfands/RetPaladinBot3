import { Actions } from "tmi.js";
import { StreamStat } from "../../schemas/StreamStatsSchema";

export default async (client: Actions, channel: string, target: string, viewers: number) => {
   StreamStat.updateOne({ type: "esfandtv" }, { hosting: channel });
}