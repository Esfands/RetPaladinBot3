import { CommonUserstate } from "tmi.js";
import { OTFCommand, IOTFCommand } from "../../schemas/OTFSchema";
import { otfResponseEmote } from "../../utils/emotes";

export async function createOTFCommand(name: string, response: string, creator: string | null) {
  new OTFCommand({ name: name, response: response, creator: creator, count: 0, history: [{ "created": { name: creator, message: "Created the command", date: new Date() } }] }).save();
}

export async function getOTFCleanResponse(name: string) {
  let found = await OTFCommand.findOne({ name: name }).select({ "response": 1, "_id": 0});
  if (found) {
    return found.response;
  } else return null;
}

export async function removeOTFCommand(name: string) {
  let searchCmd = await OTFCommand.findOne({ name: name });
  if (searchCmd) {
    await OTFCommand.findOneAndRemove({ name: name });
    return `successfuly removed keyword "${name}"`;
  } else return `couldn't find the keyword "${name}" to remove`;
}

export async function editOTFCommand(cmd: string, message: string, editor: CommonUserstate["username"]) {
  let cmdData = await OTFCommand.findOne({ name: cmd });
  let cmdId = cmdData?._id.toString();
  OTFCommand.updateOne(
    { _id: cmdId },
    { response: message, $push: { history: { "edit": { name: editor, message: message, date: new Date() } } } },
    function(error: Error, success: string) {
      if (error) {
        console.warn(error);
      } else {
        console.log("Updated");
      }
    }
  )
}

export async function editOTFCommandName(oldName: string, newName: string, editor: CommonUserstate["username"]) {
  let cmdData = await OTFCommand.findOne({ name: oldName });
  let cmdId = cmdData?._id.toString();
  OTFCommand.updateOne(
    { _id: cmdId },
    { name: newName, $push: { history: { "name-change": { name: editor, message: `Edited command name from "${oldName}" to "${newName}"`, date: new Date() } } } },
    function (error: Error, success: string) {
      if (error) {
        console.log(error);
      } else {
        console.log("updated")
      }
    }
  )
}

export async function getOTFResponse(name: string, toUser: string | null) {
  let response = await OTFCommand.findOne({ name: name });
  
  if (!response) return; 
  return otfResponseEmote(response["response"].toString(), toUser)
}

export async function getOTFCommandNames(): Promise<Array<string>> {
  let otfNames:Array<string> = [];
  let OTFData: Array<IOTFCommand> = await OTFCommand.find({}).select({ "name": 1, "_id": 0 })!;

  OTFData.forEach(cmd => {
    otfNames.push(cmd["name"]);
  });

  return otfNames;
}