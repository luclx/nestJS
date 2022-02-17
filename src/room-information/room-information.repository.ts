import { EntityRepository, Repository } from 'typeorm';
import { RoomInformationEntity } from './entities/room-information.entity';

@EntityRepository(RoomInformationEntity)
export class RoomInformationRepository extends Repository<RoomInformationEntity> { }
