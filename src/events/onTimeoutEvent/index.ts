import { insertRow } from "../../utils/maria";

export default async (client: any, channel: any, username: any, reason: any, duration: any, userstate: any) => {
  console.log(`${username} - ${userstate["target-user-id"]} was timed out for ${duration}`);
  let today = new Date();
  let expireDate = new Date(today.setSeconds( today.getSeconds() + duration ));
  await insertRow(`INSERT INTO timeouts (ID, Username, Duration, ExpiresAt) VALUES (?, ?, ?, ?)`, [userstate["target-user-id"], username, duration, expireDate])
}