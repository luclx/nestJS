import { Module } from '@nestjs/common';
import { SorTypeService } from './sor_type.service';
@Module({
  controllers: [],
  providers: [SorTypeService]
})
export class UnitModule { }
