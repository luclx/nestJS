import { EntityRepository, Repository } from 'typeorm';
import { AssetEntity } from './entities/asset.entity';

@EntityRepository(AssetEntity)
export class AssetRepository extends Repository<AssetEntity> { }
