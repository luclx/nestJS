import { Module } from '@nestjs/common';
import { AssetSystemService } from './asset_system.service';
@Module({
  controllers: [],
  providers: [AssetSystemService],
  exports: [AssetSystemService]
})
export class AssetSystemModule { }
