import { EntityRepository, Repository } from 'typeorm';
import { SorTypeEntity } from './entities/sor_type.entity';

@EntityRepository(SorTypeEntity)
export class SorTypeRepository extends Repository<SorTypeEntity> { }
