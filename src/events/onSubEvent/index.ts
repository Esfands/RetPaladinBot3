import { getBestAvailableEmote } from "../../utils/emotes";

export default async (client: any, channel: any, username: any, method: any, message: any, userstate: any) => {
  const tierList: any = { 1000: 'Tier 1', 2000: 'Tier 2', 3000: 'Tier 3' };
  const { prime, plan, planName } = method;

  let msg = (prime)
    ? `@EsfandTV - ${username} just subscribed using Prime ${getBestAvailableEmote(["esfandPrime", "PogU", "PagMan", "Pog", "PagChomp"])}`
    : `@EsfandTV - ${username} just subscribed at ${tierList[plan]} ${getBestAvailableEmote(["PogU", "PagMan", "Pog", "PagChomp"])}`;
  client.say(channel, `${msg}`);
}