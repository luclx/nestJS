import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { DepartmentRepository } from './department.repository';
import { DepartmentEntity } from './entities/department.entity';

@Injectable()
export class DepartmentService {
  private repository: DepartmentRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(DepartmentRepository);
  }
  async create(_fields): Promise<DepartmentEntity[] | DepartmentEntity> {
    const _item = Object.assign(new DepartmentEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<DepartmentEntity> {
    return await this.repository.findOne(_fields);
  }
}
