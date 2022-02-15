import { RoomTypeService } from './../room-type/room-type.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { DepartmentService } from './../department/department.service';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { BuildingService } from './../building/building.service';
'use strict';

import { Module } from '@nestjs/common';
import { BuildingModule } from 'src/building/building.module';
import { AssetLocationModule } from 'src/asset-location/asset-location.module';
import { DepartmentModule } from 'src/department/department.module';
import { RoomInformationModule } from 'src/room-information/room-information.module';
import { RoomTypeModule } from 'src/room-type/room-type.module';
import { ImportController } from './import.controller';

@Module({
    imports: [
        BuildingModule,
        AssetLocationModule,
        DepartmentModule,
        RoomInformationModule,
        RoomTypeModule
    ],
    controllers: [ImportController],
    exports: [],
    providers: [BuildingService, AssetLocationService, DepartmentService, RoomInformationService, RoomTypeService]
})
export class ImportModule { }
