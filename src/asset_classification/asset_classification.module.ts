import { Module } from '@nestjs/common';
import { AssetClassificationService } from './asset_classification.service';
@Module({
  controllers: [],
  providers: [AssetClassificationService],
  exports: [AssetClassificationService]
})
export class AssetClassificationModule { }
