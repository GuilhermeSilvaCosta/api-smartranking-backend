import { Schema } from 'mongoose';

export const ChallengeSchema = new Schema(
  {
    date: Date,
    status: {
      type: String,
      enum: ['REALIZED', 'PENDING', 'ACCEPTED', 'DENIED', 'CANCELETED'],
    },
    responseDate: Date,
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    category: String,
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
  },
  { timestamps: true, collection: 'challenges' },
);
