import { EntityRepository, Repository } from 'typeorm';
import { AssetUDSEntity } from './entities/asset_uds.entity';

@EntityRepository(AssetUDSEntity)
export class AssetUDSRepository extends Repository<AssetUDSEntity> { }
