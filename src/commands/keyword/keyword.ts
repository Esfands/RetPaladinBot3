import { getOTFCommandNames } from "../command/OTFCommands";
import config from "../../cfg/config";
import { findColumn, findOne, findQuery, insertRow, removeOne, updateOne } from "../../utils/maria";
import { IKeyword } from "../../schemas/types";
import { AllKeywords } from "../../events/onChatEvent/onChatEvent";

interface IResponse {
  command: boolean;
  message: string;
}

//=keyword create (con1: title) (con2: regex) (con3: cooldown) (con4: response/otf command)
export async function createKeyword(context: Array<string>) {
  // grab current keywords to make sure the one being created doesn't already exist
  let title = context[1].toLowerCase();
  let joined = context.join(' ');
  let regex;

  const searchTitle = await findOne('keywords', `Title='${title}'`)
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
    let resObj = { command: false, message: "" };
    if (response.startsWith(config.prefix)) {
      if (!otfCommands.includes(response.substring(1))) return `"${response.substring(1)}" is not a valid OTF command.`;
      resObj = { command: true, message: response };
    } else resObj = { command: false, message: response };

    await insertRow(`INSERT INTO keywords (Title, Regex, Cooldown, Disabled, Message) VALUES (?, ?, ?, ?, ?);`, [title, regex, cooldown, "false", response]);
    await initializeKeywords();
    return `successfully created the keyword "${title}"`;
  } else return `sorry, "${context[1]}" already exists.`;
}

export async function getKeywords() {
  let keywordTitles = await findColumn('keywords', 'Title')
  let titleArray: Array<string> = [];
  keywordTitles.forEach((titles: IKeyword) => {
    titleArray.push(titles["Title"]);
  });
  return titleArray.join(", ");
}

export async function getKeywordData(title: string) {
  let searchTitle: IKeyword = await findOne('keywords', `Title='${title}'`);
  if (searchTitle) {
    return `Options for ${title} - "${searchTitle["Message"]}" ${searchTitle["Regex"]} (CD: ${searchTitle["Cooldown"]}secs, disabled: ${searchTitle["Disabled"]})`;
  } else return `couldn't find the keyword "${title}"`;
}

// {prefix}keyword edit (con1: title) (con2: type(regex, cd, message)) (con3: whatever the input is from con2)
export async function editKeyword(title: string, type: string, message: Array<string>) {
  if (!title) return `please specifiy a keyword.`;
  let searchTitle: IKeyword = await findOne('keywords', `Title='${title}'`);
  message.splice(0, 3);

  if (searchTitle) {
    let typeRegex = /(cd|cooldown|regex|response|message)/gi;
    let testType = typeRegex.exec(type);
    if (!testType) return `"${type}" isn't an option, try cooldown/regex/message.`;
    let finType = testType[1];

    if (finType === "cd" || finType === "cooldown") {
      if (Number(message)) {
        let oldCD = searchTitle["Cooldown"];
        await updateOne(`UPDATE otf SET Cooldown='${message.join(" ")}' WHERE Cooldown='${title}';`);
        await initializeKeywords();
        return `changed cooldown from ${oldCD} to ${message.join(" ")}`;
      } else return `can't accept ${message} since it's not a number.`;

    } else if (finType === "regex") {
      await updateOne(`UPDATE otf SET Regex='${message.join(" ")}' WHERE Regex='${title}';`);
      await initializeKeywords();
      return `changed regex of keyword "${title}" successfully!`;

    } else if (finType === "response" || finType === "message") {
      let newMsg = message.join(" ");
      await updateOne(`UPDATE otf SET Message='${newMsg}' WHERE Title='${title}';`);
      await initializeKeywords();
      return `changed "${title}" response to: ${newMsg}`;
    }

  } else return `couldn't find the command "${title}" to edit.`;

}

export async function removeKeyword(title: string) {
  let searchTitle = await findOne('keywords', `Title='${title}'`);
  if (searchTitle) {
    await removeOne('keywords', `Title=?`, [title]);
    await initializeKeywords();
    return `successfuly removed keyword "${title}"`;
  } else return `couldn't find the keyword ${title} to remove`;
}

export async function toggleKeyword(title: string) {
  let searchTitle = await findOne('keywords', `Title='${title}'`);
  let isDisabled = (searchTitle["Disabled"] === "true") ? true : false;
  if (searchTitle) {
    if (isDisabled) {
      // enable
      await updateOne(`UPDATE keywords SET Disabled='false' WHERE Title='${title}';`)
      await initializeKeywords();
      return `enabled keyword "${title}"`;
    } else {
      // disable
      await updateOne(`UPDATE keywords SET Disabled='true' WHERE Title='${title}';`)
      await initializeKeywords();
      return `disabled keyword "${title}"`;
    }
  } else return `couldn't find the keyword ${title} to remove`;
}

// Initialize keywords so it's stored in memory. There's probably a more efficient way to do this but I'm tired
export async function initializeKeywords() {
  let keywords: IKeyword[] = [];
  keywords = await findQuery(`SELECT * FROM keywords`);
  keywords.forEach(keyword => AllKeywords.push(keyword));
}