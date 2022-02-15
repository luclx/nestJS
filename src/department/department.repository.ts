import { Department } from './entities/department.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Department)
export class DepartmentRepository extends Repository<Department> { }
