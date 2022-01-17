import { model, Schema, Model, Document } from 'mongoose';

export interface ICommand extends Document {
  name: string;
  aliases: Array<string>;
  permissions: Array<string>;
  trusted: boolean;
  globalCooldown: number;
  cooldown: number;
  description: string;
  dynamicDescription: Array<string>;
  testing: boolean;
  offlineOnly: boolean;
  count: number;
  path: string;
}

let CommandSchema = new Schema({
  name: String,
  aliases: Array,
  permissions: Array,
  trusted: Boolean,
  globalCooldown: Number,
  cooldown: Number,
  description: String,
  dynamicDescription: Array,
  testing: Boolean,
  offlineOnly: Boolean,
  count: Number,
  path: String
})

export const Command: Model<ICommand | null> = model(`normalcommands`, CommandSchema);
