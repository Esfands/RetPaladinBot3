import { Actions, CommonUserstate } from "tmi.js";
import { getTarget } from "../../utils";
import { getTags } from "../../utils/helix";
import { CommandInt } from "../../validation/CommandSchema";

const tagsCommand: CommandInt = {
  Name: "tags",
  Aliases: ["streamtags"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get the current tags for the stream.",
  DynamicDescription: [
    "<code>!tags</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: Array<string>) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[0]);

    let tags = await getTags();
    let tagData = tags.data;
    let currentTags: string[] = [];
    tagData.forEach((tag: any) => {
      let names = tag.localization_names;
      currentTags.push(names["en-us"]);
    });

    client.action(channel, `@${target} current stream tags: ${currentTags.join(", ")}`);
  }
}

export = tagsCommand;