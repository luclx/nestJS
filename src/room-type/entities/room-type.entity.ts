import { AbstractEntity } from './../../common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'RoomType' })
export class RoomTypeEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;
}
