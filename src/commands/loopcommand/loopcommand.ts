import { Actions } from "tmi.js";
import config from "../../cfg/config";
import { LoopManager } from "../../utils/cron";
import { findOne, insertRow, removeOne, updateOne } from "../../utils/maria";
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

  let conString = context.join(" ");
  let regTest = /"([^"]+)"/.exec(conString);
  if (regTest) {
    let foundPattern = regTest[1];
    let response = conString.substring(conString.lastIndexOf('"') + 2);

    let isCommand;
    if (response.startsWith(config.prefix)) {
      isCommand = { command: true, response: response };
    } else isCommand = { command: false, response: response };

    //let query = await CronJob.findOne({ title: title });
    let query = await findOne('loops', `Title='${title}'`);
    if (!query) {
      await insertRow(`INSERT INTO loops (Title, Pattern, Disabled, Response) VALUES (?, ?, ?, ?);`, [title, foundPattern, 'false', isCommand]);
      let res = (isCommand["command"]) ? await checkIfCommand(isCommand["response"]) : isCommand["response"];
      LoopManager.add(title, foundPattern, async () => { client.action(channel, `${res}`) });
      LoopManager.start(title);
      return `successfuly created "${title}"`
    } else return `loop called "${title}" already exists`;

  } else console.log("No quote found");

}

export async function listLoops() {
  let list = LoopManager.listCrons();
  list = list.replace(/[\{\}]+/g, '');
  let listArr = list.split("\n").filter((n: string) => n);
  let jobs: any[] = [];
  listArr.forEach((job: string) => {
    let splitJob = job.split("'")
    let title = splitJob[1];
    splitJob.splice(0, 2);
    let remaining = splitJob.toString();
    jobs.push(`${title}: ${remaining.substring(remaining.lastIndexOf(":") + 2).toLowerCase()}`);
  })

  return jobs;
}

export async function checkLoop(title: string) {
  let query = await findOne('loops', `Title='${title}'`);
  if (query) {
    let resObj = JSON.parse(query["Response"])
    return `found "${query["Title"]}" - "${query["Pattern"]}" response: ${resObj["response"]}`;
  } else return `couldn't find the loop "${title}"`;
}

export async function toggleLoop(title: string, client: Actions, channel: string) {
  let query = await findOne('loops', `Title='${title}'`);
  if (query) {
    if (query["Disabled"] == 'false') {
      await updateOne(`UPDATE loops SET Disabled='true' WHERE Title='${title}';`);
      if (LoopManager.exists(title)) LoopManager.stop(title);
      return `the loop "${title}" has been disabled`;
    } else {
      await updateOne(`UPDATE loops SET Disabled='false' WHERE Title='${title}';`);
      if (LoopManager.exists(query["Title"])) {
        LoopManager.start(query["Title"]);
      } else {
        let resObj = JSON.parse(query["Response"]);
        LoopManager.add(query["Title"], query["Pattern"], async () => { client.action(channel, `${await checkIfCommand(resObj["Response"])}`); });
        LoopManager.start(query["Title"]);
      }
      return `the loop "${title}" has been enabled`;
    }
  } else return `couldn't find the loop "${title}"`;
}

export async function removeLoop(title: string) {
  let query = await findOne('loops', `Title='${title}'`);
  if (query) {
    await removeOne('loops', `Title='${title}'`);
    LoopManager.deleteJob(title);
    return `removed loop "${title}"`;
  } else return `could not find "${title}" to remove`;
}

export async function updateLoop(context: Array<string>, client: Actions, channel: string) {
  let title = context[1];
  let todo = context[2];
  let query = await findOne('loops', `Title='${title}'`);

  if (query) {
    if (todo === "name") {
      if (todo) {
        await updateOne(`UPDATE loops SET Title='${title}' WHERE Title='${context[0]}'`);
        if (LoopManager.exists(title)) {
          LoopManager.deleteJob(title);
          let resObj = JSON.parse(query);
          LoopManager.add(context[3], query["Pattern"], async () => { client.action(channel, resObj["Response"]); });
          LoopManager.start(context[3]);
        }
        return `changed name to "${context[3]}"`;
      } else return `please provide a name to update with`;

    } else if (todo === "pattern") {
      if (todo) {
        context.splice(0, 3);
        console.log(context.join(" "));
        await updateOne(`UPDATE loops SET Pattern='${context.join(" ")}' WHERE Title='${title}'`);
        if (LoopManager.exists(title)) {
          LoopManager.update(title, context.join(" "));
          return `updated pattern for "${title}"`;
        }
      } else return `please provide a pattern to update with`;

    } else if (todo === "response") {
      if (todo) {
        context.splice(0, 3);
        let resObj = (context.join(" ").startsWith("!")) ? { response: { command: true, response: context.join(" ") } } : { response: { command: false, response: context.join(" ") } };
        await updateOne(`UPDATE loops SET Pattern='${context.join(" ")}' WHERE Title='${title}';`);
        if (LoopManager.exists(title)) {
          LoopManager.update(title, query["Pattern"], async () => { client.action(channel, `${resObj}`); });
          return `updated response for "${title}"`;
        }
      } return `please provide a response`;
    }
  } else return `can't find "${title}" to ${todo}`;

  return;
}
