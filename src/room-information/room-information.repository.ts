import { EntityRepository, Repository } from 'typeorm';
import { RoomInformation } from './entities/room-information.entity';

@EntityRepository(RoomInformation)
export class RoomInformationRepository extends Repository<RoomInformation> { }
