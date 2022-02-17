import { EntityRepository, Repository } from 'typeorm';
import { RoomTypeEntity } from './entities/room-type.entity';

@EntityRepository(RoomTypeEntity)
export class RoomInformationRepository extends Repository<RoomTypeEntity> { }
