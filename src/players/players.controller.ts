import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrUpdatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    return this.playersService.createPlayer(createPlayerDto);
  }

  @Put('/:id')
  async updatePlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param('id') id: string,
  ): Promise<Player> {
    return this.playersService.updatePlayer(id, createPlayerDto);
  }

  @Get()
  async searchPlayers(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<Player[]> {
    return this.playersService.searchPlayers(email);
  }

  @Delete('/:id')
  async removePlayer(@Param('id') id: string): Promise<void> {
    this.playersService.removePlayer(id);
  }
}
