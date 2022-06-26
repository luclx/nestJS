import { Module } from '@nestjs/common';
import { FacilityTypeService } from './facility_type.service';
@Module({
  controllers: [],
  providers: [FacilityTypeService],
  exports: [FacilityTypeService]
})
export class FacilityTypeModule { }
 