import axios from "axios";
import { CommonUserstate } from "tmi.js";
import config from "../cfg/config";
import moment from "moment";

export function checkObjectTypes(object: object): string {
  let types: string[] = [];

  Object.entries(object).forEach(entry => {
    const [key, value] = entry;
    types.push(`${key}: ${typeof value};`)
  });

  return types.join("\n");
}

/** Sends a colored console.log
 * 
 * @param {enum} color [black, red, green, yellow, blue, magenta, cyan, white]
 * @param {string} message 
 * @param {enum} options [reset, bright, dim, underscore, blink, reverse, hidden]
 */
import { colors } from "./data";
import { findOne, findAndUpdate, insertRow } from "./maria";
export function colorLog(color: string, message: string, options: string): string {
  let toSend;
  if (!message) toSend = "[WARNING] Please provide a message.";
  let hasOptions = (options in colors) ? colors[options] : "";
  if (color) {
    if (color in colors) {
      toSend = colors[color] + hasOptions + message + colors.reset;
    } else {
      toSend = `[WARNING] Could not find the color "${color}".`;
    }
  } else toSend = '[WARNING] Please provide a color.';
  return toSend;
}

export function calcDate(startDate: Date, endDate: Date, includeSeconds: boolean) {
  var a = moment(startDate);
  var b = moment(endDate);

  var years = a.diff(b, 'year');
  b.add(years, 'years');

  var months = a.diff(b, 'months');
  b.add(months, 'months');

  var days = a.diff(b, 'days');

  let yearStr = (years > 0) ? years + " years " : "";
  let monthStr = (months > 0) ? months + " months " : "";
  let dayStr = (days > 0) ? days + " days" : "";
  return yearStr + monthStr + dayStr;
}

export function secondsToHms(d: number): string {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);
  let hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
  return hDisplay + mDisplay + sDisplay;
}

export function timeDifference(date1: Date, date2: Date, includeSeconds: boolean): string {
  let difference = date1.getTime() - date2.getTime();

  let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24

  let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60

  let minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60

  let secondsDifference = Math.floor(difference / 1000);

  let daysStr = (daysDifference > 0) ? daysDifference + " days " : "";
  let hourStr = (hoursDifference > 0) ? hoursDifference + " hours " : "";
  let minuteStr = (minutesDifference > 0) ? minutesDifference + " mins " : "";
  let secondStr = (secondsDifference > 0) ? secondsDifference + " secs" : "";

  let toReturn = (includeSeconds) ? daysStr + hourStr + minuteStr + secondStr : daysStr + hourStr + minuteStr;
  return toReturn;
}

export function dateDiff(startingDate: Date | string, endingDate: Date | string) {
  let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10));
  if (!endingDate) {
    endingDate = new Date().toISOString().substr(0, 10).toString();    // need date in YYYY-MM-DD format
  }
  let endDate = new Date(endingDate);
  if (startDate > endDate) {
    let swap = startDate;
    startDate = endDate;
    endDate = swap;
  }
  let startYear = startDate.getFullYear();
  let february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
  let daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }

  let yearStr = (yearDiff > 0) ? yearDiff + " years " : "";
  let monthStr = (monthDiff > 0) ? monthDiff + " months " : "";
  let dayStr = (dayDiff > 0) ? dayDiff + " days" : "";

  return yearStr + monthStr + dayStr;
}

export function addStr(str: string, index: number, stringToAdd: string) {
  return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

/** 
 * Adds count to the command used in the database.
 * @param {string} type ["otf" or "command"]
 * @param {string} command Name of the command
 */
export function commandUsed(type: string, command: string) {
  if (type === "command") {
    findAndUpdate(`SELECT * FROM commands WHERE Name='${command}'`, `UPDATE commands SET Count=Count+1 WHERE Name='${command}';`);
  } else if (type === "otf") {
    findAndUpdate(`SELECT * FROM otf WHERE Name='${command}'`, `UPDATE otf SET Count=Count+1 WHERE Name='${command}';`);
  }
}

/**
 * Creates a shortned URL
 * @param {string} url
 * @returns {string | null} null if error
 */
export async function shortenURL(url: string) {
  try {
    let request = await axios({
      url: "https://shrtlnk.dev/api/v2/link",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Api-Key": config.apiKeys.shrtlnk
      },
      data: {
        url: url
      }
    });
    return await request.data["shrtlnk"];
  } catch (error) {
    return null;
  }
}

/**
 * Post FormData to Imgur
 * @param {FormData} data 
 * @returns {string} Imgur link
 */
let FormData = require("form-data");
export async function postToImgur(data: FormData) {
  let myData = new FormData();
  myData.append("image", data);

  let authConfig = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${config.apiKeys.imgur}`
    }
  }

  let response = await axios.post("https://api.imgur.com/3/image", myData, authConfig);
  let res = await response.data;
  let link = res["data"]["link"];
  link = link.substring(0, link.lastIndexOf("."))

  return link;
}

/** Fetch data from a URL
 * 
 * @param url API link to search
 * @returns API response or error
 */
export async function fetchAPI(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.warn(error)
    return error;
  }
}

export async function checkMessageBanPhrase(message: string) {
  const request = await axios({
    method: 'POST',
    url: `https://cyrbot.com/api/v1/banphrases/test/`,
    headers: { 'Content-Type': 'application/json' },
    data: { message: message }
  });

  return await request.data.banned;
}

/** Transforms a string into a different font.
 * 
 * @param message message to transform
 * @param font font choice from data.ts
 * @returns string of the new message
 */
export function applyFont(message: string, font: any) {
  return message.split("").map(function (c) {
    if (typeof font[c] === "undefined") font[c] = " ";
    return font[c];
  }).join('');
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function updateOrCreateChatter(userstate: CommonUserstate) {
  let query = await findOne('chatters', `TID='${userstate["user-id"]}'`);
  if (!query) {
    let values = [userstate["user-id"], userstate["username"], userstate["display-name"], userstate["color"], 2, userstate["badges"]];
    await insertRow(`INSERT INTO chatters (TID, Username, DisplayName, Color, RetFuel, Badges) VALUES (?, ?, ?, ?, ?, ?);`, values);
  }
}

// minutes to hours and mins
export function minsToHours(n: number) {
  let num = n;
  let hours = (num / 60);
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  return rhours + " hours and " + rminutes + " minutes";
}