import { Actions, CommonUserstate } from "tmi.js";
import { asyncInsertRow, findOne, findQuery, insertRow } from "../../utils/maria";
import { CommandInt } from "../../validation/CommandSchema";
const feedback: CommandInt = {
  name: "feedback",
  aliases: ["suggest"],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Send feedback or a suggestion for the bot or website.",
  dynamicDescription: [
    "Create feedback.",
    "<code>!feedback ((idea/feature/suggestion)/(bug/error)) (message)</code>",
    "",
    "Check the status of a suggestion.",
    "<code>!feedback (check/status) (ID)"
  ],
  testing: false,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    let prefix = `[Feedback]`
    let user = userstate["display-name"];
    let username = userstate["username"];
    let fbType = context[0];
    let message = context.join(" ").substr(context.join(" ").indexOf(" ") + 1);

    if (fbType) {
      fbType = fbType.toLowerCase();
    } else return client.action(channel, `${prefix} @${user} incorrect syntax: !feedback (feature/bug) (message)`);

    async function saveFeedback(username: CommonUserstate["username"], displayname: CommonUserstate["display-name"], message: string, type: string) {
      let id = await asyncInsertRow(`INSERT INTO suggestions (Username, DisplayName, Message, Type, Status) VALUES (?, ?, ?, ?, ?);`, [username, displayname, message, type, "pending"])
        .then(async (res) => {
          return findQuery(`SELECT ID FROM suggestions WHERE Username='${username}' AND Message='${message}';`);
        });

        let newId: any = await id;
      return `your feedback has been saved with ID: ${newId[0]["ID"]} and will eventually be processed.`;
    }

    async function checkFeedback(id: number) {
      let searched = await findOne('suggestions', `ID=${id}`);
      let response;
      if (searched) {
        response = `ID: ${id} (${searched["Type"]} is ${searched["Status"]}) ${searched["Message"]}`;
      } else {
        response = `could not find a suggestion with the ID ${id}`;
      }
      return response;
    }

    if (fbType) {
      if (fbType === "idea" || fbType === "feature" || fbType === "suggestion") {
        if (message) {
          let savedFeedback = await saveFeedback(username, user, message, "feature");
          client.action(channel, `${prefix} @${user} ${savedFeedback}`);
        } else client.action(channel, `${prefix} @${user} please provide a message to send.`);

      } else if (fbType === "bug" || fbType === "error") {
        if (message) {
          let savedBugFeedback = await saveFeedback(username, user, message, "bug");
          client.action(channel, `${prefix} @${user} ${savedBugFeedback}`);
        } else client.action(channel, `${prefix} @${user} please provide a message to send.`);

      } else if (fbType === "check" || fbType === "status") {
        if (message) {
          let statusRes = await checkFeedback(parseInt(message));
          client.action(channel, `${prefix} @${user} ${statusRes}`);
        } else client.action(channel, `${prefix} @${user} please provide an ID to check.`);
      } else {
        client.action(channel, `${prefix} @${user} incorrect syntax: !feedback (feature/bug) (message)`);
      }
    } else client.action(channel, `${prefix} @${user} incorrect syntax: !feedback (feature/bug) (message)`);
  }
}

export = feedback;