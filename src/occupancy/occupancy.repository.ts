import { EntityRepository, Repository } from 'typeorm';
import { OccupancyEntity } from './entities/occupancy.entity';

@EntityRepository(OccupancyEntity)
export class OccupancyRepository extends Repository<OccupancyEntity> { }
