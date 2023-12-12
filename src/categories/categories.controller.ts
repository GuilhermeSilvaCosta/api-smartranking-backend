import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDto);
  }

  @Put('/:name')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Param('name') name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(name, updateCategoryDto);
  }

  @Get()
  searchCategories(
    @Query('description') description: string,
  ): Promise<Category[]> {
    return this.categoriesService.searchCategories(description);
  }

  @Get('/:name')
  getById(@Param('name') name: string): Promise<Category> {
    return this.categoriesService.getById(name);
  }

  @Post('/:name/players/:idPlayer')
  addPlayer(
    @Param('name') name: string,
    @Param('idPlayer') idPlayer: string,
  ): Promise<Category> {
    return this.categoriesService.addPlayer(name, idPlayer);
  }
}
