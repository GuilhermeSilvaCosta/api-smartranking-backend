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
import { UpdatePlayerDto } from './dtos/update-player.dto';

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
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id') id: string,
  ): Promise<Player> {
    return this.playersService.updatePlayer(id, updatePlayerDto);
  }

  @Get()
  async searchPlayers(
    @Query('email', PlayersValidationParamsPipe) email: string,
  ): Promise<Player[]> {
    return this.playersService.searchPlayers(email);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<Player> {
    return this.playersService.getById(id);
  }

  @Delete('/:id')
  async removePlayer(@Param('id') id: string): Promise<void> {
    await this.playersService.removePlayer(id);
  }
}
