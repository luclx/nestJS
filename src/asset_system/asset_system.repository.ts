import { EntityRepository, Repository } from 'typeorm';
import { AssetSystemEntity } from './entities/asset_system.entity';

@EntityRepository(AssetSystemEntity)
export class AssetSystemRepository extends Repository<AssetSystemEntity> { }
