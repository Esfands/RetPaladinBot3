import { model, Schema, Model, Document } from 'mongoose';

export interface IOTFCommand extends Document {
  name: string;
  response: string;
  creator: string;
  count: number;
  history: Array<object>;
}

let OTFSchema = new Schema({
  name: String,
  response: String,
  creator: String,
  count: Number,
  history: Array
})

export const OTFCommand: Model<IOTFCommand | null> = model(`otfs`, OTFSchema);
