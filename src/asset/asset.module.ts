import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
@Module({
  controllers: [],
  providers: [AssetService]
})
export class AssetModule { }
