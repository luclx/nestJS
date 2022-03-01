import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Asset3DRepository } from './asset_3d.repository';
import { Asset3DEntity } from './entities/asset_3d.entity';

@Injectable()
export class Asset3DService {

  private repository: Asset3DRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(Asset3DRepository);
  }

  public async create(_fields): Promise<Asset3DEntity> {
    const _item = Object.assign(new Asset3DEntity(), _fields);
    return await this.repository.save(_item);
  }

  async findOne(_fields): Promise<Asset3DEntity> {
    return await this.repository.findOne(_fields);
  }
}
