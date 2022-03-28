import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CADRepository } from './cad.repository';
import { CADEntity } from './entities/cad.entity';

@Injectable()
export class CADService {
  private repository: CADRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(CADRepository);
  }
  async create(_fields): Promise<CADEntity[] | CADEntity> {
    const _item = Object.assign(new CADEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<CADEntity> {
    return await this.repository.findOne(_fields);
  }
}
