import { UnitOfMeasurementEntity } from './entities/unit.entity';
import { UnitRepository } from './unit.repository';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class UnitService {

  private repository: UnitRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(UnitRepository);
  }

  public async create(_fields): Promise<UnitOfMeasurementEntity> {
    const _item = Object.assign(new UnitOfMeasurementEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<UnitOfMeasurementEntity> {
    return await this.repository.findOne(_fields);
  }
}
