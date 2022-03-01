import { Module } from '@nestjs/common';
import { AssetUDSService } from './asset_uds.service';
@Module({
  controllers: [],
  providers: [AssetUDSService]
})
export class AssetUDSModule { }
