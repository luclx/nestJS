import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetLocationRepository } from './assset-location.repository';
import { AssetLocation } from './entities/asset-location.entity';

@Injectable()
export class AssetLocationService {

  private assetLocationRepository: AssetLocationRepository;

  constructor(private readonly connection: Connection) {
    this.assetLocationRepository = this.connection.getCustomRepository(AssetLocationRepository);
  }

  async create(_fields): Promise<AssetLocation> {
    const _item = Object.assign(new AssetLocation(), _fields)
    return await this.assetLocationRepository.save(_item);
  }

  async findAll(): Promise<AssetLocation[]> {
    return await this.assetLocationRepository.find({})
  }

  async findOne(_fields): Promise<AssetLocation> {
    return await this.assetLocationRepository.findOne(_fields);
  }
}
