import { UnitService } from './unit.service';
import { Module } from '@nestjs/common';
@Module({
  controllers: [],
  providers: [UnitService],
  exports: [UnitService]
})
export class UnitModule { }
