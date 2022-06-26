import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetLocationController } from './asset-location.controller';
import { AssetLocationService } from './asset-location.service';
import { AssetLocationEntity } from './entities/asset-location.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AssetLocationEntity])],
  controllers: [AssetLocationController],
  providers: [AssetLocationService],
  exports: [AssetLocationService]
})
export class AssetLocationModule { }
