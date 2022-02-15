import { Module } from '@nestjs/common';
import { RoomInformationService } from './room-information.service';
import { RoomInformationController } from './room-information.controller';

@Module({
  controllers: [RoomInformationController],
  providers: [RoomInformationService]
})
export class RoomInformationModule {}
