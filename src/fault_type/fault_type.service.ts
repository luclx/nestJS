import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { FaultTypeEntity } from './entities/fault_type.entity';
import { FaultTypeRepository } from './fault_type.repository';

@Injectable()
export class FaultTypeService {

  private repository: FaultTypeRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(FaultTypeRepository);
  }

  public async create(_fields): Promise<FaultTypeEntity> {
    const _item = Object.assign(new FaultTypeEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<FaultTypeEntity> {
    return await this.repository.findOne(_fields);
  }
}
