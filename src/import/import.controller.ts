import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomType3DService } from '../room-type-3d/room-type-3d.service';
import { AssetLocationService } from './../asset-location/asset-location.service';
import { AssetLocationEntity } from './../asset-location/entities/asset-location.entity';
import { AssetService } from './../asset/asset.service';
import { Asset3DService } from './../asset_3d/asset_3d.service';
import { AssetClassificationService } from './../asset_classification/asset_classification.service';
import { AssetSubSystemService } from './../asset_sub_system/asset_sub_system.service';
import { AssetSystemService } from './../asset_system/asset_system.service';
import { AssetUDSService } from './../asset_uds/asset_uds.service';
import { BuildingService } from './../building/building.service';
import { CADService } from './../cad/cad.service';
import { DepartmentService } from './../department/department.service';
import { FacilityTypeService } from './../facility_type/facility_type.service';
import { FaultCategoryService } from './../fault_category/fault_category.service';
import { FaultTypeService } from './../fault_type/fault_type.service';
import { RoomInformationService } from './../room-information/room-information.service';
import { SorService } from './../sor/sor.service';
import { SorTypeService } from './../sor_type/sor_type.service';
import { UDSService } from './../uds/uds.service';
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
		private readonly facilityTypeService: FacilityTypeService,
		private readonly udsService: UDSService,
		private readonly cadService: CADService,
		private readonly faultCategoryService: FaultCategoryService,
		private readonly faultTypeService: FaultTypeService,
		private readonly assetService: AssetService
	) { }

	readonly _asset_locations = []
	async findOrCreate(parent_location, new_location, room_name, block_id) {

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
					building_id: block_id,
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

	async findBlockId(block) {
		switch (block) {
			case '01':
				return 92
			case '04':
				return 95
			case '05':
				return 96
			default:
			// code block
		}
	}

	pad(d): string {
		return (d < 10) ? '0' + d.toString() : d.toString();
	}

	/** 
	 * IMPORTANT: move all levels to TOP
	 */
	@Get('import_room_information')
	async importRoomInformation(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/import_3d/Room_09.xlsx');
			const block_id = 83
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

				if (!_n_room_type) {
					throw Error("Cannot _n_room_type " + i)
				}

				if (!_n_department) {
					throw Error("Cannot _n_department " + i)
				}

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
					_asset_location = await this.findOrCreate(paren_location, new_location, name, block_id)
				}

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
			const _file = path.resolve('/Users/luc.le/S3/sor_handled/15_2\ MEP\ SOR\ Corr.1/ACMV\ Combined\ SOR\ Corr.1.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[6]];
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

				if (isNaN(_n_unit_price)) {
					throw new Error("Bad request");
				}

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
			console.log("🚀 ~ Import DATA DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}

	@Get('import_asset_3d')
	async importAsset3D(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/import_3d/AIRInformation_09.xlsx');
			const zone_id = 6;
			const block_id = 83;
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
				const _n_system = _obj['System'];
				const _n_sub_system = _obj['Sub-System'];
				const _n_classification = _obj['Classification'];
				const _n_type_description = _obj['Equipment Type / Description'];
				const _n_room_number = _obj['Room Number'];
				const _n_room_name = _obj['Room Name'];
				const _n_mark = _obj['Mark'];
				const _n_onsite_equipment_label = _obj['Onsite Equipment Label'];
				const _n_control_panel = _obj['Control Panel'];
				const _n_brand = _obj['Brand'];
				const _n_equipment_model = _obj['Equipment Model'];
				const _n_capacity = _obj['Capacity'];
				const _n_serial_number = _obj['Serial Number'];
				const _n_installation_date = _obj['Installation Date'];
				const _n_warranty_expire_date = _obj['Warranty Expiry Date'];
				// console.log("🚀  Location", _n_room_number);

				if (!_n_system) {
					throw Error("Missing _n_system " + i)
				}
				if (!_n_sub_system) {
					throw Error("Missing _n_sub_system " + i)
				}
				if (!_n_classification) {
					throw Error("Missing _n_classification " + i)
				}
				if (!_n_type_description) {
					throw Error("Missing _n_type_description " + i)
				}
				if (!_n_mark) {
					throw Error("Missing _n_mark " + i)
				}

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
					_asset_location = await this.findOrCreate(paren_location, new_location, name, block_id)
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
					zone_id: zone_id,
					building_id: block_id,
					asset_system_id: _system.id,
					asset_subsystem_id: _sub_system.id,
					asset_location_id: _asset_location.id,
					asset_classification_id: _classification.id,
					equipment_type_description: _n_type_description ? _n_type_description : null,
					quantity: 1,
					equipment_model: _n_equipment_model ? _n_equipment_model : null,
					onsite_equipment_label: _n_onsite_equipment_label ? _n_onsite_equipment_label : null,
					control_panel: _n_control_panel ? _n_control_panel : null,
					brand: _n_brand ? _n_brand : null,
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
				// console.log("🚀  OBJ", _obj);
				const _n_mark = String(_obj['Mark']).trim();
				const _n_pipe = String(_obj['Pipe']).trim();
				const markArr = _n_mark.split(",")

				const uds = await this.udsService.create({ pipes: _n_pipe });
				for (let j = 0; j < markArr.length; j++) {
					let _asset3D = await this.asset3DService.findOne({ mark: markArr[j].trim() })

					if (_asset3D) {
						console.log("🚀 MARK ADDED ", _asset3D.mark);
						importData.push({
							asset_3d_id: _asset3D.id,
							uds_id: uds.id
						});
					} else {
						console.log("🚀 MARK MISSING ", markArr[j]);
					}
				}
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const assetUDS = await this.assetUDSService.findOne({ asset_3d_id: data.asset_3d_id })
				if (assetUDS) {
					console.log("🚀 UDS MARK EXISTING", assetUDS.asset_3d_id);
				} else {
					const _uds = await this.assetUDSService.create(data);
					console.log("🚀 IMPORTED UDS MARK", _uds.asset_3d_id);
				}
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

	@Get('import_urn')
	async importURN(): Promise<void> {
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
				const _location = String(_obj['A']).trim();
				const _urn = String(_obj['A']).trim();
				const _mep_urn = String(_obj['A']).trim();

				let _asset_location = await this.assetLocationService.findOne({ room_number: _location })

				if (_asset_location) {
					_asset_location.adsk_urn = _urn
					_asset_location.adsk_mep_urn = _mep_urn
				} else {
					console.log("🚀 MISSING LOCATION", _location);
				}

			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _location = await this.assetLocationService.create(data);
				console.log("🚀 IMPORTED TYPE: ", _location.room_number);
			}
			console.log("🚀 ~ Import DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}

	@Get('import_cab')
	async importCAD(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/S3/import_3d/TP_Blk\ 9_Drawing\ Information\ List.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[1]];
			const urn = wb.Sheets[wb.SheetNames[2]];
			let wsData = XLSX.utils.sheet_to_json(ws);
			let urnData = XLSX.utils.sheet_to_json(urn);

			const importData = [];
			const _URNs = []

			urnData = urnData.map(item => {
				let _obj = {}
				Object.keys(item).map(key => {
					_obj[key.replace('*', '').trim()] = typeof item[key] === 'string' ? item[key].trim() : item[key]
				});
				return _obj;
			});

			wsData = wsData.map(item => {
				let _obj = {}
				Object.keys(item).map(key => {
					_obj[key.replace('*', '').trim()] = typeof item[key] === 'string' ? item[key].trim() : item[key]
				});
				return _obj;
			});

			for (let i = 0; i < urnData.length; i++) {
				const _obj = urnData[i];
				const _n_name = String(_obj['Name']).trim();
				const _n_urn = String(_obj['URN']).trim();

				_URNs.push({
					name: _n_name,
					urn: _n_urn
				});
			}
			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				const _n_mark = _obj['Mark'];
				const _n_cad1 = _obj['CAD1'];
				const _n_cad2 = _obj['CAD2'];

				if (_n_cad1) {
					const urn = _URNs.find(x => x.name === _n_cad1.trim());
					const asset3D = await this.asset3DService.findOne({ mark: _n_mark })
					if (asset3D) {
						importData.push({
							asset_3d_id: asset3D.id,
							file_name: urn.name,
							urn: urn.urn
						});
					} else {
						console.log("🚀 MISSING ASSET MARK", _n_mark);
					}
				}

				if (_n_cad2) {
					const urn = _URNs.find(x => x.name === _n_cad2.trim());
					const asset3D = await this.asset3DService.findOne({ mark: _n_mark })
					if (asset3D) {
						importData.push({
							asset_3d_id: asset3D.id,
							file_name: urn.name,
							urn: urn.urn
						});
					} else {
						console.log("🚀 MISSING ASSET MARK", _n_mark);
					}
				}
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const cad = await this.cadService.create(data);
				console.log("🚀 IMPORTED ASSET CAD", cad);
			}
			console.log("🚀 IMPORT DONE.");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}

	@Get('import_category_type')
	async importCateGory(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/Downloads/Asset_Template_IWS_ConnectionOne.xlsx');
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[3]];
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
			const _categories = [];

			for (let i = 0; i < wsData.length; i++) {
				const _obj = wsData[i];
				const _n_category = String(_obj['A']).trim();
				const _n_type = String(_obj['B']).trim();

				let _category = _categories.find(x => x.name === _n_category);
				if (!_category) {
					_category = await this.faultCategoryService.findOne({ name: _n_category })
					if (!_category) {
						_category = await this.faultCategoryService.create({
							subscription_id: 1,
							name: _n_category,
							severity_id: 3,
							trade_naming_code: _n_category.substring(0, 3)
						});
						console.log("🚀 IMPORTED FAULT CATEGORY", _n_category);
					}
					_categories.push(_category)
				}

				importData.push({
					fault_category_id: _category.id,
					severity_id: 3,
					name: _n_type
				});
			}

			console.log("🚀 ~ Import DATA");
			for (const data of importData) {
				const _sor = await this.faultTypeService.create(data);
				console.log("🚀 IMPORTED FAULT TYPE", _sor.id);
			}
			console.log("🚀 ~ Import DATA DONE");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err);
		}
	}

	@Get('import_asset')
	async importAsset(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/Downloads/Asset_Template\ \(3\).xlsx');
			const zone_id = 6;
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[0]];
			let wsData = XLSX.utils.sheet_to_json(ws);

			const importData = [];
			const _systems = []
			const _sub_systems = []

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
				const _n_system = _obj['System'];
				const _n_sub_system = _obj['Sub-System'];
				const _n_equipment_type_description = _obj['Equipment Type / Description'];
				const _n_quantity = _obj['Quantity'];
				const _n_tower = _obj['Tower'];
				const _n_level = _obj['Level'];
				const _n_room_number = _obj['Room Number'];
				const _n_room_name = _obj['Room Name'];
				const _n_equipment_label = _obj['Equipment Label'];
				const _n_onsite_equipment_label = _obj['Onsite Equipment Label'];
				const _n_control_panel = _obj['Control Panel'];
				const _n_brand = _obj['Brand'];
				const _n_equipment_model = _obj['Equipment Model'];
				// console.log("🚀  Location", _n_room_number);

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
					const block_id = await this.findBlockId(building_num);
					console.log("🚀 Location", block_id);
					// the last always is our target
					_asset_location = await this.findOrCreate(paren_location, new_location, name, block_id)
				}
				if (!_asset_location) {
					throw Error("Cannot import room: " + _n_room_number)
				}

				//------------Asset Classification Type------------------
				let _classification = _systems.find(x => x.name === _n_system);
				if (!_classification) {
					_classification = await this.assetClassificationService.findOne({ name: _n_system })
					if (!_classification) {
						_classification = await this.assetClassificationService.create({ name: _n_system });
						console.log("🚀 IMPORTED CLASSIFICATION", _classification.name);
					}
					_systems.push(_classification)
				}
				//------------Asset Classification END ----------------


				//------------Asset Sub Classification Type------------------
				let _sub_classification = _sub_systems.find(x => x.name === _n_sub_system);
				if (!_sub_classification) {
					_sub_classification = await this.assetClassificationService.findOne({ name: _n_sub_system })
					if (!_sub_classification) {
						_sub_classification = await this.assetClassificationService.create({
							name: _n_sub_system,
							parent_id: _classification.id
						});
						console.log("🚀 IMPORTED SUB CLASSIFICATION", _sub_classification.name);
					}
					_sub_systems.push(_sub_classification)
				}
				//------------Asset Sub Classification END ----------------

				//-----------Location END----------------

				importData.push({
					building_id: _asset_location.building_id,
					asset_location_id: _asset_location.id,
					asset_classification_id: _sub_classification.id,
					zone_id: zone_id,
					equipment: _n_equipment_type_description,
					quantity: _n_quantity ? _n_quantity : 1,
					tower: _n_tower,
					level: _n_level,
					equipment_no: _n_equipment_label,
					onsite_equipment: _n_onsite_equipment_label ? _n_onsite_equipment_label : null,
					control_panel: _n_control_panel ? _n_control_panel : null,
					brand: _n_brand ? _n_brand : null,
					brand_model_no: _n_equipment_model ? _n_equipment_model : null,
					details: null,
					installation_date: null,
					warranty_expire_date: null,
					sub_contractor: null,
					pic: null,
					email: null,
					contact_no: null,
					qr_code: null,
					asset_no: null,
					status: 'Commissioned',
					attachments: null
				});
			}

			console.log("🚀 ~ STARTED Import DATA");
			for (const data of importData) {
				const _asset_info = await this.assetService.create(data);
				console.log("🚀 IMPORTED ASSET EQUIPMENT", _asset_info.equipment_no);
			}
			console.log("🚀 IMPORT DONE.", "");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}

	@Get('import_asset_sj_campus')
	async importAssetSJCampus(): Promise<void> {
		try {
			const _file = path.resolve('/Users/luc.le/Downloads/Asset_Template_IWS_ConnectionOne_V2.xlsx');
			const zone_id = 6;
			const wb = XLSX.readFile(_file);
			const ws = wb.Sheets[wb.SheetNames[0]];
			let wsData = XLSX.utils.sheet_to_json(ws);

			const importData = [];
			const _systems = []
			const _sub_systems = []

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
				const _n_system = _obj['System'];
				const _n_sub_system = _obj['Sub-System'];
				const _n_quantity = _obj['Quantity'];
				const _n_tower = _obj['Tower'];
				const _n_level = _obj['Level'];
				const _n_room_name = _obj['Room Name'];
				const _n_location = _obj['Location'];
				const _n_equipment_label = _obj['Equipment Label'];
				const _n_brand = _obj['Brand'];
				const _n_equipment_model = _obj['Equipment Model'];
				const _n_asset_no = _obj['Asset No.'];

				//---------------Location--------------
				const towerArr = _n_tower.split(' ').map(x => x.trim()).filter(x => x)
				const levelArr = _n_level.split(' ').map(x => x.trim()).filter(x => x)
				const building_num = this.pad(towerArr[1])
				const level = this.pad(levelArr[1])
				const locationArr = [building_num, level, _n_room_name]
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

					const block_id = await this.findBlockId(building_num);
					console.log("🚀 Location", block_id);
					// the last always is our target
					_asset_location = await this.findOrCreate(paren_location, new_location, _n_location, block_id)
				}
				if (!_asset_location) {
					throw Error("Cannot import room: " + locationArr[0] + "-" + locationArr[1] + "-" + locationArr[2])
				}

				//------------Asset Classification Type------------------
				let _classification = _systems.find(x => x.name === _n_system);
				if (!_classification) {
					_classification = await this.assetClassificationService.findOne({ name: _n_system })
					if (!_classification) {
						_classification = await this.assetClassificationService.create({ name: _n_system });
						console.log("🚀 IMPORTED CLASSIFICATION", _classification.name);
					}
					_systems.push(_classification)
				}
				//------------Asset Classification END ----------------


				//------------Asset Sub Classification Type------------------
				let _sub_classification = _sub_systems.find(x => x.name === _n_sub_system);
				if (!_sub_classification) {
					_sub_classification = await this.assetClassificationService.findOne({ name: _n_sub_system })
					if (!_sub_classification) {
						_sub_classification = await this.assetClassificationService.create({
							name: _n_sub_system,
							parent_id: _classification.id
						});
						console.log("🚀 IMPORTED SUB CLASSIFICATION", _sub_classification.name);
					}
					_sub_systems.push(_sub_classification)
				}
				//------------Asset Sub Classification END ----------------

				//-----------Location END----------------

				importData.push({
					building_id: _asset_location.building_id,
					asset_location_id: _asset_location.id,
					asset_classification_id: _sub_classification.id,
					zone_id: zone_id,
					equipment: null,
					quantity: _n_quantity ? _n_quantity : 1,
					tower: _n_tower,
					level: _n_level,
					equipment_no: _n_equipment_label,
					onsite_equipment: null,
					control_panel: null,
					brand: _n_brand ? _n_brand : null,
					brand_model_no: _n_equipment_model ? _n_equipment_model : null,
					details: null,
					installation_date: null,
					warranty_expire_date: null,
					sub_contractor: null,
					pic: null,
					email: null,
					contact_no: null,
					qr_code: null,
					asset_no: _n_asset_no ? _n_asset_no : null,
					status: 'Commissioned',
					attachments: null
				});
			}

			console.log("🚀 ~ STARTED Import DATA");
			for (const data of importData) {
				const _asset_info = await this.assetService.create(data);
				console.log("🚀 IMPORTED ASSET EQUIPMENT", _asset_info.equipment_no);
			}
			console.log("🚀 IMPORT DONE.", "");
		} catch (err) {
			console.log("🚀 ~ file: ImportService.js ERROR", err)
		}
	}
}
