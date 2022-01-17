import { model, Schema, Model, Document } from 'mongoose';

export interface INotify extends Document {
  type: string;
  users: Array<string>;
}

let NotifySchema = new Schema({
  type: String,
  users: Array
})

export const Notify: Model<INotify | null> = model(`notifications`, NotifySchema);
