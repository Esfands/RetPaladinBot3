import { fetchAPI } from ".";

enum BaseballCategories {
  mlb,
  college
}

enum FootballCategories {
  nfl,
  college
}

enum HockeyCategories {
  nhl
}

enum BasketballCategories {
  nba,
  college,
  wnba,
  womens_college,
}

interface IFootball {
  nfl: FootballCategories.nfl;
  college: FootballCategories.college
}

interface IBaseball {
  mlb: BaseballCategories.mlb;
  college: BaseballCategories.college
}

interface IHockey {
  nhl: HockeyCategories.nhl;
}

interface IBasketball {
  nba: BasketballCategories.nba;
  college: BasketballCategories.college;
  wnba: BasketballCategories.wnba;
  womens_college: BasketballCategories.womens_college;
}

interface SportOptions {
  football: IFootball;
  baseball: IBaseball;
  hockey: IHockey;
  basketball: IBasketball;
}


export async function espnGetNHLEndpoint(endpoint: string, team: string | null) {
  endpoint = endpoint.toLowerCase();
  let data;

  team = team || null;
  switch (endpoint) {
    case "scoreboard":
      data = await fetchAPI(`http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard`);
      console.log(data);
      break;

    case "news":
      data = await fetchAPI('http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news');
    break;

    case "teams":
      data = await fetchAPI("http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams");
      data = data["sports"][0]["leagues"][0]["teams"];
    break;

    case "team":
      data = await fetchAPI(`http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/${team}`)
    break;

    default:
      data = `Error fetching NHL data`;
    break;
  }

  return data;
}

export function getESPNEndpoint(category: string, endpoint: string) {
  category = category.toLowerCase();

  switch (category) {
    case "nhl":

    break;

    default:
    break;
  }
}