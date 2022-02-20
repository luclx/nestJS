import { AbstractEntity } from "../../common/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'SORType' })
export class SorTypeEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string
}
