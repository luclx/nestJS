import { Module } from '@nestjs/common';
import { OccupancyService } from './occupancy.service';
@Module({
  controllers: [],
  providers: [OccupancyService]
})
export class OccupancyModule { }
