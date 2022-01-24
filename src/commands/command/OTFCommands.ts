import { CommonUserstate } from "tmi.js";
import { pool } from "../../main";
import { IOTFCommand } from "../../schemas/types";
import { otfResponseEmote } from "../../utils/emotes";
import { findOne, findAndUpdate, findOrCreate, findColumn, updateOne, removeOne, insertRow } from "../../utils/maria";

export async function createOTFCommand(name: string, response: string, creator: string | null) {
  let query = `INSERT INTO otf (Name, Response, Creator, Count) VALUES (?, ?, ?, ?);`;
  let values = [name, response, creator, 0];
  await insertRow(query, values);
}

export async function getOTFCleanResponse(name: string) {
  let found = await findOne('otf', `Name='${name}'`);
  if (found) {
    return found["Response"];
  } else return null;
}

export async function removeOTFCommand(name: string) {
  let searchCmd = await findOne('otf', `Name='${name}'`);
  if (searchCmd) {
    await removeOne(`otf`, `Name='${name}'`);
    return `successfuly removed keyword "${name}"`;
  } else return `couldn't find the keyword "${name}" to remove`;
}

export async function editOTFCommand(cmd: string, message: string) {
  findAndUpdate(`SELECT * FROM otf WHERE Name='${cmd}';`, `UPDATE otf SET Response='${message}' WHERE Name='${cmd}';`);
}

export async function editOTFCommandName(oldName: string, newName: string) {
  let updated = await updateOne(`UPDATE otf SET Name='${newName}' WHERE Name='${oldName}';`);
  if (updated.affectedRows == 0) return false;
}

export async function getOTFResponse(name: string, toUser: string | null) {
  let response = await findOne('otf', `Name='${name}'`);

  return otfResponseEmote(response["Response"], toUser)
}

export async function getOTFCommandNames(): Promise<Array<string>> {
  let otfNames: Array<string> = [];
  const rows = await findColumn('otf', 'Name');

  if (rows !== null) {
    rows.forEach((cmd: any) => {
      otfNames.push(cmd["Name"]);
    });
  }

  return otfNames;
}