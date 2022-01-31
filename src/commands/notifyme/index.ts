import { Actions, CommonUserstate } from "tmi.js";
import { Notify } from "../../schemas/NotifySchema";
import { CommandInt } from "../../validation/CommandSchema";
const notifyme: CommandInt = {
  Name: "notifyme",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get tagged in chat when the channel goes live, title, or changes game.",
  DynamicDescription: [
    "Optin to recieve a going live notification in chat.",
    "<code>!notifyme live</code>",
    "",
    "Optin to recieve a title change notification in chat.",
    "<code>!notifyme title</code>",
    "",
    "Optin to recieve when Esfand changes game.",
    "<code>!notifyme game</code>",
    "",
    "To opt out of any of the notifcations, do the same command again to toggle it off."
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let user = userstate["display-name"];
    let username = userstate["username"];
    let option = context[0]

    if (option) {
      if (option === "live") {
        Notify.findOne({ type: "live" }, function (err: Error, res: any) {
          let typeId = res["_id"].toString();

          if (res["users"].includes(username)) {
            // Remove from the array.
            Notify.updateOne({ _id: typeId }, { $pull: { users: username } },
              function (err: Error, res: any) {
                if (err) {
                  client.action(channel, `${user} there was an issue removing you from the go live notification.`)
                } else {
                  client.action(channel, `${user} you have opted out of being notified when Esfand goes live Okayge`);
                }
              });
          } else {
            // Add to array
            Notify.updateOne({ _id: typeId }, { $push: { users: username } },
              function (err: Error, res: any) {
                if (err) {
                  client.action(channel, `${user} there was an issue signing you up for the go live notification.`)
                } else {
                  client.action(channel, `${user} you'll be notified when Esfand goes live Okayge`);
                }
              });
          }
        });
      } else if (option === "game") {
        Notify.findOne({ type: "game" }, function (err: Error, res: any) {
          let typeId = res["_id"].toString();

          if (res["users"].includes(username)) {
            // Remove from the array.
            Notify.updateOne({ _id: typeId }, { $pull: { users: username } },
              function (err: Error, res: any) {
                if (err) {
                  console.log(err);
                  client.action(channel, `${user} there was an issue removing you from the go change game notification.`)
                } else {
                  client.action(channel, `${user} you have opted out of being notified when Esfand changes games Okayge`);
                }
              });
          } else {
            // Add to array
            Notify.updateOne({ _id: typeId }, { $push: { users: username } },
              function (err: Error, res: any) {
                if (err) {
                  client.action(channel, `${user} there was an issue signing you up for the change game notification.`)
                } else {
                  client.action(channel, `${user} you'll be notified when Esfand changes games Okayge`);
                }
              });
          }
        });
      } else if (option === "title") {
        Notify.findOne({ type: "title" }, function (err: Error, res: any) {
          let typeId = res["_id"].toString();

          if (res["users"].includes(username)) {
            // Remove from the array.
            Notify.updateOne({ _id: typeId }, { $pull: { users: username } },
              function (err: Error, res: any) {
                if (err) {
                  client.action(channel, `${user} there was an issue removing you from the go change title notification.`)
                } else {
                  client.action(channel, `${user} you have opted out of being notified when Esfand changes titles Okayge`);
                }
              });
          } else {
            // Add to array
            Notify.updateOne({ _id: typeId }, { $push: { users: username } },
              function (err: Error, res: any) {
                if (err) {
                  client.action(channel, `${user} there was an issue signing you up for the change title notification.`)
                } else {
                  client.action(channel, `${user} you'll be notified when Esfand changes title Okayge`);
                }
              });
          }
        });

      } else client.action(channel, `@${user} please use: !notifyme (live/game/title)`);
    } else {
      client.action(channel, `@${user} please use: !notifyme (live/game/title)`);
    }
  }
}

export = notifyme;