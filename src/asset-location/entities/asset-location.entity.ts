import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Building } from './../../building/entities/building.entity';
'use strict';

@Entity({ name: 'AssetLocation' })
export class AssetLocation extends AbstractEntity {

  @OneToOne(type => Building, building => building.id)
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @Column({ type: 'bigint' })
  parent_id: number

  @Column({ type: 'varchar', length: 200 })
  room_number: string;

  @Column({ type: 'varchar', length: 200 })
  slug_name: string

  @Column({ type: 'varchar', length: 200 })
  room_name: string

  @Column({ type: 'varchar', length: 255 })
  adsk_object_id: string

  @Column({ type: 'varchar', length: 255 })
  adsk_urn: string

  @Column({ type: 'varchar', length: 255 })
  adsk_mep_urn: string
}
