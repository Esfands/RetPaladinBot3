import { getBestAvailableEmote } from "../../utils/emotes";

export default async (client: any, channel: any, username: any, sender: any, userstate: any) => {
    client.say(channel, `@EsfandTV - ${username} is continuing the gift sub they got from ${sender} ${getBestAvailableEmote(["PogU", "PagMan", "Pog", "PogChamp"])}`);
}