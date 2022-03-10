import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./../../common/abstract.entity";

@Entity({ name: 'WarrantyType' })
export class WarrantyTypeEntity extends AbstractEntity {

  @Column({ type: 'varchar', length: 150 })
  name: string;

}
