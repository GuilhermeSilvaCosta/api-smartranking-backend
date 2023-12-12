import { Schema } from 'mongoose';

export const CategorySchema = new Schema(
  {
    name: { type: String, unique: true },
    description: { type: String },
    events: [
      {
        name: { type: String },
        operation: { type: String },
        value: { type: Number },
      },
    ],
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  { timestamps: true, collection: 'categories' },
);
