import { EntityRepository, Repository } from 'typeorm';
import { BuildingEntity } from './entities/building.entity';

@EntityRepository(BuildingEntity)
export class BuildingRepository extends Repository<BuildingEntity> { }
