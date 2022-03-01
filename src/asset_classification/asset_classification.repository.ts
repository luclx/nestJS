import { EntityRepository, Repository } from 'typeorm';
import { AssetClassificationEntity } from './entities/asset_classification.entity';

@EntityRepository(AssetClassificationEntity)
export class AssetClassificationRepository extends Repository<AssetClassificationEntity> { }
