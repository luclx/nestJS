import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity({ name: 'Occupancy' })
export class OccupancyEntity extends AbstractEntity {

  @Column({ type: 'varchar' })
  device_id: string;

  @Column({ type: 'varchar' })
  room_id: number;

  @Column({ type: 'int' })
  cumulative_activity: number;

  @Column({ type: 'varchar' })
  message_type: string;

  @Column({ type: 'boolean' })
  occupancy: boolean;

  @Column({ type: 'int' })
  period_activity: number;

  @Column({ type: 'int' })
  state_changed: number;

  @Column({ type: 'int' })
  version: number;
}
