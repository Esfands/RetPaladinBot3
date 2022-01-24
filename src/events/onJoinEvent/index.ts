import { Actions, CommonUserstate } from "tmi.js";
import { checkIfCommand } from "../../commands/loopcommand/loopcommand";
import { Chatter } from "../../schemas/ChatterSchema";
import { LoopManager } from "../../utils/cron";
import { find, findQuery, insertRow } from "../../utils/maria";
import { checkStreamStatus } from "../../utils/notifications";

export default async (client: Actions, channel: string, username: CommonUserstate, self: boolean) => {
  if (!self) return;

  // Check Twitch livestream data.
  await checkStreamStatus(client, channel);

  // Loop command jobs
  let getJobs: any[] = await findQuery(`SELECT * FROM loops`);
  if (getJobs) {
    getJobs.forEach(async job => {
      if (job["Disabled"] === false) return;
      let resObj = JSON.parse(job["Response"]);
      let res = (resObj["command"]) ? await checkIfCommand(resObj["response"]) : resObj["response"];

      LoopManager.add(job["Title"], job["Pattern"], async () => { client.action(channel, `${res}`) });
      LoopManager.start(job["Title"]);
    })
  }

/*  let chatters = await Chatter.find({});
  console.log(chatters.length);
  chatters.forEach((chatter) => {
    setTimeout(() => {
      let values = [chatter["tid"], chatter["username"], chatter["display_name"], chatter["color"], chatter["retfuel"], chatter["badges"]];
      insertRow(`INSERT INTO chatters (TID, Username, DisplayName, Color, RetFuel, Badges) VALUES (?, ?, ?, ?, ?, ?);`, values)
    }, 2000)
  }); */
}