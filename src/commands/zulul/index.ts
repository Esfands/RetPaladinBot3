import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";

const zululCommand: CommandInt = {
  Name: "zulul",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Quotes from Who Killed Captain Alex: Uganda's First Action Movie",
  DynamicDescription: [
    "<code>!zulul</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let quotes = [
      "[facing camera]  Then who killed Captain Alex? Who?",
      " Suck my dick.",
      "They walk slow 'cause they think slow.",
      "We love Dolly Parton.",
      "Eeeh mama!",
      "Gwe gwe gwe!",
      "He just want to be alone to focus on vengeance.",
      "Did you best the rat?",
      "He knows da way.",
      "This is how we do action in Uganda.",
      "Expect the unexpectable.",
      "Everybody in Uganda knows Kung Fu!",
      "I've never seen a woman.",
      "He does not listen to bad news.",
      "We call him, Bruce U",
      "The most deadliest gang in Uganda.",
      "He does not need wings to fly.",
      "A master from southern hemisphere, of Uganda.",
      "You are watching WKCA",
      "He's holding a dangerous weapon.",
      "What da fa!",
      "He knows the way of using a gun."
    ];

    return client.action(channel, `${quotes[quotes.length * Math.random() | 0]} ZULUL`);
  }
}

export = zululCommand;