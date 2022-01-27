import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/CommandSchema";

const slotsCommand: CommandInt = {
  name: "slots",
  aliases: [],
  permissions: [],
  globalCooldown: 10,
  cooldown: 30,
  description: "Slots to roll for RetFuel",
  dynamicDescription: [
    "<code></code>"
  ],
  testing: true,
  offlineOnly: false,
  code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const slotIcons = ["🍒", "🍓", "🍋", "🍊", "🍇", "🍉", "7️⃣"]
  }
}

export = slotsCommand;