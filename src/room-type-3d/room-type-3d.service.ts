import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RoomType3DEntity } from './entities/room-type-3d.entity';
import { RoomType3DRepository } from './room-type-3d.repository';

@Injectable()
export class RoomType3DService {
  private repository: RoomType3DRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(RoomType3DRepository);
  }
  async create(_fields): Promise<RoomType3DEntity[] | RoomType3DEntity> {
    const _item = Object.assign(new RoomType3DEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<RoomType3DEntity> {
    return await this.repository.findOne(_fields);
  }
}
