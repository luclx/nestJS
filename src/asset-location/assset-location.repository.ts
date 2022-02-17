import { EntityRepository, Repository } from 'typeorm';
import { AssetLocationEntity } from './entities/asset-location.entity';

@EntityRepository(AssetLocationEntity)
export class AssetLocationRepository extends Repository<AssetLocationEntity> { }
