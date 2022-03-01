import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";

@Entity({ name: 'AssetClassification' })
export class AssetClassificationEntity extends AbstractEntity {

  @Column({ type: 'bigint' , nullable : true })
  parent_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

}
