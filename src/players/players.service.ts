import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createOrUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const player: Player = this.players.find((player) =>
      player.email.match(createPlayerDto.email),
    );

    if (player) return this.update(createPlayerDto, player);

    this.create(createPlayerDto);
  }

  async searchPlayers(email: string): Promise<Player[]> {
    return await this.players.filter(
      (player) => !email || player.email.match(email),
    );
  }

  async removePlayer(id: string): Promise<void> {
    this.players = this.players.filter((player) => !player._id.match(id));
  }

  private create(createPlayerDto: CreatePlayerDto): void {
    const player: Player = {
      ...createPlayerDto,
      _id: uuidv4(),
      ranking: 'A',
      positionRanking: 1,
      avatar: 'www.google.com.br/foto123.jpg',
    };

    this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);

    this.players.push(player);
  }

  private update(newData: CreatePlayerDto, oldData: Player): void {
    oldData.name = newData.name;
  }
}
