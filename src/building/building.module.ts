import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
@Module({
  controllers: [],
  providers: [BuildingService]
})
export class BuildingModule { }
