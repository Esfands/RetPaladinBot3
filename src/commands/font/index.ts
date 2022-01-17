import { Actions, CommonUserstate } from "tmi.js";
import { applyFont } from "../../utils";
import { bold, fancy, fancyBold, outline } from "../../utils/data";
import { CommandInt } from "../../validation/CommandSchema";
const font: CommandInt = {
  name: "font",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Change the font of any text.",
  dynamicDescription: [
    "Cahnge the font of a message.",
    "<code>!font (fancy, fancybold, outline) (message)</code>",
    "",
    "= Fonts =",
    "fancy",
    "𝔱𝔥𝔢 𝔮𝔲𝔦𝔠𝔨 𝔟𝔯𝔬𝔴𝔫 𝔣𝔬𝔵 𝔧𝔲𝔪𝔭𝔰 𝔬𝔳𝔢𝔯 𝔱𝔥𝔢 𝔩𝔞𝔷𝔶 𝔡𝔬𝔤",
    "",
    "fancybold",
    "𝖙𝖍𝖊 𝖖𝖚𝖎𝖈𝖐 𝖇𝖗𝖔𝖜𝖓 𝖋𝖔𝖝 𝖏𝖚𝖒𝖕𝖘 𝖔𝖛𝖊𝖗 𝖙𝖍𝖊 𝖑𝖆𝖟𝖞 𝖉𝖔𝖌",
    "",
    "outline",
    "𝕥𝕙𝕖 𝕢𝕦𝕚𝕔𝕜 𝕓𝕣𝕠𝕨𝕟 𝕗𝕠𝕩 𝕚𝕦𝕞𝕡𝕤 𝕠𝕧𝕖𝕣 𝕥𝕙𝕖 𝕝𝕒𝕫𝕪 𝕕𝕠𝕘",
    "",
    "bold",
    "𝘁𝗵𝗲 𝗾𝘂𝗶𝗰𝗸 𝗯𝗿𝗼𝘄𝗻 𝗳𝗼𝘅 𝗷𝘂𝗺𝗽𝘀 𝗼𝘃𝗲𝗿 𝘁𝗵𝗲 𝗹𝗮𝘇𝘆 𝗱𝗼𝗴"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let askedFont = context[0].toLowerCase();

    function getTranslated() {
      context.shift();
      let message = context.join(" ").toLowerCase();
      return message;
    }

    if (askedFont === "fancy") {
      client.say(channel, `${applyFont(getTranslated(), fancy)}`);

    } else if (askedFont === "bold") {
      client.say(channel, `${applyFont(getTranslated(), bold)}`)

    } else if (askedFont === "fancybold") {
      client.say(channel, `${applyFont(getTranslated(), fancyBold)}`);

    } else if (askedFont === "outline") {
      client.say(channel, `${applyFont(getTranslated(), outline)}`);

    } else client.say(channel, `@${userstate["display-name"]} incorrect syntax: !font (fancy, fancybold, outline, bold) (message)`);
  }
}

export = font;