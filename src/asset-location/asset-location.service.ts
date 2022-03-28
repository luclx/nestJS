import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggingService } from './../shared/services/logging.service';
import { AssetLocationRepository } from './assset-location.repository';
import { AssetLocationEntity } from './entities/asset-location.entity';

@Injectable()
export class AssetLocationService {

  private repository: AssetLocationRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetLocationRepository);
  }

  public async create(_fields): Promise<AssetLocationEntity> {
    // LoggingService.info(_fields)
    // const _item = this.repository.create(_fields);
    const _item = Object.assign(new AssetLocationEntity(), _fields);
    // LoggingService.info(_item)
    return await this.repository.save(_item);
  }

  async findAll(): Promise<AssetLocationEntity[]> {
    return await this.repository.find({})
  }

  async findOne(_fields): Promise<AssetLocationEntity> {
    return await this.repository.findOne(_fields);
  }

  public async query(_fields, params?): Promise<any> {
    return await this.repository.query(_fields, params);
  }

  public async update(newUpdate): Promise<AssetLocationEntity> {
    return await this.repository.save(newUpdate);
  }
}
