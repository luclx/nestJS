import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'RoomType' })
export class RoomType extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;
}
