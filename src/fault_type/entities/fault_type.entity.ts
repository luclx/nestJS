import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { FaultCategoryEntity } from './../../fault_category/entities/fault_category.entity';

@Entity({ name: 'FaultType' })
export class FaultTypeEntity extends AbstractEntity {

  @Column({ type: 'bigint' })
  fault_category_id: number;

  @OneToOne(_type => FaultCategoryEntity, _object => _object.id)
  @JoinColumn({ name: 'fault_category_id' })
  fault_category: FaultCategoryEntity;

  @Column({ type: 'bigint', default: 3 })
  severity_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;
}
