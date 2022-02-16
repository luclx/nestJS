import { Building } from 'src/building/entities/building.entity';
import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';

@Module({
  controllers: [BuildingController],
  providers: [BuildingService]
})
export class BuildingModule {}
