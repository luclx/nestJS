import { AssetLocationRepository } from './assset-location.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetLocationService } from './asset-location.service';
import { AssetLocationController } from './asset-location.controller';
import { Building } from 'src/building/entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetLocationRepository, Building])],
  controllers: [AssetLocationController],
  providers: [AssetLocationService],
  exports: [AssetLocationService]
})
export class AssetLocationModule {}
