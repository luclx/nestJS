import { Module } from '@nestjs/common';
import { OccupancyService } from './occupancy.service';
@Module({
  controllers: [],
  providers: [OccupancyService],
  exports: [OccupancyService]
})
export class OccupancyModule { }
