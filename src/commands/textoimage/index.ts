import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { shortenURL } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
const textoimage: CommandInt = {
  Name: "texttoimage",
  Aliases: ["tti"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Send the bot text, it'll output a strange image.",
  DynamicDescription: [
    "<code>!textoimage (optional: message)</code>",
    "<code>!tti<code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const message = context.join(" ");
    const user = userstate["display-name"];

    let headers = {
      "Api-Key": config.apiKeys.deep_api,
      "text": message
    }

    const response = await axios({
      method: "POST",
      url: "https://api.deepai.org/api/text2img",
      headers: headers
    });

    client.action(channel, `@${user} monkaLaugh 👍 ${await shortenURL(response.data.output_url)}`);
  }
}

export = textoimage;