import { AbstractEntity } from "../../common/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'UnitOfMeasurement' })
export class UnitOfMeasurementEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string
}
