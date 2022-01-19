import { fetchAPI } from "../../utils";

export async function getNHLTeams() {
  let res = await fetchAPI("http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams");
  console.log(res["sports"][0]["leagues"][0]["teams"]);
}