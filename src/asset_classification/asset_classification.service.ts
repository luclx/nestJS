import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetClassificationRepository } from './asset_classification.repository';
import { AssetClassificationEntity } from './entities/asset_classification.entity';

@Injectable()
export class AssetClassificationService {

  private repository: AssetClassificationRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetClassificationRepository);
  }

  public async create(_fields): Promise<AssetClassificationEntity> {
    const _item = Object.assign(new AssetClassificationEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<AssetClassificationEntity> {
    return await this.repository.findOne(_fields);
  }
}
