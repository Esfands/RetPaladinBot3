/* Subathon Stats - https://github.com/Esfands/RetPaladinBot3/issues/9 */

import { CommonUserstate } from "tmi.js";
import config from "../../cfg/config";
import { findOne, insertRow, updateOne } from "../../utils/maria";

export enum SubathonStatType {
  MESSAGE = "MessageCount",
  SUB = "GiftedSubs",
  BITS = "BitsDonated"
}

/**
 * Logs total message count
 * @param user Userstate
 */
export async function subathonLogEvent(user: CommonUserstate, event: SubathonStatType, total: number) {
  if (config.subathonStarted) {
    let search = await findOne('subathonstats', `ID='${user["user-id"]}'`);
    if (search) {
      await updateOne(`UPDATE subathonstats SET ${event}=${event}+${total} WHERE ID='${user['user-id']}';`);
    } else {
      if (event === "MessageCount") {
        await insertRow(`INSERT INTO subathonstats (ID, Username, MessageCount, GiftedSubs, BitsDonated) VALUES (?, ?, ?, ?, ?)`, [user["user-id"], user["display-name"], 1, 0, 0]);
      } else if (event === "GiftedSubs") {
        await insertRow(`INSERT INTO subathonstats (ID, Username, MessageCount, GiftedSubs, BitsDonated) VALUES (?, ?, ?, ?, ?)`, [user["user-id"], user["display-name"], 0, total, 0]);
      } else if (event === "BitsDonated") {
        await insertRow(`INSERT INTO subathonstats (ID, Username, MessageCount, GiftedSubs, BitsDonated) VALUES (?, ?, ?, ?, ?)`, [user["user-id"], user["display-name"], 0, 0, total]);
      }
    }
  }
}

