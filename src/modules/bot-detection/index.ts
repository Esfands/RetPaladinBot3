import { Actions, CommonUserstate } from "tmi.js";

/*

  If it's a users first message
    Check for twitch.tv links
    Check for cuttly url
    Check for "buy followers"

  If any of the checks go through then time them out for 30 minutes for "suspicious activity - likely a bot"

*/

export function checkForBot(client: Actions, channel: string, user: CommonUserstate, message: string) {
  if (user["first-msg"]) {
    let bannedPhrases = new RegExp(/(buy followers|cutt+\.ly|twitch+\.tv)/, "gm")
    if (bannedPhrases.test(message)) {
      client.timeout(channel, user["username"], 1800, `suspicious activity - likely a bot.`);
    } else return;
  } else return;
}