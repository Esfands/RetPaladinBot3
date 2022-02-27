import { subathonLogEvent, SubathonStatType } from "../../modules/subathon-stats";
import { addSubToSpin } from "../../modules/wheel-spin-counter"
import { getBestAvailableEmote } from "../../utils/emotes";

export default async (client: any, channel: any, username: any, streakMonths: any, recipient: any, methods: any, userstate: any) => {
  subathonLogEvent(userstate, SubathonStatType.SUB, 1);
  addSubToSpin(1, username);
}