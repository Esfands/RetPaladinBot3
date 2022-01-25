import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI } from "../../utils";
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
    const response = await fetchAPI(randomAPI["link"]);
    client.action(channel, `@${userstate["display-name"]} ${response["text"]}`);
  }
}

export = uselessFact;