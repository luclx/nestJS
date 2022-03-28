import { EntityRepository, Repository } from 'typeorm';
import { UDSEntity } from './entities/uds.entity';

@EntityRepository(UDSEntity)
export class UDSRepository extends Repository<UDSEntity> { }
