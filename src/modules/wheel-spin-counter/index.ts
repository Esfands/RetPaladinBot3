import { findQuery, updateOne } from "../../utils/maria";

export async function addSubToSpin(subs: number, gifter: string) {
  let query = await findQuery(`SELECT * FROM wheelspin`);
  let stats = query[0];

  if (gifter.toLowerCase() !== "esfandtv") {
    if (stats.Gifted >= stats.AmountNeeded) {
      let overtime =  stats.Gifted - stats.AmountNeeded;
      await updateOne(`UPDATE wheelspin SET Gifted=${overtime ? overtime : 0}, WheelSpins=${stats.WheelSpins+1}`);
  
    } else {
      await updateOne(`UPDATE wheelspin SET Gifted=${stats.Gifted + subs}`);
    }
  }
}