import { model, Schema, Model, Document } from 'mongoose';

export interface IStreamStats extends Document {
  type: string;
  status: string;
  title: string;
  category: string;
}

let StreamStatsSchema = new Schema({
  type: String,
  status: String,
  title: String,
  category: String
})

export const StreamStat: Model<IStreamStats | null> = model(`streamstats`, StreamStatsSchema);
