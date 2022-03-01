import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";

@Entity({ name: 'AssetUDS' })
export class AssetUDSEntity extends AbstractEntity {

  @Column({ type: 'bigint' })
  asset_3d_id: number;

  @Column({ type: 'text' })
  pipes: string;
}
