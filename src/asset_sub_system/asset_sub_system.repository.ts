import { EntityRepository, Repository } from 'typeorm';
import { AssetSubSystemEntity } from './entities/asset_sub_system.entity';

@EntityRepository(AssetSubSystemEntity)
export class AssetSubSystemRepository extends Repository<AssetSubSystemEntity> { }
