import { Actions, CommonUserstate } from "tmi.js";
import { checkIfCommand } from "../../commands/loopcommand/loopcommand";
import { CronJob } from "../../schemas/CronSchema";
import { LoopManager } from "../../utils/cron";
import { checkStreamStatus } from "../../utils/notifications";

export default async (client: Actions, channel: string, username: CommonUserstate, self: boolean) => {
  if (!self) return;

  // Check Twitch livestream data.
  await checkStreamStatus(client, channel);

  // Loop command jobs
  var getJobs = await CronJob.find({});
  getJobs.forEach(async job => {
    if (job["disabled"]) return;
    var res = (job["response"]["command"]) ? await checkIfCommand(job["response"]["response"]) : job["response"]["response"];

    LoopManager.add(job["title"], job["pattern"], async () => { client.action(channel, `${res}`) });
    LoopManager.start(job["title"]);
  })
}