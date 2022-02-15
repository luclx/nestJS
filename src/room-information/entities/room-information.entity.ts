import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AssetLocation } from './../../asset-location/entities/asset-location.entity';
import { Department } from './../../department/entities/department.entity';
import { RoomType } from './../../room-type/entities/room-type.entity';

@Entity({ name: 'RoomInformation' })
export class RoomInformation extends AbstractEntity {

  @OneToOne(type => AssetLocation, assetLocation => assetLocation.id)
  @JoinColumn({ name: 'asset_location_id' })
  assetLocation: number;

  @Column({ type: 'numeric' })
  area: number;

  @OneToOne(type => Department, department => department.id)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToOne(type => RoomType, room_type_id => room_type_id.id)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomType;

  @Column({ type: 'varchar', length: 50 })
  unit_number: string;

  @Column({ type: 'boolean' })
  lease: boolean;
}
