import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";

@Entity({ name: 'FacilityType' })
export class FacilityTypeEntity extends AbstractEntity {

  @Column({ type: 'varchar', length: 150 })
  name: string;

}
