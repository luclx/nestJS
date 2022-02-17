import { AbstractEntity } from './../../common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AssetLocationEntity } from './../../asset-location/entities/asset-location.entity';
import { DepartmentEntity } from './../../department/entities/department.entity';
import { RoomTypeEntity } from './../../room-type/entities/room-type.entity';

@Entity({ name: 'RoomInformation' })
export class RoomInformationEntity extends AbstractEntity {

  @OneToOne(type => AssetLocationEntity, assetLocation => assetLocation.id)
  @JoinColumn({ name: 'asset_location_id'})
  assetLocation: number;

  @Column({ type: 'numeric' })
  area: number;

  @OneToOne(type => DepartmentEntity, department => department.id)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @OneToOne(type => RoomTypeEntity, room_type_id => room_type_id.id)
  @JoinColumn({ name: 'room_type_id' })
  roomType: RoomTypeEntity;

  @Column({ type: 'varchar', length: 50 })
  unit_number: string;

  @Column({ type: 'boolean' })
  lease: boolean;
}
