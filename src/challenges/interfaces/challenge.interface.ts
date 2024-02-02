import { Document } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';
import { Player } from 'src/players/interfaces/player.interface';

export interface Challenge extends Document {
  date: Date;
  status: ChallengeStatus;
  createdAt: Date;
  responseDate: Date;
  requester: string;
  category: string;
  players: Array<Player>;
  match: Match;
}

export interface Match extends Document {
  category: string;
  players: Array<Player>;
  def: Player;
  resultado: Array<Result>;
}

export interface Result {
  set: string;
}
