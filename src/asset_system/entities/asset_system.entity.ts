import { AbstractEntity } from "../../common/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'AssetSystem' })
export class AssetSystemEntity extends AbstractEntity {

  @Column({ type: 'varchar', length: 100 })
  name: string;

}
