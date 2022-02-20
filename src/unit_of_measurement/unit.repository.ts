import { UnitOfMeasurementEntity } from './entities/unit.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UnitOfMeasurementEntity)
export class UnitRepository extends Repository<UnitOfMeasurementEntity> { }
