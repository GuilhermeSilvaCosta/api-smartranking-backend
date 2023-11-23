import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  async createOrUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.playersService.createOrUpdatePlayer(createPlayerDto);
  }
}
