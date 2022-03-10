import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { OccupancyEntity } from './entities/occupancy.entity';
import { OccupancyRepository } from './occupancy.repository';

@Injectable()
export class OccupancyService {

  private repository: OccupancyRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(OccupancyRepository);
  }

  public async create(_fields): Promise<OccupancyEntity> {
    const _item = Object.assign(new OccupancyEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<OccupancyEntity> {
    return await this.repository.findOne(_fields);
  }

  public async query(_fields, params?): Promise<any> {
    return await this.repository.query(_fields, params);
  }
}
