import { EntityRepository, Repository } from 'typeorm';
import { RoomType } from './entities/room-type.entity';

@EntityRepository(RoomType)
export class RoomInformationRepository extends Repository<RoomType> { }
