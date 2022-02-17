import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RoomTypeEntity } from './entities/room-type.entity';
import { RoomTypeRepository } from './room-type.repository';

@Injectable()
export class RoomTypeService {
  private repository: RoomTypeRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(RoomTypeRepository);
  }
  async create(_fields): Promise<RoomTypeEntity[] | RoomTypeEntity> {
    const _item = Object.assign(new RoomTypeEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<RoomTypeEntity> {
    return await this.repository.findOne(_fields);
  }
}
