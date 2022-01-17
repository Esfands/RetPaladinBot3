const { getBestAvailableEmote } = require("../../utils/emotes");
export default async(client: any, channel: any, username: any, months: any, message: any, userstate: any, methods: any) => {

  const tierList: any = { 1000: 'Tier 1', 2000: 'Tier 2', 3000: 'Tier 3' };
  const { prime, plan, planName } = methods;

  let msg = (prime) 
  ? `@EsfandTV - ${username} just resubbed using Prime for ${~~userstate["msg-param-cumulative-months"]} months ${getBestAvailableEmote(["esfandPrime", "PogU", "PagMan", "Pog", "PagChomp"])}` 
  : `@EsfandTV - ${username} just resubbed at ${tierList[plan]} for ${~~userstate["msg-param-cumulative-months"]} months ${getBestAvailableEmote(["PogU", "PagMan", "Pog", "PagChomp"])}`;
  client.say(channel, `${msg}`);
}