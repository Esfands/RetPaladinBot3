import { getBestAvailableEmote } from "../../utils/emotes";

export default async(client: any, channel: any, username: any, numbOfSubs: any, methods: any, userstate: any) => {
  const tierList: any = { 1000: 'Tier 1', 2000: 'Tier 2', 3000: 'Tier 3' };
  const { prime, plan, planName } = methods;
  client.say(channel, `@EsfandTV - ${username} has gifted ${numbOfSubs} ${tierList[plan]} subs ${getBestAvailableEmote(["PogU", "PagMan", "Pog", "PogChamp"])}`);
}