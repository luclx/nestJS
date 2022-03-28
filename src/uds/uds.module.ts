import { Module } from '@nestjs/common';
import { UDSService } from './uds.service';
@Module({
  controllers: [],
  providers: [UDSService]
})
export class UDSModule { }
