import { Module } from '@nestjs/common';
import { RoomType3DService } from './room-type-3d.service';
@Module({
  controllers: [],
  providers: [RoomType3DService],
  exports: [RoomType3DService]
})
export class RoomType3DModule { }
