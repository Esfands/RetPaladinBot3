import { Actions } from "tmi.js";
import { INotify, Notify } from "../schemas/NotifySchema";
import { StreamStat } from "../schemas/StreamStatsSchema";

async function sendPingNotification(client: Actions, channel: string, type: string, toSend: string) {
  Notify.findOne({ type: type }, function (err: Error, res: INotify) {
    var users = res["users"];
    if (users.length) {
      var toPing = splitUsers(users, toSend);
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
    var changed = change.updateDescription.updatedFields;
    var fieldUpdated = Object.keys(changed!);
    var valueUpdated = Object.values(changed!);

    console.log(changed);
    fieldUpdated.forEach((keys, index) => {
       if (keys === "title") {
        // Changed title
        sendPingNotification(client, channel, "title", `[NOTFIYME] EsfandTV has changed title to -> ${valueUpdated[index]}`);
  
      } else if (keys === "status") {
        if (valueUpdated[index] === "live") {
          // Went live
          sendPingNotification(client, channel, "live", `[NOTFIYME] EsfandTV is now live! DinkDonk`);
  
        } else if (valueUpdated[index] === "offline") {
          // Went offline
          sendPingNotification(client, channel, "offline", `[NOTIFYME] EsfandTV is now offline Sadge`);
        }
  
      } else if (keys === "category") {
        // Changed categories
        sendPingNotification(client, channel, "game", `[NOTIFYME] EsfandTV changed categories to -> ${valueUpdated[index]}`);
      } 
    })
  });
}

function splitUsers(userArray: Array<string>, prefixMsg: string) {
  var usersToPing = [];

  for (var i = 0; i < userArray.length; i++) {
    usersToPing.push(userArray[i]);
  }

  usersToPing = usersToPing.map(i => "@" + i);

  // Split the message up a few times if reaches the limit.
  var arrStrings = splitter(usersToPing.join(" "), 400);

  var resArr = [];
  for (var i = 0; i < arrStrings.length; i++) {
    //client.action(channel, `[LIVE PING] ${arrStrings[i]} DinkDonk`)
    arrStrings[i] = `${prefixMsg} ` + arrStrings[i];
    resArr.push(arrStrings[i]);
  }

  return resArr;
}

function splitter(str: string, l: number) {
  var strs = [];
  while (str.length > l) {
    var pos = str.substring(0, l).lastIndexOf(' ');
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    var i = str.indexOf(' ', pos) + 1;
    if (i < pos || i > pos + l)
      i = pos;
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
}