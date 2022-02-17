import { AbstractEntity } from "./../../common/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: 'Building' })
export class BuildingEntity extends AbstractEntity {
  @Column({ type: 'bigint' })
  subscription_id: number;

  @Column({ type: 'varchar', length: 10 })
  energy_id: string;

  @Column({ type: 'varchar', length: 255 })
  adsk_object_id: string

  @Column({ type: 'varchar', length: 255 })
  adsk_urn: string

  @Column({ type: 'varchar', length: 255 })
  adsk_mep_urn: string
}
