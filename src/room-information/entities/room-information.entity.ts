import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './../../common/abstract.entity';

@Entity({ name: 'RoomInformation' })
export class RoomInformationEntity extends AbstractEntity {

  // @OneToOne(type => AssetLocationEntity, assetLocation => assetLocation.id)
  // @JoinColumn({ name: 'asset_location_id' })
  // assetLocation: number;
  @Column({ type: 'bigint' })
  asset_location_id: number;

  @Column({ type: 'numeric' })
  area: number;

  @Column({ type: 'bigint' })
  department_id: number;

  @Column({ type: 'bigint' })
  room_type_id: number;

  @Column({ type: 'varchar', length: 50 })
  unit_number: string;

  @Column({ type: 'boolean' })
  lease: boolean;
}
