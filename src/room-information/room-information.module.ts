import { Module } from '@nestjs/common';
import { RoomInformationService } from './room-information.service';
@Module({
  controllers: [],
  providers: [RoomInformationService]
})
export class RoomInformationModule { }
