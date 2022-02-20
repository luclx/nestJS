import { EntityRepository, Repository } from 'typeorm';
import { SorEntity } from './entities/sor.entity';

@EntityRepository(SorEntity)
export class SorRepository extends Repository<SorEntity> { }
