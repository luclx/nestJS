import { EntityRepository, Repository } from 'typeorm';
import { FaultCategoryEntity } from './entities/fault_category.entity';

@EntityRepository(FaultCategoryEntity)
export class FaultCategoryRepository extends Repository<FaultCategoryEntity> { }
