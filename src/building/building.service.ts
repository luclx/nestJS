import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { BuildingRepository } from './building.repository';

@Injectable()
export class BuildingService {

  private repository: BuildingRepository;

  constructor(private readonly connection: Connection) {
    this.repository = this.connection.getCustomRepository(BuildingRepository);
  }
}
