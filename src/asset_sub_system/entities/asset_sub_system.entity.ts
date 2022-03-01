import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";

@Entity({ name: 'AssetSubSystem' })
export class AssetSubSystemEntity extends AbstractEntity {

  @Column({ type: 'bigint', nullable: true })
  asset_system_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

}
