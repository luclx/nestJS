import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity({ name: 'AssetCADDrawing' })
export class CADEntity extends AbstractEntity {
  
  @Column({ type: 'bigint' })
  asset_3d_id: number;

  @Column({ type: 'varchar', length: 255 })
  urn: string;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;
}
