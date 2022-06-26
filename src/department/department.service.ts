import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DepartmentEntity } from './entities/department.entity';
@Injectable()
export class DepartmentService extends TypeOrmCrudService<DepartmentEntity>{
  constructor(@InjectRepository(DepartmentEntity) repo) {
    super(repo);
  }
  // private repository: DepartmentRepository;

  // constructor(private readonly connection: Connection) {
  //   this.repository = this.connection.getCustomRepository(DepartmentRepository);
  // }
  async create(_fields): Promise<DepartmentEntity[] | DepartmentEntity> {
    const _item = Object.assign(new DepartmentEntity(), _fields);
    return await this.repo.save(_item);
  }
}
