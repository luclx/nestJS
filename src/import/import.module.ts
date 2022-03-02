import { Module } from '@nestjs/common';
import { WarrantyTypeService } from 'src/warranty_type/warranty_type.service';
import { AssetLocationModule } from './../asset-location/asset-location.module';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { Asset3DService } from './../asset_3d/asset_3d.service';
import { AssetClassificationService } from './../asset_classification/asset_classification.service';
import { AssetSubSystemService } from './../asset_sub_system/asset_sub_system.service';
import { AssetSystemService } from './../asset_system/asset_system.service';
import { AssetUDSService } from './../asset_uds/asset_uds.service';
import { BuildingModule } from './../building/building.module';
import { BuildingService } from './../building/building.service';
import { DepartmentModule } from './../department/department.module';
import { DepartmentService } from './../department/department.service';
import { RoomInformationModule } from './../room-information/room-information.module';
import { RoomInformationService } from './../room-information/room-information.service';
import { RoomTypeModule } from './../room-type/room-type.module';
import { RoomTypeService } from './../room-type/room-type.service';
import { SorService } from './../sor/sor.service';
import { SorTypeService } from './../sor_type/sor_type.service';
import { UnitService } from './../unit_of_measurement/unit.service';
import { ImportController } from './import.controller';
'use strict';


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
    providers: [
        BuildingService,
        AssetLocationService,
        DepartmentService,
        RoomInformationService,
        RoomTypeService,
        UnitService,
        SorTypeService,
        SorService,
        AssetClassificationService,
        AssetSubSystemService,
        AssetSystemService,
        AssetUDSService,
        Asset3DService,
        WarrantyTypeService
    ]
})
export class ImportModule { }
