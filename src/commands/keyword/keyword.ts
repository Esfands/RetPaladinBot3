import {CommonUserstate } from "tmi.js";

import { commandUsed } from "../../utils";
import { keyWordCooldown } from "../../utils/cooldowns";
import { IKeyword, Keyword } from "../../schemas/KeywordSchema";
import { getOTFCommandNames, getOTFResponse } from "../command/OTFCommands";
import config from "../../cfg/config";
import { otfResponseEmote } from "../../utils/emotes";

interface IResponse {
  command: boolean;
  message: string;
}

export let AllKeywords: Array<IKeyword> = [];

//=keyword create (con1: title) (con2: regex) (con3: cooldown) (con4: response/otf command)
export async function createKeyword(context: Array<string>) {
  // grab current keywords to make sure the one being created doesn't already exist
  let title = context[1].toLowerCase();
  let joined = context.join(' ');
  let regex;

  const searchTitle = await Keyword.findOne({ title: title });
  if (!searchTitle) {
    // Find the regex between ""
    let findRegex = /"([^"]+)"/;
    let foundString = findRegex.exec(joined);
    if (foundString) {
      regex = foundString[1];
    } else return `couldn't find the regular expression`;

    // Find cooldown after the last quote
    let restOf = joined.substring(joined.lastIndexOf('"') + 2);
    let cooldown = restOf.split(" ")[0];

    // Get the response. If it starts with prefix then it's an OTF response
    let response = restOf.substr(cooldown.length + 1);

    // Check if it's a command or not.
    let otfCommands = await getOTFCommandNames()
    let resObj: IResponse = { command: false, message: "" };
    if (response.startsWith(config.prefix)) {
      if (!otfCommands.includes(response.substring(1))) return `"${response.substring(1)}" is not a valid OTF command.`;
      resObj = { command: true, message: response };
    } else resObj = { command: false, message: response };

    new Keyword({ title: title, regex: regex, cooldown: cooldown, disabled: false, response: resObj }).save();
    await initializeKeywords();
    return `successfully created the keyword "${title}"`;
  } else return `sorry, "${context[1]}" already exists.`;
}

export async function getKeywords() {
  let keywordTitles = await Keyword.find({}).select({ title: 1, _id: 0 });
  let titleArray: Array<string> = [];
  keywordTitles.forEach(titles => {
    titleArray.push(titles.title);
  });
  return titleArray.join(", ");
}

export async function getKeywordData(title: string) {
  let searchTitle = await Keyword.findOne({ title: title });
  if (searchTitle) {
    return `Options for ${title} - "${searchTitle["response"]["message"]}" ${searchTitle["regex"]} (CD: ${searchTitle["cooldown"]}secs, disabled: ${searchTitle["disabled"]})`
  } else return `couldn't find the keyword "${title}"`;
}

// {prefix}keyword edit (con1: title) (con2: type(regex, cd, message)) (con3: whatever the input is from con2)
export async function editKeyword(title: string, type: string, message: Array<string>) {
  if (!title) return `please specifiy a keyword.`;
  let searchTitle = await Keyword.findOne({ title: title });
  message.splice(0, 3);

  if (searchTitle) {
    let typeRegex = /(cd|cooldown|regex|response|message)/gi;
    let testType = typeRegex.exec(type);
    if (!testType) return `"${type}" isn't an option, try cooldown/regex/message.`;
    let finType = testType[1];

    if (finType === "cd" || finType === "cooldown") {
      if (Number(message)) {
        let oldCD = searchTitle["cooldown"];
        await Keyword.updateOne({ title: title }, { cooldown: message.join(" ") });
        await initializeKeywords();
        return `changed cooldown from ${oldCD} to ${message.join(" ")}`;
      } else return `can't accept ${message} since it's not a number.`;

    } else if (finType === "regex") {
      await Keyword.updateOne({ title: title }, { regex: message.toString() });
      await initializeKeywords();
      return `changed regex of keyword "${title}" successfully!`;

    } else if (finType === "response" || finType === "message") {
      let newMsg = message.join(" ");
      let isCommand = (newMsg.startsWith(config.prefix)) ? { command: true, message: newMsg } : { command: false, message: newMsg };
      await Keyword.updateOne({ title: title }, { response: isCommand })
      await initializeKeywords();
      return `changed "${title}" response to: ${newMsg}`;
    }

  } else return `couldn't find the command "${title}" to edit.`;

}

export async function removeKeyword(title: string) {
  let searchTitle = await Keyword.findOne({ title: title });
  if (searchTitle) {
    await Keyword.findOneAndRemove({ title: title });
    await initializeKeywords();
    return `successfuly removed keyword "${title}"`;
  } else return `couldn't find the keyword ${title} to remove`;
}

export async function toggleKeyword(title: string) {
  let searchTitle = await Keyword.findOne({ title: title }).select({ disabled: 1, _id: 0 });
  if (searchTitle) {
    if (searchTitle["disabled"]) {
      // enable
      await Keyword.updateOne({ title: title }, { disabled: false });
      await initializeKeywords();
      return `enabled keyword "${title}"`;
    } else {
      // disable
      await Keyword.updateOne({ title: title }, { disabled: true });
      await initializeKeywords();
      return `disabled keyword "${title}"`;
    }
  } else return `couldn't find the keyword ${title} to remove`;
}

// Initialize keywords so it's stored in memory. There's probably a more efficient way to do this but I'm tired
export async function initializeKeywords() {
  let keywords: Array<IKeyword> = await Keyword.find({});
  keywords.forEach(keyword => AllKeywords.push(keyword));
}

// Checks message for each regex.
export async function checkMessageForRegex(message: string, user: CommonUserstate["display-name"] | string) {
  if (AllKeywords.length === 0) await initializeKeywords();
  let toRes = { run: false, message: { command: false, response: "" } };

  for (let i = 0; i < AllKeywords.length; i++) {
    let parts = AllKeywords[i]["regex"].split("/");
    let replaceDoubleSlash = parts[1].replace('\\\\', '\\');
    let regex = new RegExp(replaceDoubleSlash, parts[2]);
    if (regex.test(message)) {
      if (AllKeywords[i]["disabled"]) return toRes = { run: false, message: { command: false, response: "" } };
      if (!keyWordCooldown(AllKeywords[i]["title"], AllKeywords[i]["cooldown"])) return toRes = { run: false, message: { command: false, response: "" } };
      toRes = { run: true, message: { command: AllKeywords[i]["response"]["command"], response: AllKeywords[i]["response"]["message"] } };
    }
  }

  if (toRes.run === true) {
    user = (user?.startsWith("@")) ? user : `@${user}`;
    if (toRes.message.command) {
      let otfRes = await getOTFResponse(toRes.message.response.substring(1), user);
      commandUsed('otf', toRes.message.response.substring(1));
      toRes = { run: true, message: { command: true, response: otfRes! } };
      return toRes;
    } else {
      let newResponse = otfResponseEmote(toRes.message.response, user);
      toRes = { run: true, message: { command: false, response: newResponse } };
      return toRes;
    }
  }

}