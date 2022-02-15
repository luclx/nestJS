import { EntityRepository, Repository } from 'typeorm';
import { AssetLocation } from './entities/asset-location.entity';

@EntityRepository(AssetLocation)
export class AssetLocationRepository extends Repository<AssetLocation> { }
