import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, fetchAPI, logError } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const uselessFact: CommandInt = {
  name: "uselessfact",
  aliases: ["ufact"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "A fact. Useless but a fact.",
  dynamicDescription: [
    "<code>!uselessfact</code>",
    "<code>!ufact</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const APIs = [{ name: "uselessfacts", link: "https://uselessfacts.jsph.pl/random.json?language=en" }, { name: "funfact", link: "https://ffa.aakhilv.me/json" }];
    
    let randomAPI = APIs[Math.floor(Math.random()*APIs.length)];

    let response;
    try {
      response = await fetchAPI(randomAPI["link"]);
    } catch (error) {
      await logError(userstate['display-name']!, ErrorType.API, `Error fetching API for !uselessfact - ${randomAPI["link"]}`, new Date());
      return client.action(channel, `@${userstate['display-name']} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    client.action(channel, `@${userstate["display-name"]} ${response["text"]}`);
  }
}

export = uselessFact;