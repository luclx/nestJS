import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";

@Entity({ name: 'FaultCategory' })
export class FaultCategoryEntity extends AbstractEntity {

  @Column({ type: 'bigint', default: 1 })
  subscription_id: number;

  @Column({ type: 'varchar', length: 75 })
  name: string;

  @Column({ type: 'smallint', default: 0 })
  priority: number;

  @Column({ type: 'bigint', default: 3 })
  severity_id: number;

  @Column({ type: 'varchar', length: 25})
  trade_naming_code: string
}
