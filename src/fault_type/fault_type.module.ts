import { Module } from '@nestjs/common';
import { FaultTypeService } from './fault_type.service';
@Module({
  controllers: [],
  providers: [FaultTypeService]
})
export class FaultTypeModule { }
 