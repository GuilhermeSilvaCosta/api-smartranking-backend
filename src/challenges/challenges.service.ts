import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge } from './interfaces/challenge.interface';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
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
}
