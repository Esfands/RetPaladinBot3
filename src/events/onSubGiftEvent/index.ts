import { subathonLogEvent, SubathonStatType } from "../../modules/subathon-stats";
import { addSubToSpin } from "../../modules/wheel-spin-counter"
import { getBestAvailableEmote } from "../../utils/emotes";

export default async (client: any, channel: any, username: any, streakMonths: any, recipient: any, methods: any, userstate: any) => {
  const tierList: any = { 1000: 'Tier 1', 2000: 'Tier 2', 3000: 'Tier 3' };
  const { prime, plan, planName } = methods;
  client.say(channel, `@EsfandTV - ${username} has gifted a ${tierList[plan]} sub to ${recipient} ${getBestAvailableEmote(["PogU", "PagMan", "Pog", "PogChamp"])}`);
  subathonLogEvent(userstate, SubathonStatType.SUB, 1);
  addSubToSpin(1, username);
}