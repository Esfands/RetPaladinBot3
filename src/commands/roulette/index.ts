import { Actions, CommonUserstate } from "tmi.js";
import { giveRetfuel, takeRetfuel } from "../../modules/retfuel";
import { getBestAvailableEmote } from "../../utils/emotes";
import { findOne } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const rouletteCommand: CommandInt = {
  name: "roulette",
  aliases: ["gamble"],
  permissions: [],
  globalCooldown: 5,
  cooldown: 60,
  description: "Gamble your RetFuel away.",
  dynamicDescription: [
    "<code>!roulette (amount)</code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let res = (Math.random() < 0.5) ? true : false;
    let bet = Number(context[0]) ? parseInt(context[0]) : context[0];
    let user = userstate["display-name"];

    async function gamble(amount: number, allIn: boolean) {
      if (res) {
        // Win
        await giveRetfuel(userstate["username"], amount * 2);
        if (allIn) return client.action(channel, `@${user} went all in and won ${amount * 2}!`);
        client.action(channel, `@${user} won ${amount * 2} RetFuel in roulette!`);
      } else {
        // Loss
        await takeRetfuel(userstate["username"], amount);
        if (allIn) return client.action(channel, `@${user} went all in and lost all their ${amount} RetFuel!`);
        client.action(channel, `@${user} lost ${amount} RetFuel in roulette!`);
      }
    }

    let query = await findOne('chatters', `Username='${userstate['username']}'`);
    if (query) {
      if (typeof bet == "number") {
        if (bet < 0) return client.action(channel, `@${user} you can't bet anything below 0.`);
        if (query["retfuel"] < bet) return client.action(channel, `@${user} you only have ${query["retfuel"]} RetFuel. ${getBestAvailableEmote(["Sadge", "PepeHands", "Sadeg", "NOOO"])}`);

        await gamble(bet, false);
      } else if (typeof bet == "string") {
        if (bet === "all") {
          // Gambled all
          if (query["retfuel"] <= 0) return client.action(channel, `@${user} you don't have any RetFuel to gamble. ${getBestAvailableEmote(["Sadge", "PepeHands", "Sadeg", "NOOO"])}`);
          await gamble(query["retfuel"], true);
        } else return client.action(channel, `@${user} incorrect syntax: !gamble (amount | all)`);
      }
    } else return client.action(channel, `@${user} there was an issue finding you Hmm`);
  }
}

export = rouletteCommand;