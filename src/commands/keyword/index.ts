import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";
import { createKeyword, editKeyword, getKeywordData, getKeywords, removeKeyword, toggleKeyword } from "./keyword";
const keyword: CommandInt = {
  name: 'keyword',
  aliases: ["kw"],
  permissions: ["trusted", "moderator"],
  globalCooldown: 10,
  cooldown: 30,
  description: "Keyword detection for chat using RegEx.",
  dynamicDescription: [
    'Create a keyword',
    '<code>!keyword create (title) "(regex)" (cooldown) (response/otf command)</code>',
    "",
    'Delete a keyword',
    '<code>!keyword remove/delete (title)</code>',
    "",
    'Edit a keyword',
    '<code>!keyword edit (title) (type(regex, cd, message)) (RegEx, number, text)</code>',
    "",
    "Check a specific keyword",
    '<code>!keyword check (title)</code>',
    "",
    'List all of the keywords',
    '<code>!keyword list</code>'
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    const command = context[0].toLowerCase();
    const con1 = context[1];
    const con2 = context[2];
    const con3 = context[3];
    const con4 = context[4];

    if (command) {
      //=keyword create (con1: title) (con2: regex) (con3: cooldown) (con4: response/otf command)
      if (command === "create" || command === "add") {
        let createdKeyword = await createKeyword(context);
        client.action(channel, `${user} ${createdKeyword}`);

      } else if (command === "remove" || command === "delete") {
        // =keyword remove/delete (con1: title) 
        let removedKeyword = await removeKeyword(con1);
        client.action(channel, `@${user} ${removedKeyword}`);

      } else if (command === "edit" || command === "update") {
        // =keyword edit (con1: title) (con2: type(regex, cd, message)) (con3: whatever the input is from con2)
        let editedKeyword = await editKeyword(con1, con2, context);
        client.action(channel, `@${user} ${editedKeyword}`);

      } else if (command === "toggle") {
        // =keyword toggle (con1: title)
        let disabledKeyword = await toggleKeyword(context[1]);
        client.action(channel, `@${user} ${disabledKeyword}`);

      } else if (command === "check") {
        // =keyword check (con1: title)
        let foundKeyword = await getKeywordData(context[1]);
        client.action(channel, `@${user} ${foundKeyword}`);

      } else if (command === "list") {
        // =keyword list
        let keywordList = await getKeywords();
        client.action(channel, `@${user} current keywords: ${keywordList}`);

      } else client.action(channel, `@${user} "${command}" was not found try create/add/remove/check/list`);
    } else client.action(channel, `@${user} incorrect syntax: please check retpaladinbot.com/commands/keyword`);
  }
}

export = keyword;