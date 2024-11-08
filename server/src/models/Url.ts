import { Document, Schema, model } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortenUrlKey: string;
  visits: number;
  createdAt: Date;
  expiresAt: Date;
}

const schema = new Schema<IUrl>({
  originalUrl: {
    type: String,
    required: true,
    unique: true,
  },
  shortenUrlKey: {
    type: String,
    required: true,
    unique: true,
  },
  visits: {
    type: Number,
    required: true,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  expiresAt: {
    type: Date,
    default: new Date(new Date().setMinutes(new Date().getMinutes() + 10)), // default is 10 minutes, for demonstration only
  },
});

export default model<IUrl>('url', schema);
