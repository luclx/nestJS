import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { RoomTypeController } from './room-type.controller';

@Module({
  controllers: [RoomTypeController],
  providers: [RoomTypeService]
})
export class RoomTypeModule {}
