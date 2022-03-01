import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { Asset3DService } from './../asset_3d/asset_3d.service';
import { AssetClassificationService } from './../asset_classification/asset_classification.service';
import { AssetSubSystemService } from './../asset_sub_system/asset_sub_system.service';
import { AssetSystemService } from './../asset_system/asset_system.service';
import { AssetUDSService } from './../asset_uds/asset_uds.service';
import { BuildingService } from './../building/building.service';
import { DepartmentService } from './../department/department.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { RoomTypeService } from './../room-type/room-type.service';
import { SorService } from './../sor/sor.service';
import { SorTypeService } from './../sor_type/sor_type.service';
import { UnitService } from './../unit_of_measurement/unit.service';
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
		private readonly roomTypeService: RoomTypeService,
		private readonly roomInformationService: RoomInformationService,
		private readonly unitService: UnitService,
		private readonly sorTypeService: SorTypeService,
		private readonly sorService: SorService,
		private readonly asset3DService: Asset3DService,
		private readonly assetSystemService: AssetSystemService,
		private readonly assetSubSystemService: AssetSubSystemService,
		private readonly assetUDSService: AssetUDSService,
		private readonly assetClassificationService: AssetClassificationService
	) { }

	/**
	 * IMPORTANT: move all levels to TOP
	 */
	@Get('import_location')
	async importRoomInformation(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/Block1A.xlsx');
			const wb = XLSX.readFile(_file);
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
				const _n_name = String(_obj['Name']).trim();
				const _n_room_number = String(_obj['Number']).trim();
				const _n_area = _obj['Area'];
				const _n_department = String(_obj['Department/School']).trim();
				const _n_room_type = String(_obj['Room Type']).trim();
				const _n_unit_number = String(_obj['Unit Number']).trim();
				const _n_lease = String(_obj['Lease (Y/N)']).trim();
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
									slug_name: _n_parent_location,
									room_name: _n_parent_location
								})
							}
						}
						_asset_location = await this.assetLocationService.create({
							building_id: 1,
							parent_id: _parent ? _parent.id : null,
							room_number: _n_location,
							slug_name: _n_location + ' (' + _n_name + ')',
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

	@Get('import_asset_3d')
	async importAsset3D(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/TP_AIR\ Information_Blk\ 1A.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
			let wsData = XLSX.utils.sheet_to_json(ws);

			const importData = [];
			const _asset_locations = []
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
				const _n_type_description = String(_obj['Equipment Type/Description']).trim();
				const _n_quantity = String(_obj['Quantity']).trim();
				const _n_room_number = String(_obj['Room Number']).trim();
				const _n_room_name = String(_obj['Room Name']).trim();
				const _n_equipment_label = String(_obj['Equipment Label']).trim();
				const _n_onsite_equipment_label = String(_obj['Onsite Equipment Label']).trim();
				const _n_control_panel = String(_obj['Control Panel']).trim();
				const _n_brand = String(_obj['Brand']).trim();
				const _n_equipment_model = String(_obj['Equipment Model']).trim();
				const _n_capacity = String(_obj['Capacity']).trim();
				const _n_serial_number = _obj['Serial Number'];
				const _n_installation_date = _obj['Installation Date'];
				const _n_warranty_expire_date = _obj['Warranty Expire Date'];
				const _n_sub_contract = _obj['Sub-Contractor '];
				const _n_pic = _obj['Person-in-charge'];
				const _n_email = _obj['Email'];
				const _n_contract_no = _obj['Contact No.'];
				// console.log("🚀  Location", _n_room_number);

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
									slug_name: _n_parent_location,
									room_name: _n_parent_location
								})
							}
						}
						_asset_location = await this.assetLocationService.create({
							building_id: 1,
							parent_id: _parent ? _parent.id : null,
							room_number: _n_location,
							slug_name: _n_location + ' (' + _n_room_name + ')',
							room_name: _n_room_name
						})
					}

					_asset_locations.push(_asset_location);
				}

				//-----------Location END----------------

				//------------Asset System------------------
				let _system = _systems.find(x => x.name === _n_system);
				if (!_system) {
					_system = await this.assetSystemService.findOne({ name: _n_system })
					if (!_system) {
						_system = await this.assetSystemService.create({ name: _n_system });
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
					}
					_classifications.push(_classification)
				}
				//------------Asset Classification END ----------------

				importData.push({
					zone_id: 1,
					building_id: 1,
					asset_location_id: _asset_location.id,
					asset_system_id: _system.id,
					asset_subsystem_id: _sub_system.id,
					asset_classification_id: _classification.id,
					equipment_type_description: _n_type_description,
					quantity: _n_quantity,
					equipment_label: _n_equipment_label,
					onsite_equipment_label: _n_onsite_equipment_label,
					control_panel: _n_control_panel,
					brand: _n_brand,
					equipment_model: _n_equipment_model,
					capacity: _n_capacity ? _n_capacity : null,
					serial_number: _n_serial_number ? _n_serial_number : null,
					installation_date: _n_installation_date ? _n_installation_date : null,
					warranty_expire_date: _n_warranty_expire_date ? _n_warranty_expire_date : null,
					sub_contractor: _n_sub_contract ? _n_sub_contract : null,
					person_in_charge: _n_pic ? _n_pic : null,
					email: _n_email ? _n_email : null,
					contact_number: _n_contract_no ? _n_contract_no : null
				});
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _rom_info = await this.asset3DService.create(data);
				console.log("🚀 IMPORTED", "");
			}
			console.log("🚀 IMPORT DONE.", "");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}
}
