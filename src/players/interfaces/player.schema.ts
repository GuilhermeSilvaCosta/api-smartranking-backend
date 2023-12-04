import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true },
    name: String,
    email: String,
    ranking: String,
    positionRanking: Number,
    avatar: String,
  },
  { timestamps: true, collection: 'players' },
);
