import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingEntity } from './../building/entities/building.entity';
import { AssetLocationController } from './asset-location.controller';
import { AssetLocationService } from './asset-location.service';
import { AssetLocationRepository } from './assset-location.repository';
@Module({
  imports: [TypeOrmModule.forFeature([AssetLocationRepository, BuildingEntity])],
  controllers: [AssetLocationController],
  providers: [AssetLocationService],
  exports: [AssetLocationService]
})
export class AssetLocationModule { }
