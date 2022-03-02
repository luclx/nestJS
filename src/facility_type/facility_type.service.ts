import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { FacilityTypeRepository } from './facility_type.repository';
import { FacilityTypeEntity } from './entities/facility_type.entity';

@Injectable()
export class FacilityTypeService {

  private repository: FacilityTypeRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(FacilityTypeRepository);
  }

  public async create(_fields): Promise<FacilityTypeEntity> {
    const _item = Object.assign(new FacilityTypeEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<FacilityTypeEntity> {
    return await this.repository.findOne(_fields);
  }
}
