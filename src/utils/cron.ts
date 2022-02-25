import { storeAllEmotes } from "../modules/emote-listener";
import { getEmotes } from "./emotes";

// Manages loops for specific commands
let CronJobManager = require("cron-job-manager");
export let JobManager = new CronJobManager();
export let LoopManager = new CronJobManager();

// Get all emotes from BTTV/FFZ/7tv
JobManager.add('getEmotes', '0 1 * * *', async () => { await getEmotes() });
JobManager.add('storeAllEmotes', '0 */2 * * *', async () => { await storeAllEmotes("esfandtv", 38746172) });
JobManager.startAll();