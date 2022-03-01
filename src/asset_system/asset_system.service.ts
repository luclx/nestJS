import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetSystemRepository } from './asset_system.repository';
import { AssetSystemEntity } from './entities/asset_system.entity';

@Injectable()
export class AssetSystemService {

  private repository: AssetSystemRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetSystemRepository);
  }

  public async create(_fields): Promise<AssetSystemEntity> {
    const _item = Object.assign(new AssetSystemEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<AssetSystemEntity> {
    return await this.repository.findOne(_fields);
  }
}
