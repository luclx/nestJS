import { Module } from '@nestjs/common';
import { AssetSubSystemService } from './asset_sub_system.service';
@Module({
  controllers: [],
  providers: [AssetSubSystemService],
  exports: [AssetSubSystemService]
})
export class AssetSubSystemModule { }
