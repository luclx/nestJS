import { DepartmentEntity } from './entities/department.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DepartmentEntity)
export class DepartmentRepository extends Repository<DepartmentEntity> { }
