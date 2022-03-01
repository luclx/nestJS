import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AssetUDSRepository } from './asset_uds.repository';

@Injectable()
export class AssetUDSService {

  private repository: AssetUDSRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(AssetUDSRepository);
  }
}
