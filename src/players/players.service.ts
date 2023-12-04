import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playerModel.create(createPlayerDto);
  }

  async updatePlayer(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const result = await this.playerModel.findByIdAndUpdate(
      id,
      updatePlayerDto,
      {
        new: true,
      },
    );
    if (!result) throw new NotFoundException('Player id not found');

    return result;
  }

  async searchPlayers(email: string): Promise<Player[]> {
    const query = email ? { email } : {};
    return this.playerModel.find(query).exec();
  }

  async removePlayer(id: string): Promise<void> {
    const result = await this.playerModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Player id not found');
  }
}
