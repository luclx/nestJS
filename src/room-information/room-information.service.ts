import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RoomInformationEntity } from './entities/room-information.entity';
import { RoomInformationRepository } from './room-information.repository';

@Injectable()
export class RoomInformationService {
  private repository: RoomInformationRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(RoomInformationRepository);
  }
  async create(_fields): Promise<RoomInformationEntity> {
    const _item = Object.assign(new RoomInformationEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<RoomInformationEntity> {
    return await this.repository.findOne(_fields);
  }
}
