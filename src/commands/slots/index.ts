import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";

function hasConsecutive(arr: any[], amount: number) {
  var last = null;
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] != last) {
      last = arr[i];
      count = 0;
    }
    count += 1;
    if (amount <= count) {
      return true;
    }
  }
  return false;
}

const slotsCommand: CommandInt = {
  Name: "slots",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Slots to roll for RetFuel",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: true,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const slotIcons = ["🍒", "🍓", "🍋", "🍊", "🍇", "🍉"];
    let selected: string[] = [];

    function slots() {
      let randomEmoji = slotIcons[Math.floor(Math.random() * slotIcons.length)];
      selected.push(randomEmoji);
    }

    for (var i = 0; i < 4; i++) {
      slots();
    }

    console.log(hasConsecutive(selected, 3));
    client.say(channel, `${selected.join(" | ")}`);
  }
}

export = slotsCommand;