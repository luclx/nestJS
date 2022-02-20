'use strict';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { BuildingService } from './../building/building.service';
import { DepartmentService } from './../department/department.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { RoomTypeService } from './../room-type/room-type.service';
import { SorService } from './../sor/sor.service';
import { SorTypeService } from './../sor_type/sor_type.service';
import { UnitService } from './../unit_of_measurement/unit.service';

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
		private readonly roomInformationService: RoomInformationService,
		private readonly unitService: UnitService,
		private readonly sorTypeService: SorTypeService,
		private readonly sorService: SorService,
	) { }

	@Get('import_location')
	async importRoomInformation(): Promise<void> {
		try {
			const _location = path.resolve('/Users/luc.le/S3/Block1A.xlsx');
			const wb = XLSX.readFile(_location);
			const ws = wb.Sheets[wb.SheetNames[0]];
			let wsData = XLSX.utils.sheet_to_json(ws);

			const importData = [];
			const _asset_locations = []
			const _room_types = []
			const _departments = []

			wsData = wsData.map(item => {
				let _obj = {}
				Object.keys(item).map(key => {
					_obj[key.replace('*', '').trim()] = typeof item[key] === 'string' ? item[key].trim() : item[key]
				});
				return _obj;
			});
			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				// console.log("🚀  OBJ", _obj);
				const _n_name = _obj['Name'];
				const _n_room_number = _obj['Number'];
				const _n_area = _obj['Area'];
				const _n_department = _obj['Department/School'];
				const _n_room_type = _obj['Room Type'];
				const _n_unit_number = _obj['Unit Number']
				const _n_lease = _obj['Lease (Y/N)']
				console.log("🚀  OBJ", _n_room_number);

				//---------------Location--------------
				const [_building_num, _level_num, _room_num] = _n_room_number.split('-').map(x => x.trim()).filter(x => x)
				const _n_parent_location = _building_num.replace('EW', '0') + '-' + _level_num
				const _n_location = _n_parent_location + (_room_num ? ('-' + _room_num) : '');

				let _asset_location = _asset_locations.find(x => x.room_number === _n_location);

				if (!_asset_location) {
					_asset_location = await this.assetLocationService.findOne({ room_number: _n_location })
					if (!_asset_location) {
						let _parent = null
						// if location not a level
						if (_n_location != _n_parent_location) {
							_parent = await this.assetLocationService.findOne({ room_number: _n_parent_location })
							if (!_parent) {
								_parent = await this.assetLocationService.create({
									building_id: 1,
									parent_id: null,
									room_number: _n_parent_location,
									slug_name: _n_name,
									room_name: _n_name
								})
							}
						}
						_asset_location = await this.assetLocationService.create({
							building_id: 1,
							parent_id: _parent ? _parent.id : null,
							room_number: _n_location,
							slug_name: _n_location + '(' + _n_name + ')',
							room_name: _n_name
						})
					}

					_asset_locations.push(_asset_location);
				}

				//-----------Location END----------------

				//------------Department------------------
				let _department = _departments.find(x => x.name === _n_department);
				if (!_department) {
					_department = await this.departmentService.findOne({ name: _n_department })
					if (!_department) {
						_department = await this.departmentService.create({ name: _n_department });
					}
					_departments.push(_department)
				}
				//------------Department END ----------------

				//------------Room Type------------------
				let _type = _room_types.find(x => x.name === _n_room_type);
				if (!_type) {
					_type = await this.roomTypeService.findOne({ name: _n_room_type })
					if (!_type) {
						_type = await this.roomTypeService.create({ name: _n_room_type });
					}
					_room_types.push(_type)
				}
				//------------Room Type END ----------------

				importData.push({
					asset_location_id: _asset_location.id,
					area: Number(_n_area),
					department_id: _department.id,
					room_type_id: _type.id,
					unit_number: _n_unit_number,
					lease: _n_lease
				});
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _rom_info = await this.roomInformationService.create(data);
				console.log("🚀 IMPORTED", _rom_info.id);
			}
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}

	@Get('import_sor')
	async importSOR(): Promise<void> {
		try {
			const _location = path.resolve('/Users/luc.le/S3/Block1A.xlsx');
			const wb = XLSX.readFile(_location);
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

			const importData = [];
			const _units = [];
			const _types = []

			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				console.log("🚀  OBJ", _obj);
				const _n_unit = _obj['Unit'];
				const _n_type = _obj['Type'];
				const _n_item_no = _obj['Item No.'];
				const _n_description = _obj['Description'];
				const _n_unit_price = _obj['Price']

				let _unit = _units.find(x => x.name === _n_unit);
				if (!_unit) {
					_unit = await this.unitService.findOne({ name: _n_unit })
					if (!_unit) {
						_unit = await this.unitService.create({ name: _n_unit });
					}
					_units.push(_unit)
				}

				let _type = _units.find(x => x.name === _n_type);
				if (!_type) {
					_type = await this.sorTypeService.findOne({ name: _n_type })
					if (!_type) {
						_type = await this.sorTypeService.create({ name: _n_type });
					}
					_types.push(_type)
				}

				importData.push({
					item_no: _n_item_no,
					sor_type_id: _type.id,
					unit_of_measurement_id: _unit.id,
					description: _n_description,
					unit_price: _n_unit_price
				});
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _sor = await this.sorService.create(data);
				console.log("🚀 IMPORTED", _sor.id);
			}
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}
}
