import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";

export = {
  name: "numbers",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Bring meaning to your metrics and stories to your dates with interesting number facts.",
  dynamicDescription: [
    "Types: trivia, math, date, year.",
    "<code>!numbers (type) (number)</code>",
    "",
    "Date format: month/day.",
    "<code>!numbers date 2/29</code>"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const type = context[0];
    const numSearch = context[1];

    var typeRegex = /(trivia|math|date|year|random)/gi
    var tested = typeRegex.exec(type);

    if (type) {
      if (tested) {
        if (tested["input"] === "random") {
          if (numSearch === "year" || numSearch === "date") {
          } else client.action(channel, `@${userstate["display-name"]} incorrect syntax: !numbers random (date/year)`);
        }
        var URL = (tested["input"] === "random") ? `http://numbersapi.com/${type}/${numSearch}` : `http://numbersapi.com/${numSearch}/${type}`;
        const response = await axios.get(URL);
        const body = await response.data;
        client.action(channel, `@${userstate["display-name"]} ${body}`);

      } else client.action(channel, `@${userstate["display-name"]} type "${type}" isn't an option. Try: trivia, math, date, year or random.`);
    } else client.action(channel, `@${userstate["display-name"]} incorrect syntax: !numbers (trivia, math, date, year) (number or date(month/day)) `)
  }
}