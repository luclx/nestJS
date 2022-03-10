import { AbstractEntity } from '../../common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: '3DRoomType' })
export class RoomType3DEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;
}
