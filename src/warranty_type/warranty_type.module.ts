import { Module } from '@nestjs/common';
import { WarrantyTypeService } from './warranty_type.service';
@Module({
  controllers: [],
  providers: [WarrantyTypeService],
  exports: [WarrantyTypeService]
})
export class WarrantyTypeModule { }
 