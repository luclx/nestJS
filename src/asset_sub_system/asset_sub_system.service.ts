import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetSubSystemRepository } from './asset_sub_system.repository';
import { AssetSubSystemEntity } from './entities/asset_sub_system.entity';

@Injectable()
export class AssetSubSystemService {

  private repository: AssetSubSystemRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetSubSystemRepository);
  }

  public async create(_fields): Promise<AssetSubSystemEntity> {
    const _item = Object.assign(new AssetSubSystemEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<AssetSubSystemEntity> {
    return await this.repository.findOne(_fields);
  }
}
