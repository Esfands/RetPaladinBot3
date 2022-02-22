import { Actions, Userstate } from "tmi.js";
import { addSubToSpin } from "../../modules/wheel-spin-counter";
import { getBestAvailableEmote } from "../../utils/emotes";

export default async (client: Actions, channel: string, username: Userstate["username"], userstate: Userstate) => {
    client.say(channel, `@EsfandTV - ${username} is continuing the gift sub they got from an anonymous gifter ${getBestAvailableEmote(["PogU", "PagMan", "Pog", "PogChamp"])}`);
    await addSubToSpin(1, username["username"]);
}