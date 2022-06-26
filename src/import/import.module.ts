import { AssetClassificationModule } from './../asset_classification/asset_classification.module';
import { SorModule } from './../sor/sor.module';
import { Module } from '@nestjs/common';
import { RoomType3DModule } from './..//room-type-3d/room-type-3d.module';
import { UnitModule } from './..//unit_of_measurement/unit.module';
import { AssetLocationModule } from './../asset-location/asset-location.module';
import { AssetModule } from './../asset/asset.module';
import { Asset3DModule } from './../asset_3d/asset_3d.module';
import { AssetSubSystemModule } from './../asset_sub_system/asset_sub_system.module';
import { AssetSystemModule } from './../asset_system/asset_system.module';
import { AssetUDSModule } from './../asset_uds/asset_uds.module';
import { BuildingModule } from './../building/building.module';
import { CADModule } from './../cad/cad.module';
import { DepartmentModule } from './../department/department.module';
import { FacilityTypeModule } from './../facility_type/facility_type.module';
import { FaultCategoryModule } from './../fault_category/fault_category.module';
import { FaultTypeModule } from './../fault_type/fault_type.module';
import { IoTModule } from './../iot/iot.module';
import { OccupancyModule } from './../occupancy/occupancy.module';
import { RoomInformationModule } from './../room-information/room-information.module';
import { SorTypeModule } from './../sor_type/sor_type.module';
import { UDSModule } from './../uds/uds.module';
import { WarrantyTypeModule } from './../warranty_type/warranty_type.module';
import { ImportController } from './import.controller';
@Module({
    imports: [
        BuildingModule,
        RoomType3DModule,
        AssetLocationModule,
        DepartmentModule,
        RoomInformationModule,
        ImportModule,
        Asset3DModule,
        AssetSystemModule,
        AssetSubSystemModule,
        AssetUDSModule,
        WarrantyTypeModule,
        FacilityTypeModule,
        OccupancyModule,
        IoTModule,
        UDSModule,
        CADModule,
        FaultCategoryModule,
        FaultTypeModule,
        AssetModule,
        UnitModule,
        SorTypeModule,
        SorModule,
        AssetClassificationModule
    ],
    controllers: [ImportController],
    exports: [],
    providers: [
    ]
})
export class ImportModule { }
