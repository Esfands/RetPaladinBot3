import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { postToImgur } from "../../utils";
import { CommandInt } from "../../validation/CommandSchema";
let FormData = require("form-data");

const apod: CommandInt = {
  name: "apod",
  aliases: ["astronomypictureoftheday"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Get the Astronomy Picture of the Day.",
  dynamicDescription: [
    "<code>!apod</code>",
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${config.apiKeys.nasa}`);
    const body = await response.data;
    console.log(body["url"]);

    //var data = { image: body["url"], title: body["title"], description: body["explanation"], name: `apod_${body["title"].split(" ").join("_")}`, type: 'png' }

    let formData = new FormData();
    formData.append(`image`, body["url"]);
    formData.append(`title`, body["title"]);
    formData.append(`description`, body["explanation"]);
    formData.append(`name`, `apod_${body["title"].split(" ").join("_")}`);
    formData.append(`type`, 'png')

    let img = await postToImgur(formData);

    //client.action(channel, `@${userstate['display-name']} ${body["title"]}: ${img}`); */
  }
}

export = apod;