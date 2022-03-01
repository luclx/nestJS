import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetUDSRepository } from './asset_uds.repository';
import { AssetUDSEntity } from './entities/asset_uds.entity';

@Injectable()
export class AssetUDSService {

  private repository: AssetUDSRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetUDSRepository);
  }

  public async create(_fields): Promise<AssetUDSEntity> {
    const _item = Object.assign(new AssetUDSEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<AssetUDSEntity> {
    return await this.repository.findOne(_fields);
  }
}
