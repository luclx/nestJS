import { EntityRepository, Repository } from 'typeorm';
import { RoomType3DEntity } from './entities/room-type-3d.entity';

@EntityRepository(RoomType3DEntity)
export class RoomType3DRepository extends Repository<RoomType3DEntity> { }
