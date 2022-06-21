import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity({ name: 'Asset' })
export class AssetEntity extends AbstractEntity {

  @Column({ type: 'bigint' })
  building_id: number;

  @Column({ type: 'bigint' })
  asset_location_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  equipment: string;

  @Column({ type: 'varchar', length: 200})
  equipment_no: string;
 
  @Column({ type: 'smallint', default: 0})
  quantity: number;
  
  @Column({ type: 'bigint' })
  asset_classification_id: number;

  @Column({ type: 'bigint' })
  zone_id: number;

  @Column({ type: 'varchar', length: 100})
  tower: string;

  @Column({ type: 'varchar', length: 100})
  level: string;

  @Column({ type: 'varchar', length: 200})
  onsite_equipment: string;

  @Column({ type: 'varchar', length: 200})
  control_panel: string;

  @Column({ type: 'varchar', length: 200})
  brand: string;

  @Column({ type: 'varchar', length: 200})
  brand_model_no: string;
  
  @Column({ type: 'text'})
  details: string;
  
  @Column({ type: 'time without time zone', nullable: true })
  installation_date: string;
  
  @Column({ type: 'time without time zone', nullable: true })
  warranty_expire_date: string;


  @Column({ type: 'varchar', length: 200})
  sub_contractor: string;

  @Column({ type: 'varchar', length: 200})
  pic: string;

  @Column({ type: 'varchar', length: 100})
  email: string;


  @Column({ type: 'varchar', length: 100})
  contact_no: string;


  @Column({ type: 'varchar', length: 100})
  asset_no: string;

  @Column({ type: 'text'})
  qr_code: string;
}
