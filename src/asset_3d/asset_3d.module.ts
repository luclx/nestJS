import { Module } from '@nestjs/common';
import { Asset3DService } from './asset_3d.service';
@Module({
  controllers: [],
  providers: [Asset3DService]
})
export class Asset3DModule { }
