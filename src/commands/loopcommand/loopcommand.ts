import { Actions } from "tmi.js";
import config from "../../cfg/config";
import { CronJob } from "../../schemas/CronSchema";
import { LoopManager } from "../../utils/cron";
import { getOTFResponse } from "../command/OTFCommands";

/* 
  TODO
  Support OTF commands: Solve this by leaving out ${user} since it's meant to be an announcement
  Make it so it only announces when channel is live.
  
*/

export async function checkIfCommand(response: string) {
  if (response.startsWith(config.prefix)) {
    return await getOTFResponse(response.substring(1), null);
  } else return response
}

// Splits up the title, pattern, time and response
// =loopcmd create (title) "(pattern)" (response)
export async function createLoop(title: string, context: Array<string>, client: Actions, channel: string) {
  context.splice(0, 2);

  var conString = context.join(" ");
  var regTest = /"([^"]+)"/.exec(conString);
  if (regTest) {
    var foundPattern = regTest[1];
    var response = conString.substring(conString.lastIndexOf('"') + 2);

    var isCommand;
    if (response.startsWith(config.prefix)) {
      isCommand = { command: true, response: response };
    } else isCommand = { command: false, response: response };

    var query = await CronJob.findOne({ title: title });
    if (!query) {
      await new CronJob({ title: title, pattern: foundPattern, disabled: false, response: isCommand }).save();
      var res = (isCommand["command"]) ? await checkIfCommand(isCommand["response"]) : isCommand["response"];
      LoopManager.add(title, foundPattern, async () => { client.action(channel, `${res}`) });
      LoopManager.start(title);
      return `successfuly created "${title}"`
    } else return `loop called "${title}" already exists`;

  } else console.log("No quote found");

}

export async function listLoops() {
  var list = LoopManager.listCrons();
  list = list.replace(/[\{\}]+/g, '');
  var listArr = list.split("\n").filter((n: string) => n);
  var jobs: any[] = [];
  listArr.forEach((job: string) => {
    var splitJob = job.split("'")
    var title = splitJob[1];
    splitJob.splice(0, 2);
    var remaining = splitJob.toString();
    jobs.push(`${title}: ${remaining.substring(remaining.lastIndexOf(":") + 2).toLowerCase()}`);
  })

  return jobs;
}

export async function checkLoop(title: string) {
  var query = await CronJob.findOne({ title: title });
  if (query) {
    return `found "${query["title"]}" - "${query["pattern"]}" response: ${query["response"]["response"]}`;
  } else return `couldn't find the loop "${title}"`;
}

export async function toggleLoop(title: string, client: Actions, channel: string) {
  var query = await CronJob.findOne({ title: title });
  if (query) {
    if (query.disabled == false) {
      await CronJob.updateOne({ title: title }, { disabled: true });
      if (LoopManager.exists(title)) LoopManager.stop(title);
      return `the loop "${title}" has been disabled`;
    } else {
      await CronJob.updateOne({ title: title }, { disabled: false });
      if (LoopManager.exists(query["title"])) {
        LoopManager.start(query["title"]);
      } else {
        LoopManager.add(query["title"], query["pattern"], async () => { client.action(channel, `${await checkIfCommand(query!["response"]["response"])}`); });
        LoopManager.start(query["title"]);
      }
      return `the loop "${title}" has been enabled`;
    }
  } else return `couldn't find the loop "${title}"`;
}

export async function removeLoop(title: string) {
  var query = await CronJob.findOne({ title: title });
  if (query) {
    return await CronJob.deleteOne({ title: title }).then(function () {
      if (LoopManager.exists(title)) LoopManager.deleteJob(title);
      return `removed loop "${title}"`;
    }).catch(function (error: Error) {
      return `had an error while trying to delete "${title}"`;
    });
  } else return `could not find "${title}" to remove`;
}

export async function updateLoop(context: Array<string>, client: Actions, channel: string) {
  var title = context[1];
  var todo = context[2];
  var query = await CronJob.findOne({ title: title });

  if (query) {
    if (todo === "name") {
      if (todo) {
        await CronJob.updateOne({ title: title }, { title: context[3] });
        if (LoopManager.exists(title)) {
          LoopManager.deleteJob(title);
          LoopManager.add(context[3], query["pattern"], async () => { client.action(channel, query!["response"]["response"]); });
          LoopManager.start(context[3]);
        }
        return `changed name to "${context[3]}"`;
      } else return `please provide a name to update with`;

    } else if (todo === "pattern") {
      if (todo) {
        context.splice(0, 3);
        console.log(context.join(" "));
        await CronJob.updateOne({ title: title }, { pattern: context.join(" ") });
        if (LoopManager.exists(title)) {
          LoopManager.update(title, context.join(" "));
          return `updated pattern for "${title}"`;
        }
      } else return `please provide a pattern to update with`;

    } else if (todo === "response") {
      if (todo) {
        context.splice(0, 3);
        var resObj = (context.join(" ").startsWith("!")) ? { response: { command: true, response: context.join(" ") } } : { response: { command: false, response: context.join(" ") } };
        await CronJob.updateOne({ title: title }, { response: { command: false, response: resObj } });
        if (LoopManager.exists(title)) {
          LoopManager.update(title, query["pattern"], async () => { client.action(channel, `${resObj}`); });
          return `updated response for "${title}"`;
        }
      } return `please provide a response`;
    }
  } else return `can't find "${title}" to ${todo}`;

  return;
}
