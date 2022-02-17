import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggingService } from './../shared/services/logging.service';
import { AssetLocationRepository } from './assset-location.repository';
import { AssetLocationEntity } from './entities/asset-location.entity';

@Injectable()
export class AssetLocationService {

  private assetLocationRepository: AssetLocationRepository;

  constructor(private readonly connection: Connection) {
    this.assetLocationRepository = this.connection.getCustomRepository(AssetLocationRepository);
  }

  public async create(_fields): Promise<AssetLocationEntity[] | AssetLocationEntity> {
    // const _item = this.assetLocationRepository.create(createBuildingDto);
    const _item = Object.assign(new AssetLocationEntity(), _fields);
    LoggingService.info(_item)
    return await this.assetLocationRepository.save(_item);
  }

  async findAll(): Promise<AssetLocationEntity[]> {
    return await this.assetLocationRepository.find({})
  }

  async findOne(_fields): Promise<AssetLocationEntity> {
    return await this.assetLocationRepository.findOne(_fields);
  }
}
