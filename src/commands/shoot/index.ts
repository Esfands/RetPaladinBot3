import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";

const TIMEOUT_LENGTH = 5;
const shoot: CommandInt = {
  name: "shoot",
  aliases: [],
  permissions: [],
  globalCooldown: 15,
  cooldown: 60,
  description: "Timeout a specific user for a short period of time",
  dynamicDescription: [
    `Time out a user for ${TIMEOUT_LENGTH} seconds.`,
    "<code>!shoot (user)</code>"
  ],
  testing: false,
  offlineOnly: true,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    if (!context[0]) return client.action(channel, `@${user} please target a user to shoot.`);

    function timeoutUser(userRan: CommonUserstate, target: any, message: string) {
      if (target.toLowerCase() === userstate["username"]) {
        client.timeout(channel, userstate["username"], TIMEOUT_LENGTH, "!shoot command")
        .then((data) => {
          //return client.action(channel, `${user} shot themselves in the foot!`);
        })
        .catch((err) => {
          if (err === "bad_timeout_mod" || err === "bad_timeout_broadcaster") {
            return client.action(channel, `${user} missed their target!`);
          } else return;
        })
      } 
      client.timeout(channel, target, TIMEOUT_LENGTH, '!shoot command')
        .then((data) => {
          return client.action(channel, message);
        })
        .catch((err) => {
          let errMsg: string = "";
          switch (err) {
            case "bad_timeout_mod":
              errMsg = `${user} that user has body armor GIGACHAD`;
              break;

            case "bad_timeout_broadcaster":
              errMsg = `${user} that user has a show to run esfandW`;
              break;

            case "invalid_user":
              errMsg = `${user} sorry I couldn't find that user.`;
              break;

            default:
              errMsg = `${user} sorry I couldn't find that user.`;
              break;
          }
          return client.action(channel, errMsg);
        });
    }

    let chance = Math.random();
    let result = (chance < 0.3) ? false : true; // false = hurt self, true = shot user
    if (result) {
      timeoutUser(userstate["username"], context[0], `${user} shot ${context[0]} dead! D:`)
    } else {
      timeoutUser(userstate["username"], user, `${user} shot themselves in the foot!`);
    }
  }
}

export = shoot;