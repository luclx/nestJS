import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomType3DService } from '../room-type-3d/room-type-3d.service';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { AssetLocationEntity } from './../asset-location/entities/asset-location.entity';
import { Asset3DService } from './../asset_3d/asset_3d.service';
import { AssetClassificationService } from './../asset_classification/asset_classification.service';
import { AssetSubSystemService } from './../asset_sub_system/asset_sub_system.service';
import { AssetSystemService } from './../asset_system/asset_system.service';
import { AssetUDSService } from './../asset_uds/asset_uds.service';
import { BuildingService } from './../building/building.service';
import { DepartmentService } from './../department/department.service';
import { FacilityTypeService } from './../facility_type/facility_type.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { SorService } from './../sor/sor.service';
import { SorTypeService } from './../sor_type/sor_type.service';
import { UnitService } from './../unit_of_measurement/unit.service';
import { WarrantyTypeService } from './../warranty_type/warranty_type.service';
'use strict';

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
		private readonly roomType3DService: RoomType3DService,
		private readonly roomInformationService: RoomInformationService,
		private readonly unitService: UnitService,
		private readonly sorTypeService: SorTypeService,
		private readonly sorService: SorService,
		private readonly asset3DService: Asset3DService,
		private readonly assetSystemService: AssetSystemService,
		private readonly assetSubSystemService: AssetSubSystemService,
		private readonly assetUDSService: AssetUDSService,
		private readonly assetClassificationService: AssetClassificationService,
		private readonly warrantyTypeService: WarrantyTypeService,
		private readonly facilityTypeService: FacilityTypeService
	) { }

	readonly _asset_locations = []
	async findOrCreate(parent_location, new_location, room_name) {

		// if parent_location = null -> no need parent
		// if parent_location  != null, will find parent, else throw error
		let _p_location: AssetLocationEntity = null
		if (parent_location) {
			_p_location = this._asset_locations.find(x => x.room_number === parent_location)

			if (!_p_location) {
				throw new Error("PARENT INVALID");
			}
		}

		let _asset_location = this._asset_locations.find(x => x.room_number === new_location);

		if (!_asset_location) {
			_asset_location = await this.assetLocationService.findOne({ room_number: new_location })
			if (!_asset_location) {
				_asset_location = await this.assetLocationService.create({
					building_id: 91, // pls check on real DB 01A =91, 09 = 83
					parent_id: _p_location ? _p_location.id : null,
					room_number: new_location,
					slug_name: room_name ? new_location + ' (' + room_name + ')' : new_location,
					room_name: room_name
				})
				console.log("🚀 IMPORTED LOCATION", _asset_location.room_number);
			}

			this._asset_locations.push(_asset_location);
		}
		return _asset_location
	}

	/**
	 * IMPORTANT: move all levels to TOP
	 */
	@Get('import_room_information')
	async importRoomInformation(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/import_3d/AIrInformation_1A.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
			let wsData = XLSX.utils.sheet_to_json(ws);

			const importData = [];
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
				const _n_name = String(_obj['Name']).trim();
				const _n_room_number = String(_obj['Number']).trim();
				const _n_area = _obj['Area'];
				const _n_department = String(_obj['Department/School']).trim();
				const _n_room_type = String(_obj['Room Type']).trim();
				const _n_unit_number = _obj['Unit Number'];
				const _n_lease = _obj['Lease (Y/N)'];
				console.log("🚀  OBJ", _n_room_number);

				//---------------Location--------------
				const locationArr = _n_room_number.split('-').map(x => x.trim()).filter(x => x)
				const building_num = locationArr[0]
				let _asset_location: AssetLocationEntity = null

				// 01-01: size 2
				// 01-01-01: size 3
				// 01-01-01-01: size 4
				// 01-01-01-01-01: size 5
				for (let i = 1; i < locationArr.length; i++) {
					let new_location: string = building_num
					let paren_location: string = null

					for (let j = 1; j <= i; j++) {
						new_location += '-' + locationArr[j]
						if (j == i - 1) {
							paren_location = new_location
						}
					}

					const name: string = i == locationArr.length - 1 ? _n_name : null
					// the last always is our target
					_asset_location = await this.findOrCreate(paren_location, new_location, name)
				}
				// 01-01-01: size 3
				// turn 1: i = 1, j = 1 -> new_location = '01-01', paren_location = null
				// turn 2: i = 2, j = 1 -> new_location = '01-01', paren_location = null
				// turn 3: i = 2, j = 2 -> new_location = '01-01-01', paren_location = '01-01-01'

				if (!_asset_location) {
					throw Error("Cannot import room: " + _n_room_number)
				}

				//-----------Location END----------------

				//------------Department------------------
				let _department = _departments.find(x => x.name === _n_department);
				if (!_department) {
					_department = await this.departmentService.findOne({ name: _n_department })
					if (!_department) {
						_department = await this.departmentService.create({ name: _n_department });
						console.log("🚀 IMPORTED DEPT", _department.name);
					}
					_departments.push(_department)
				}
				//------------Department END ----------------

				//------------Room Type------------------
				let _type = _room_types.find(x => x.name === _n_room_type);
				if (!_type) {
					_type = await this.roomType3DService.findOne({ name: _n_room_type })
					if (!_type) {
						_type = await this.roomType3DService.create({ name: _n_room_type });
						console.log("🚀 IMPORTED TYPE", _type.name);
					}
					_room_types.push(_type)
				}
				//------------Room Type END ----------------

				importData.push({
					asset_location_id: _asset_location.id,
					area: Number(_n_area ? _n_area : 0),
					department_id: _department.id,
					room_type_3d_id: _type.id,
					unit_number: null,
					lease: null
				});
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _rom_info = await this.roomInformationService.create(data);
				console.log("🚀 IMPORTED ROOM", _rom_info.id);
			}
			console.log("🚀 ~ Import DATA DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}

	@Get('import_sor')
	async importSOR(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/sor_handled/15_18\ Horticultural\ n\ Landscape\ SOR\ Corr\ 2.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
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
				const _g_unit = String(_obj['Unit']).replace('Per ', '').replace('per ', '').trim().toUpperCase();
				const _n_unit = _g_unit === 'undefined' || _g_unit === '' ? 'N/A' : _g_unit;
				const _g_type = String(_obj['Type']).trim();
				const _n_type = _g_type === 'undefined' || _g_type === '' ? 'N/A' : _g_type;
				const _g_item_no = String(_obj['Item No.']).trim();
				const _n_item_no = _g_item_no === 'undefined' || _g_item_no === undefined ? 'N/A' : _g_item_no;;
				const _n_description = String(_obj['Description']).trim();
				const _n_unit_price = _obj['Price']

				let _unit = _units.find(x => x.name === _n_unit);
				if (!_unit) {
					_unit = await this.unitService.findOne({ name: _n_unit })
					if (!_unit) {
						_unit = await this.unitService.create({ name: _n_unit });
						console.log("🚀 IMPORTED UNIT", _unit.name);
					}
					_units.push(_unit)
				}

				let _type = _units.find(x => x.name === _n_type);
				if (!_type) {
					_type = await this.sorTypeService.findOne({ name: _n_type })
					if (!_type) {
						_type = await this.sorTypeService.create({ name: _n_type });
						console.log("🚀 IMPORTED SOR TYPE", _type.name);
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
				console.log("🚀 IMPORTED SOR", _sor.id);
			}
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}

	@Get('import_asset_3d')
	async importAsset3D(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/import_3d/AIrInformation_1A.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
			let wsData = XLSX.utils.sheet_to_json(ws);

			const importData = [];
			const _systems = []
			const _sub_systems = []
			const _classifications = []

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
				const _n_system = String(_obj['System']).trim();
				const _n_sub_system = String(_obj['Sub-System']).trim();
				const _n_classification = String(_obj['Classification']).trim();
				const _n_type_description = String(_obj['Equipment Type']).trim();
				const _n_room_number = String(_obj['Room Number']).trim();
				const _n_room_name = String(_obj['Room Name']).trim();
				const _n_mark = String(_obj['Mark']).trim();
				const _n_onsite_equipment_label = String(_obj['Onsite Equipment Label']).trim();
				const _n_control_panel = String(_obj['Control Panel']).trim();
				const _n_brand = String(_obj['Brand']).trim();
				const _n_equipment_model = String(_obj['Equipment Model']).trim();
				const _n_capacity = String(_obj['Capacity']).trim();
				const _n_serial_number = _obj['Serial Number'];
				const _n_installation_date = _obj['Installation Date'];
				const _n_warranty_expire_date = _obj['Warranty Expiry Date'];
				// console.log("🚀  Location", _n_room_number);

				//---------------Location--------------
				//---------------Location--------------
				const locationArr = _n_room_number.split('-').map(x => x.trim()).filter(x => x)
				const building_num = locationArr[0]
				let _asset_location: AssetLocationEntity = null

				for (let i = 1; i < locationArr.length; i++) {
					let new_location: string = building_num
					let paren_location: string = null

					for (let j = 1; j <= i; j++) {
						new_location += '-' + locationArr[j]
						if (j == i - 1) {
							paren_location = new_location
						}
					}

					const name: string = i == locationArr.length - 1 ? _n_room_name : null
					// the last always is our target
					_asset_location = await this.findOrCreate(paren_location, new_location, name)
				}
				if (!_asset_location) {
					throw Error("Cannot import room: " + _n_room_number)
				}

				//-----------Location END----------------

				//------------Asset System------------------
				let _system = _systems.find(x => x.name === _n_system);
				if (!_system) {
					_system = await this.assetSystemService.findOne({ name: _n_system })
					if (!_system) {
						_system = await this.assetSystemService.create({ name: _n_system });
						console.log("🚀 IMPORTED SYSTEM", _system.name);
					}
					_systems.push(_system)
				}
				//------------Asset System END ----------------

				//------------Asset Sub System Type------------------
				let _sub_system = _sub_systems.find(x => x.name === _n_sub_system);
				if (!_sub_system) {
					_sub_system = await this.assetSubSystemService.findOne({ name: _n_sub_system })
					if (!_sub_system) {
						_sub_system = await this.assetSubSystemService.create({ name: _n_sub_system, asset_system_id: _system.id });
						console.log("🚀 IMPORTED SUB SYSTEM", _sub_system.name);
					}
					_sub_systems.push(_sub_system)
				}
				//------------Room Type END ----------------

				//------------Asset Classification Type------------------
				let _classification = _classifications.find(x => x.name === _n_classification);
				if (!_classification) {
					_classification = await this.assetClassificationService.findOne({ name: _n_classification })
					if (!_classification) {
						_classification = await this.assetClassificationService.create({ name: _n_classification });
						console.log("🚀 IMPORTED CLASSIFICATION", _classification.name);
					}
					_classifications.push(_classification)
				}
				//------------Asset Classification END ----------------

				// const [month, day, year] = _n_installation_date.split("/")
				// const [monthw, dayw, yearw] = _n_warranty_expire_date.split("/")

				importData.push({
					zone_id: 5,
					building_id: 91,
					asset_system_id: _system.id,
					asset_subsystem_id: _sub_system.id,
					asset_location_id: _asset_location.id,
					asset_classification_id: _classification.id,
					equipment_type_description: _n_type_description,
					quantity: 1,
					equipment_model: _n_equipment_model,
					onsite_equipment_label: _n_onsite_equipment_label,
					control_panel: _n_control_panel,
					brand: _n_brand,
					capacity: _n_capacity ? _n_capacity : null,
					serial_number: _n_serial_number ? _n_serial_number : null,
					mark: _n_mark,
					installation_date: _n_installation_date ? new Date(Math.round((_n_installation_date - 25569) * 86400 * 1000)) : null,
					warranty_expire_date: _n_warranty_expire_date ? new Date(Math.round((_n_warranty_expire_date - 25569) * 86400 * 1000)) : null
				});
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _asset_info = await this.asset3DService.create(data);
				console.log("🚀 IMPORTED ASSET MARK", _asset_info.mark);
			}
			console.log("🚀 IMPORT DONE.", "");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}

	@Get('import_asset_uds')
	async importAssetUDS(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/import_3d/UDS_1A.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
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

			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				console.log("🚀  OBJ", _obj);
				const _n_uds = String(_obj['UDS Information']).trim();
				const markArr = _n_uds.split(",")
				const _n_parent = markArr[0].trim()

				let _asset = await this.asset3DService.findOne({ mark: _n_parent })

				if (_asset) {
					importData.push({
						asset_3d_id: _asset.id,
						pipes: _n_uds
					});
				} else {
					console.log("🚀 MARK MISSING ", _n_parent);
				}
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _uds = await this.assetUDSService.create(data);
				console.log("🚀 IMPORTED UDS MARK", _uds.pipes);
			}
			console.log("🚀 ~ Import DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}

	@Get('import_warranty_type')
	async importWarrantyType(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/CIFM\ list.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
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
			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				console.log("🚀  OBJ", _obj);
				const _n_type = String(_obj['A']).trim();

				importData.push({ name: _n_type });
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _type = await this.warrantyTypeService.create(data);
				console.log("🚀 IMPORTED TYPE: ", _type.name);
			}
			console.log("🚀 ~ Import DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}

	@Get('import_facility_type')
	async importFacilityType(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/CIFM\ list.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[2]];
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
			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				console.log("🚀  OBJ", _obj);
				const _n_type = String(_obj['A']).trim();

				importData.push({ name: _n_type });
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _type = await this.facilityTypeService.create(data);
				console.log("🚀 IMPORTED TYPE: ", _type.name);
			}
			console.log("🚀 ~ Import DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}
}
