'use strict';
import {
	Column,
	BeforeInsert,
	BeforeUpdate,
	PrimaryColumn,
	PrimaryGeneratedColumn
} from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';

export abstract class AbstractEntity {
	@PrimaryColumn()
	@PrimaryGeneratedColumn()
	@Exclude()
	id: number;

	@Column({ name: "createdAt" })
	created_at: Date;

	@Column({ name: "updatedAt" })
	updated_at: Date;

	// toDto(options?: any) {
	//     return UtilsService.toDto(this.dtoClass, this, options);
	// }

	@BeforeInsert()
	public setCreateDate(): void {
		this.created_at = new Date();
		this.updated_at = new Date();
	}

	@BeforeUpdate()
	public setUpdateDate(): void {
		this.updated_at = new Date();
	}

	toJSON() {
		return classToPlain(this);
	}
}
