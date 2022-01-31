import { Actions, CommonUserstate } from "tmi.js";
import { fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const quoteCommand: CommandInt = {
  Name: "uquote",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 5,
  Cooldown: 30,
  Description: "Fetch a random quote.",
  DynamicDescription: [
    "Fetch a random quote",
    "<code>!quote</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const quoteAPIs = [
      { name: "kanye", link: 'https://api.kanye.rest/' },
      { name: "affirmations", link: "https://www.affirmations.dev/" },
      { name: "quotegarden", link: "https://quote-garden.herokuapp.com/api/v3/quotes/random" },
      { name: "anime", link: "https://animechan.vercel.app/api/random" }
    ];

    let randomAPI = quoteAPIs[Math.floor(Math.random() * quoteAPIs.length)];

    // TO add: "get in the robot bobby, or peggy will have to do it again" 
    if (randomAPI["name"] === 'kanye') {
      let req = await fetchAPI(randomAPI["link"]);
      return client.action(channel, `${req.quote} - Kanye West`);
      
    } else if (randomAPI["name"] === "affirmations") {
      let req = await fetchAPI(randomAPI["link"]);
      return client.action(channel, `${req["affirmation"]}`);

    } else if (randomAPI["name"] === "quotegarden") {
      let req = await fetchAPI(randomAPI["link"]);
      return client.action(channel, `${req["data"][0]["quoteText"]} - ${req["data"][0]["quoteAuthor"]}`);

    } else if (randomAPI["name"] === "anime") {
      let req = await fetchAPI(randomAPI["link"]);
      return client.action(channel, `${req["quote"]} - ${req["character"]} (${req["anime"]})`);
    }
  }
}

export = quoteCommand;