import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity({ name: 'Asset3D' })
export class Asset3DEntity extends AbstractEntity {

  @Column({ type: 'bigint' })
  zone_id: number;

  @Column({ type: 'bigint' })
  building_id: number;

  @Column({ type: 'bigint' })
  asset_system_id: number;

  @Column({ type: 'bigint' })
  asset_subsystem_id: number;

  @Column({ type: 'bigint' })
  asset_classification_id: number;

  @Column({ type: 'bigint' })
  asset_location_id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  equipment_type_description: string;

  @Column({ type: 'smallint', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  equipment_label: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  onsite_equipment_label: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  control_panel: string;

  @Column({ type: 'varchar', length: 75, nullable: true })
  brand: string;

  @Column({ type: 'varchar', length: 75, nullable: true })
  equipment_model: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  capacity: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  serial_number: string;

  @Column({ nullable: true })
  installation_date: Date;

  @Column({ nullable: true })
  warranty_expire_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sub_contractor: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  person_in_charge: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact_number: string;
}
