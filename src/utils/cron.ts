import { getEmotes } from "./emotes";

// Manages loops for specific commands
var CronJobManager = require("cron-job-manager");
export var JobManager = new CronJobManager();
export var LoopManager = new CronJobManager();

// Get all emotes from BTTV/FFZ/7tv
JobManager.add('getEmotes', '0 1 * * *', async () => { await getEmotes() });
JobManager.startAll();