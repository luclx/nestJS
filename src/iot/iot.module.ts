import { Module } from '@nestjs/common';
import { AssetLocationService } from '../asset-location/asset-location.service';
import { OccupancyService } from './../occupancy/occupancy.service';
import { IoTController } from './iot.controller';
'use strict';

@Module({
    imports: [
    ],
    controllers: [IoTController],
    exports: [],
    providers: [
        AssetLocationService,
        OccupancyService
    ]
})
export class IoTModule { }
