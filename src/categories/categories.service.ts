import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './interfaces/category.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name } = createCategoryDto;

    const found = await this.categoryModel.findOne({ name }).exec();
    if (found) throw new BadRequestException(`Category ${name} already exist.`);

    return this.categoryModel.create(createCategoryDto);
  }

  async updateCategory(
    name: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const result = await this.categoryModel.findOneAndUpdate(
      { name },
      updateCategoryDto,
      { new: true },
    );

    if (!result) throw new NotFoundException(`Category ${name} not found.`);

    return result;
  }

  searchCategories(description: string): Promise<Category[]> {
    const query = description
      ? { description: { $regex: RegExp(description, 'i') } }
      : {};
    return this.categoryModel.find(query).populate('players').exec();
  }

  async getById(name: string): Promise<Category> {
    const result = await this.categoryModel
      .findOne({ name })
      .populate('players')
      .exec();
    if (!result) throw new NotFoundException(`Category ${name} not found.`);

    return result;
  }

  async addPlayer(name: string, idPlayer: string): Promise<Category> {
    await this.playersService.getById(idPlayer);

    const foundPlayerInThisCategory = await this.categoryModel
      .findOne({ name })
      .where('players')
      .in(idPlayer as any)
      .exec();

    if (foundPlayerInThisCategory)
      throw new BadRequestException(
        `Player ${idPlayer} already exists in category ${name}.`,
      );

    const result = await this.categoryModel.findOneAndUpdate(
      { name },
      { $push: { players: idPlayer } },
      { new: true, populate: 'players' },
    );

    if (!result) throw new NotFoundException(`Category ${name} not found.`);

    return result;
  }
}
