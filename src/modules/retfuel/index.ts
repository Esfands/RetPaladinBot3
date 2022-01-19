import { Userstate } from "tmi.js";
import { Chatter } from "../../schemas/ChatterSchema";
import { fetchAPI } from "../../utils";
import { get100Ids, getUserId } from "../../utils/helix";

/*

  = Using Event Sub = 
  Once stream goes online start the 10 min counter
  Once bot gets notified stream went offline then stop the counter all together

  = Giving Points from Rules =
  Using https://tmi.twitch.tv/group/user/esfandtv/chatters we can get all current chatters


*/

const RetfuelRules = {
  minutes: 10,
  points: {
    default: 2,
    subs: 4,
  },
  events: {
    follow: 10,
    bits: {
      100: 10
    },
    sub: 50,
    host: 10
  }
}

export async function fetchChatters() {
  let totalViewers: string[] = [];

  let chattersData = await fetchAPI("https://tmi.twitch.tv/group/user/esfandtv/chatters");
  let chatters = chattersData["chatters"];

  totalViewers.push(...chatters["broadcaster"], ...chatters["vips"], ...chatters["moderators"], ...chatters["staff"], ...chatters["admins"], ...chatters["global_mods"], ...chatters["viewers"]);
  return totalViewers;
}

export async function giveAllChattersRetfuel() {
  let currentChatters = await fetchChatters();

  let testUsers = [
    { name: 'mahcksimus', tid: '237509153' },
  ]

  testUsers.forEach(async (user) => {
    let query = await Chatter.findOne({ tid: user["tid"] });
    if (!query) {
      console.log('not found');
      new Chatter({ 
        tid: user['tid'],
        username: user["name"],
        display_name: user["name"],
        color: '#ffffff',
        retfuel: 2,
        badges: {}
       }).save();
    } else {
      console.log('found');
      // TODO: Find if user is a sub or not with Twitch API, need Esfand's approval
      await Chatter.updateOne({ tid: user["tid"] }, { $inc: { retfuel: 2 } })
    }
  })


  /*  let i, j, temp, chunk = 100;
   for (i = 0, j = currentChatters.length; i < j; i += chunk) {
     temp = currentChatters.slice(i, i + chunk);
     let allIds = await get100Ids(temp);
 
   } */
}

/**
 *  Give a user Retfuel
 * @param user User to give Retfuel to
 * @param amount How much Retfuel to give
 */
export async function giveRetfuel(username: string, amount: number) {
  var query = await Chatter.updateOne({ username: username }, { $inc: { retfuel: amount } });
  if (query) {
    return true;
  } else return false;
}

/**
 *  Take Retfuel from a user
 * @param user User to take Retfuel from
 * @param amount How much Retfuel to take
 */
export async function takeRetfuel(username: string, amount: number) {
  var query = await Chatter.updateOne({ username: username }, { $inc: { retfuel: -amount } });
  if (query) {
    return true;
  } else return false;
}

/**
 *  Set a users Retfuel
 * @param user User to set Retfuel to
 * @param amount How much Retfuel to set them to
 */
 export async function setRetfuel(username: string, amount: number) {
  var query = await Chatter.updateOne({ username: username }, { retfuel: amount });
  if (query) {
    return true;
  } else return false;
}