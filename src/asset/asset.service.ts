import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetRepository } from './asset.repository';
import { AssetEntity } from './entities/asset.entity';

@Injectable()
export class AssetService {

  private repository: AssetRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetRepository);
  }

  public async create(_fields): Promise<AssetEntity> {
    const _item = Object.assign(new AssetEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<AssetEntity> {
    return await this.repository.findOne(_fields);
  }
}
