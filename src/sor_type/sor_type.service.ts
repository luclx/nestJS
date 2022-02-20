import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SorTypeEntity } from './entities/sor_type.entity';
import { SorTypeRepository } from './sor_type.repository';

@Injectable()
export class SorTypeService {

  private repository: SorTypeRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(SorTypeRepository);
  }

  public async create(_fields): Promise<SorTypeEntity> {
    const _item = Object.assign(new SorTypeEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<SorTypeEntity> {
    return await this.repository.findOne(_fields);
  }
}
