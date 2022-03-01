import { Module } from '@nestjs/common';
import { AssetClassificationService } from './asset_classification.service';
@Module({
  controllers: [],
  providers: [AssetClassificationService]
})
export class AssetClassificationModule { }
