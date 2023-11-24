import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createOrUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.playersService.createOrUpdatePlayer(createPlayerDto);
  }

  @Get()
  async searchPlayers(@Query('email') email: string): Promise<Player[]> {
    return this.playersService.searchPlayers(email);
  }

  @Delete('/:id')
  async removePlayer(@Param('id') id: string): Promise<void> {
    this.playersService.removePlayer(id);
  }
}
