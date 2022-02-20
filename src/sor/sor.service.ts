import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { SorEntity } from './entities/sor.entity';
import { SorRepository } from './sor.repository';

@Injectable()
export class SorService {

  private repository: SorRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(SorRepository);
  }

  public async create(_fields): Promise<SorEntity> {
    const _item = Object.assign(new SorEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findAll(): Promise<SorEntity[]> {
    return await this.repository.find({})
  }

  async findOne(_fields): Promise<SorEntity> {
    return await this.repository.findOne(_fields);
  }
}
