import { EntityRepository, Repository } from 'typeorm';
import { FacilityTypeEntity } from './entities/facility_type.entity';

@EntityRepository(FacilityTypeEntity)
export class FacilityTypeRepository extends Repository<FacilityTypeEntity> { }
