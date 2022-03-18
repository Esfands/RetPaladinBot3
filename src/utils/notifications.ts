import { Actions } from "tmi.js";
import { INotify, Notify } from "../schemas/NotifySchema";
import { StreamStat } from "../schemas/StreamStatsSchema";
import { find, findColumn, findQuery } from "./maria";

async function sendPingNotification(client: Actions, channel: string, type: string, toSend: string) {
  Notify.findOne({ type: type }, function (err: Error, res: INotify) {
    let users = res["users"];
    if (users.length) {
      let toPing = splitUsers(users, toSend);
      toPing.forEach(function (element) {
        client.action(channel, `${element}`);
      })
    }
  });
}

export async function checkStreamStatus(client: Actions, channel: string) {

  const streamStatsEmitter = StreamStat.watch();

  streamStatsEmitter.on('change', change => {
    if (!change.updateDescription) return;
    let changed = change.updateDescription.updatedFields;
    let fieldUpdated = Object.keys(changed!);
    let valueUpdated = Object.values(changed!);

    console.log(changed);
    fieldUpdated.forEach((keys, index) => {
      if (keys === "title") {
        // Changed title
        //sendPingNotification(client, channel, "title", `[NOTIFYME] EsfandTV has changed title to -> ${valueUpdated[index]}`);

      } else if (keys === "status") {
        if (valueUpdated[index] === "live") {
          // Went live
          //sendPingNotification(client, channel, "live", `[NOTIFYME] EsfandTV is now live! DinkDonk`);

        } else if (valueUpdated[index] === "offline") {
          // Went offline
          //sendPingNotification(client, channel, "offline", `[NOTIFYME] EsfandTV is now offline Sadge`);
        }

      } else if (keys === "category") {
        // Changed categories
        let specificUsers: string[] = [];
        findQuery(`SELECT * FROM notifications WHERE Game="${valueUpdated[index].toLowerCase()}";`)
          .then((res: any) => {
            if (res) {
              res.forEach((user: any) => {
                specificUsers.push(user["Username"]);
              });

              if (specificUsers.length !== 0) {
                let toPing = splitUsers(specificUsers, `[NOTIFYME] EsfandTV changed to your category PagChomp 👉 ${valueUpdated[index]}`);
                toPing.forEach(function (element) {
                  client.action(channel, `${element}`);
                });
              }
            }
          });

        //sendPingNotification(client, channel, "game", `[NOTIFYME] EsfandTV changed categories to -> ${valueUpdated[index]}`);
      }
    })
  });
}

function splitUsers(userArray: Array<string>, prefixMsg: string) {
  let usersToPing = [];

  for (let i = 0; i < userArray.length; i++) {
    usersToPing.push(userArray[i]);
  }

  usersToPing = usersToPing.map(i => "@" + i);

  // Split the message up a few times if reaches the limit.
  let arrStrings = splitter(usersToPing.join(" "), 400);

  let resArr = [];
  for (let i = 0; i < arrStrings.length; i++) {
    //client.action(channel, `[LIVE PING] ${arrStrings[i]} DinkDonk`)
    arrStrings[i] = `${prefixMsg} ` + arrStrings[i];
    resArr.push(arrStrings[i]);
  }

  return resArr;
}

function splitter(str: string, l: number) {
  let strs = [];
  while (str.length > l) {
    let pos = str.substring(0, l).lastIndexOf(' ');
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    let i = str.indexOf(' ', pos) + 1;
    if (i < pos || i > pos + l)
      i = pos;
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
}