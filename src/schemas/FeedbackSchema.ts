import { model, Schema, Model, Document } from 'mongoose';

export interface IFeedback extends Document {
  username: string;
  "display-name": string;
  message: string;
  fid: number;
  type: Enumerator<string>;
  status: Enumerator<string>;
}

let FeedbackSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  "display-name": {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  fid: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["feature", 'bug'],
    default: 'feature',
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", 'complete', "in progress", "bug"],
    default: 'pending',
  }
})

export const Feedback: Model<IFeedback | null> = model(`suggestions`, FeedbackSchema);
