import { EntityRepository, Repository } from 'typeorm';
import { CADEntity } from './entities/cad.entity';

@EntityRepository(CADEntity)
export class CADRepository extends Repository<CADEntity> { }
