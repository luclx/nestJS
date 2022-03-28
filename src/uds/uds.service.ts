import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UDSEntity } from './entities/uds.entity';
import { UDSRepository } from './uds.repository';

@Injectable()
export class UDSService {

  private repository: UDSRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(UDSRepository);
  }

  public async create(_fields): Promise<UDSEntity> {
    const _item = Object.assign(new UDSEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<UDSEntity> {
    return await this.repository.findOne(_fields);
  }
}
