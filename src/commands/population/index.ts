import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { fetchAPI, capitalizeFirstLetter } from "../../utils/index";

const populationCommand: CommandInt = {
  name: "population",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Check the population of a particular WoW TBC server.",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {

    let server = context[0];
    try {
      let res = await fetchAPI(`https://ironforge.pro/api/server/tbc/${server}`);
      let allData = res["charts"]["all"]["datasets"];
      let factionData: any = { aliance: 0, horde: 0 }

      allData.forEach((faction: any) => {
        if (faction["label"].toLowerCase() === "alliance") {
          factionData["aliance"] = faction["data"].at(-1);
        } else {
          factionData["horde"] = faction["data"].at(-1);          
        }
      });

      let totalPlayers = factionData["aliance"] + factionData["horde"];
      let aliancePerc = ((factionData["aliance"] / totalPlayers) * 100).toFixed(2);
      let horderPerc = ((factionData["horde"] / totalPlayers) * 100 ).toFixed(2);
      client.say(channel, `@${userstate['display-name']} ${capitalizeFirstLetter(server)} population - Aliance: %${aliancePerc}/${factionData["aliance"].toLocaleString()} | Horde %${horderPerc}/${factionData["horde"].toLocaleString()}`);
    } catch (err) {
      console.log(err);
      client.action(channel, `@${userstate["display-name"]} there was an error fetching data for "${capitalizeFirstLetter(server)}"`);
    }
    
  }
}

export = populationCommand;