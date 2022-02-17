import { AssetLocationEntity } from './../asset-location/entities/asset-location.entity';
'use strict';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { BuildingService } from './../building/building.service';
import { DepartmentService } from './../department/department.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { RoomTypeService } from './../room-type/room-type.service';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

@ApiTags('import')
@Controller({ path: 'import', version: '1' })
/**
 * Import Controller
 *
 * This controller imports data from Excel.
 * @copyright	2022, S3 Innovate Pte. Ltd.
 * @author		Luc LX <liam@s3innovate.com>
 */
export class ImportController {

    constructor(
        private readonly buildingService: BuildingService,
        private readonly assetLocationService: AssetLocationService,
        private readonly departmentService: DepartmentService,
        private readonly roomTypeService: RoomTypeService,
        private readonly roomInformationService: RoomInformationService
    ) { }

    @Get('import')
    async importRoomInformation(): Promise<void> {
        console.log("🚀 ~ file: ImportService.js ~ line 17 ~ import1 ~ _location")
        const _location = path.resolve('/Users/lacphan/working/projects/clients/s3/3_tpdfamp/importer/import1.xlsx');
        const wb = XLSX.readFile(_location);
        // validate import data
        const importData = [];
        const ws = wb.Sheets[wb.SheetNames[0]];
        let wsData = XLSX.utils.sheet_to_json(ws);

        // Prepare data
        wsData = wsData.map(item => {
            let _obj = {}
            Object.keys(item).map(key => {
                _obj[key.replace('*', '').trim()] = typeof item[key] === 'string' ? item[key].trim() : item[key]
            });
            return _obj;
        });
        for (let i = 0; i < wsData.length; i++) {

            //import AssetLocation
            // let _asset_location = await this.assetLocationService.findOne()

            //import RoomType

            //import RoomInformation

        }
    }
}
