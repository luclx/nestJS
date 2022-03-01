import { EntityRepository, Repository } from 'typeorm';
import { Asset3DEntity } from './entities/asset_3d.entity';

@EntityRepository(Asset3DEntity)
export class Asset3DRepository extends Repository<Asset3DEntity> { }
