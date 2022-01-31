import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import { ErrorType, logError, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";

const animal: CommandInt = {
  Name: "animal",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a random image of an animal.",
  DynamicDescription: [
    "Get a random animal photo",
    "<code>!animal</code>",
    "",
    "Optional: Add the animal to get a specific animal picture.",
    "<code>!animal (optional: axolotl/duck/fox/cat/dog/zoo)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    console.log();
    const user = userstate["display-name"];

    interface IAnimal {
      name: string;
      link: string;
    }

    const animals: Array<IAnimal> = [
      {name: "axolotl", link: "https://axoltlapi.herokuapp.com/"},
      {name: "duck", link: "https://random-d.uk/api/random"},
      {name: "fox", link: "https://randomfox.ca/floof/"},
      {name: "cat", link: "https://api.thecatapi.com/v1/images/search"},
      {name: "dog", link: "https://dog.ceo/api/breeds/image/random"},
      {name: "zoo", link: "https://zoo-animal-api.herokuapp.com/animals/rand"}
    ];

    let chosenCategory = (context[0]) ? animals.find(animal => animal.name === context[0].toLowerCase()) : animals[Math.floor(Math.random() * animals.length)];
    if (!chosenCategory) return;

    let data: any;
    try {
      let dig = await axios.get(chosenCategory["link"]);
      data = await dig.data;
    } catch (error) {
      await logError(user!, ErrorType.API, `animal command - Error fetching ${chosenCategory["link"]}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    let toSend;
    switch (chosenCategory["name"]) {
      case "axolotl":
        toSend = data["url"];
      break;
      
      case "duck":
        toSend = data["url"];
      break;

      case "fox":
        toSend = data["image"];
      break;

      case "cat":
        toSend = data[0]["url"];
      break;

      case "dog":
        toSend = data["message"];
      break;

      case "zoo":
        toSend = data["image_link"];
      break;

      default:
        toSend = `incorrect syntax: ${context[0]} is not an option, try: axolotl, duck, fox, cat, dog, zoo or leave it blank for a random animal.`;
        break;
      }

    if (toSend.startsWith("incorrect syntax")) {
      client.action(channel, `@${user} ${toSend}`) 
    } else {
      client.action(channel, `@${user} widepeepoHappy 👉 ${await shortenURL(toSend)}`);
    } 
  }
}

export = animal;