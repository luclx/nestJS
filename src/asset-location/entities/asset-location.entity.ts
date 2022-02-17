import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './../../common/abstract.entity';

@Entity({ name: 'AssetLocation' })
export class AssetLocationEntity extends AbstractEntity {

  // @ManyToOne(_type => BuildingEntity, _building => _building.id)
  // @JoinColumn({ name: 'building_id' })
  // building: BuildingEntity;
  @Column({ type: 'bigint' })
  building_id: number;

  @Column({ type: 'bigint' })
  parent_id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  room_number: string;

  @Column({ type: 'varchar', length: 200 })
  slug_name: string;

  @Column({ type: 'varchar', length: 200 })
  room_name: string;

  @Column({ type: 'varchar', length: 255 })
  adsk_object_id: string;

  @Column({ type: 'varchar', length: 255 })
  adsk_urn: string;

  @Column({ type: 'varchar', length: 255 })
  adsk_mep_urn: string;
}
