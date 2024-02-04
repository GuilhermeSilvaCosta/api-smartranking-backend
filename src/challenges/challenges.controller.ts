import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { Challenge, Match } from './interfaces/challenge.interface';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssingChallengeMatchDto } from './dtos/assign-challenge-match.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return this.challengesService.createChallenge(createChallengeDto);
  }

  @Put('/:idChallenge')
  @UsePipes(ValidationPipe)
  updateChallenge(
    @Param('idChallenge') idChallenge: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.challengesService.updateChallenger(
      idChallenge,
      updateChallengeDto,
    );
  }

  @Delete('/:idChallenge')
  @HttpCode(204)
  deleteChallenge(@Param('idChallenge') idChallenge: string): Promise<void> {
    return this.challengesService.deleteChallenge(idChallenge);
  }

  @Get()
  searchChallenges(
    @Query('requester') requester: string,
  ): Promise<Challenge[]> {
    return this.challengesService.searchChallenges(requester);
  }

  @Post('/:idChallenge/matches')
  assingnMatcch(
    @Param('idChallenge') idChallenge: string,
    @Body() assignChallengeMatchDto: AssingChallengeMatchDto,
  ): Promise<Match> {
    return this.challengesService.assingMatch(
      idChallenge,
      assignChallengeMatchDto,
    );
  }
}
