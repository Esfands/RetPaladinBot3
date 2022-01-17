import { model, Schema, Model, Document } from 'mongoose';

export interface IKeyword extends Document {
  title: string;
  regex: string;
  cooldown: number;
  disabled: boolean;
  response: {
    command: boolean;
    message: string;
  }
}

let KeywordSchema = new Schema({
  title: String,
  regex: String,
  cooldown: Number,
  disabled: Boolean,
  response: {
    command: Boolean,
    message: String
  }
}) 

export const Keyword: Model<IKeyword | null> = model(`keywords`, KeywordSchema);
