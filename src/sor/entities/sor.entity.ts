import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './../../common/abstract.entity';

@Entity({ name: 'SORItem' })
export class SorEntity extends AbstractEntity {

  @Column({ type: 'varchar', length: 50 })
  item_no: string;

  @Column({ type: 'bigint' })
  unit_of_measurement_id: number;

  @Column({ type: 'bigint' })
  sor_type_id: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'numeric' })
  unit_price: number;
}
