import { EntityRepository, Repository } from 'typeorm';
import { FaultTypeEntity } from './entities/fault_type.entity';

@EntityRepository(FaultTypeEntity)
export class FaultTypeRepository extends Repository<FaultTypeEntity> { }
