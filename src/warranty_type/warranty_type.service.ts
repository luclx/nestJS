import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { WarrantyTypeRepository } from './warranty_type.repository';
import { WarrantyTypeEntity } from './entities/warranty_type.entity';

@Injectable()
export class WarrantyTypeService {

  private repository: WarrantyTypeRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(WarrantyTypeRepository);
  }

  public async create(_fields): Promise<WarrantyTypeEntity> {
    const _item = Object.assign(new WarrantyTypeEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<WarrantyTypeEntity> {
    return await this.repository.findOne(_fields);
  }
}
