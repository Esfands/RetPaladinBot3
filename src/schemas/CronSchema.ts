import { model, Schema, Model, Document } from 'mongoose';

export interface ICron extends Document {
  title: string;
  pattern: string;
  disabled: boolean;
  response: {
    command: boolean;
    response: string;
  };
}

let CronSchema = new Schema({
  title: String,
  pattern: String,
  disabled: Boolean,
  response: Object
})

export const CronJob: Model<ICron | null> = model(`crons`, CronSchema);
