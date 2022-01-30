import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { fetchAPI, capitalizeFirstLetter, logError, ErrorType } from "../../utils/index";

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
      let res;
      
      try {
        res = await fetchAPI(`https://ironforge.pro/api/server/tbc/${server}`);
      } catch (error) {
        await logError(userstate["display-name"]!, ErrorType.API, `Error fetching API for !population - https://ironforge.pro/api/server/tbc/${server}`, new Date());
        return client.action(channel, `${userstate['display-name']} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
      }

      let allData = res["charts"]["all"]["datasets"];
      let factionData: any = { aliance: 0, horde: 0 }

      allData.forEach((faction: any) => {
        let fData: any[] = faction["data"];
        if (faction["label"].toLowerCase() === "alliance") {
          factionData["aliance"] = fData.pop();
        } else {
          factionData["horde"] = fData.pop();          
        }
      });

      let totalPlayers = factionData["aliance"] + factionData["horde"];
      let aliancePerc = ((factionData["aliance"] / totalPlayers) * 100).toFixed(2);
      let horderPerc = ((factionData["horde"] / totalPlayers) * 100 ).toFixed(2);
      client.say(channel, `@${userstate['display-name']} ${capitalizeFirstLetter(server)} population - Aliance: %${aliancePerc}/${factionData["aliance"].toLocaleString()} | Horde %${horderPerc}/${factionData["horde"].toLocaleString()}`);
    } catch (err) {
      console.log(err);
      client.say(channel, `@${userstate["display-name"]} there was an error fetching data for "${capitalizeFirstLetter(server)}"`);
    }
    
  }
}

export = populationCommand;