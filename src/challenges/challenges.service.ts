import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, Match } from './interfaces/challenge.interface';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssingChallengeMatchDto } from './dtos/assign-challenge-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const { requester, players } = createChallengeDto;

    if (!players.some((players) => players === requester))
      throw new BadRequestException(`Requester should be a challenger`);

    try {
      await this.playersService.getById(requester);
    } catch (err) {
      throw new NotFoundException(`Requester ${requester} not found`);
    }

    const finds = players.map((player) => this.playersService.getById(player));
    await Promise.all(finds);

    const categories = await this.categoriesService.searchCategories('');
    const category = categories.find((category) =>
      category.players.some((player) => player._id == requester),
    );

    if (!category)
      throw new NotFoundException(
        `Requester ${requester} don't have a category`,
      );

    return this.challengeModel.create({
      ...createChallengeDto,
      status: ChallengeStatus.PENDING,
      category: category.name,
    });
  }

  async updateChallenger(
    idChallenge: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    await this.checkChallenge(idChallenge);

    return this.challengeModel.findByIdAndUpdate(
      idChallenge,
      updateChallengeDto,
      { new: true },
    );
  }

  async deleteChallenge(idChallenge: string): Promise<void> {
    await this.checkChallenge(idChallenge);

    await this.challengeModel.findByIdAndUpdate(idChallenge, {
      status: ChallengeStatus.CANCELETED,
    });
  }

  searchChallenges(requester: string): Promise<Challenge[]> {
    const query = requester ? { requester } : null;
    return this.challengeModel.find(query);
  }

  async assingMatch(
    idChallenge: string,
    assingChallengeMatchDto: AssingChallengeMatchDto,
  ): Promise<Match> {
    await this.checkChallenge(idChallenge);

    const challenge = await this.challengeModel.findById(idChallenge);
    const { players } = challenge;
    if (!players.includes(assingChallengeMatchDto.winner))
      throw new BadRequestException('Winner is not a player in this challenge');

    const match = {
      category: challenge.category,
      players,
      ...assingChallengeMatchDto,
    };

    const matchResult = await this.matchModel.create(match);

    return this.challengeModel.findByIdAndUpdate(
      idChallenge,
      { $push: { matches: matchResult._id } },
      { new: true, populate: 'matches' },
    );
  }

  private async checkChallenge(idChallenge: string): Promise<void> {
    if (!(await this.challengeModel.exists({ _id: idChallenge })))
      throw new NotFoundException(`Challenge ${idChallenge} not found!`);
  }
}
