import { Column, Entity } from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";

@Entity({ name: 'UDS' })
export class UDSEntity extends AbstractEntity {
  @Column({ type: 'text', nullable: true })
  pipes: string;
}
