import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class UpdateChallengeDto {
  @IsDateString()
  @IsOptional()
  date: Date;

  @IsOptional()
  @IsEnum(ChallengeStatus)
  status: ChallengeStatus;
}
