import { SorService } from './../sor/sor.service';
import { SorTypeService } from './../sor_type/sor_type.service';
import { UnitService } from './../unit_of_measurement/unit.service';
import { RoomTypeService } from './../room-type/room-type.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { DepartmentService } from './../department/department.service';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { BuildingService } from './../building/building.service';
'use strict';

import { Module } from '@nestjs/common';
import { BuildingModule } from './../building/building.module';
import { AssetLocationModule } from './../asset-location/asset-location.module';
import { DepartmentModule } from './../department/department.module';
import { RoomInformationModule } from './../room-information/room-information.module';
import { RoomTypeModule } from './../room-type/room-type.module';
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
    providers: [BuildingService, AssetLocationService, DepartmentService, RoomInformationService, RoomTypeService, UnitService, SorTypeService, SorService]
})
export class ImportModule { }
