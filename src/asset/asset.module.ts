import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
@Module({
  controllers: [],
  providers: [AssetService],
  exports: [AssetService]
})
export class AssetModule { }
