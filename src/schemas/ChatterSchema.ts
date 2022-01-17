import { model, Schema, Model, Document } from 'mongoose';

export interface IChatter extends Document {
  tid: number;
  username: string;
  display_name: string;
  color: string;
  badges: object;
}

let ChatterSchema = new Schema({
  tid: Number,
  username: String,
  display_name: String,
  color: String,
  badges: Object,
})

export const Chatter: Model<IChatter | null> = model(`chatters`, ChatterSchema);
