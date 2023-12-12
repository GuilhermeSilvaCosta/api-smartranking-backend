import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Event } from '../interfaces/category.interface';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
