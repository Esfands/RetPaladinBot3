import { Actions, CommonUserstate } from "tmi.js";
import { Feedback } from "../../schemas/FeedbackSchema";
export = {
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
    var prefix = `[Feedback]`
    var user = userstate["display-name"];
    var username = userstate["username"];
    var fbType = context[0];
    var message = context.join(" ").substr(context.join(" ").indexOf(" ") + 1);

    if (fbType) {
      fbType = fbType.toLowerCase();
    } else return client.action(channel, `${prefix} @${user} incorrect syntax: !feedback (feature/bug) (message)`);

    async function saveFeedback(username: CommonUserstate["username"], displayname: CommonUserstate["display-name"], message: string, type: string) {
      var suggestions = await Feedback.find({});
      new Feedback({ username: username, "display-name": displayname, message: message, fid: suggestions.length, type: type, status: "pending" }).save();
      return `your feedback has been saved with ID: ${suggestions.length} and will eventually be processed.`;
    }

    async function checkFeedback(id: number) {
      var searched = await Feedback.findOne({ fid: id });
      var response;
      if (searched) {
        response = `ID: ${id} (${searched["type"]}) is ${searched["status"]}: ${searched["message"]}`;
      } else {
        response = `could not find a suggestion with the ID ${id}`;
      }
      return response;
    }

    if (fbType) {
      if (fbType === "idea" || fbType === "feature" || fbType === "suggestion") {
        if (message) {
          var savedFeedback = await saveFeedback(username, user, message, "feature");
          client.action(channel, `${prefix} @${user} ${savedFeedback}`);
        } else client.action(channel, `${prefix} @${user} please provide a message to send.`);

      } else if (fbType === "bug" || fbType === "error") {
        if (message) {
          var savedBugFeedback = await saveFeedback(username, user, message, "bug");
          client.action(channel, `${prefix} @${user} ${savedBugFeedback}`);
        } else client.action(channel, `${prefix} @${user} please provide a message to send.`);

      } else if (fbType === "check" || fbType === "status") {
        if (message) {
          var statusRes = await checkFeedback(parseInt(message));
          client.action(channel, `${prefix} @${user} ${statusRes}`);
        } else client.action(channel, `${prefix} @${user} please provide an ID to check.`);
      } else {
        client.action(channel, `${prefix} @${user} incorrect syntax: !feedback (feature/bug) (message)`);
      }
    } else client.action(channel, `${prefix} @${user} incorrect syntax: !feedback (feature/bug) (message)`);
  }
}