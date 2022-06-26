import { Module } from '@nestjs/common';
import { UDSService } from './uds.service';
@Module({
  controllers: [],
  providers: [UDSService],
  exports: [UDSService]
})
export class UDSModule { }
