import { Schema } from 'mongoose';

export const MatchSchema = new Schema(
  {
    category: String,
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    winner: { type: Schema.Types.ObjectId, ref: 'Player' },
    result: [
      {
        set: String,
      },
    ],
  },
  { timestamps: true, collection: 'matches' },
);
