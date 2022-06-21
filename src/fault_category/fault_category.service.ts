import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { FaultCategoryRepository } from './fault_category.repository';
import { FaultCategoryEntity } from './entities/fault_category.entity';

@Injectable()
export class FaultCategoryService {

  private repository: FaultCategoryRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(FaultCategoryRepository);
  }

  public async create(_fields): Promise<FaultCategoryEntity> {
    const _item = Object.assign(new FaultCategoryEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<FaultCategoryEntity> {
    return await this.repository.findOne(_fields);
  }
}
