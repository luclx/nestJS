import { Module } from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
@Module({
  controllers: [],
  providers: [RoomTypeService]
})
export class RoomTypeModule { }
