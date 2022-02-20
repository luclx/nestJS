import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingEntity } from './../building/entities/building.entity';
import { SorRepository } from './sor.repository';
import { SorService } from './sor.service';
@Module({
  imports: [TypeOrmModule.forFeature([SorRepository, BuildingEntity])],
  controllers: [],
  providers: [SorService],
  exports: [SorService]
})
export class AssetLocationModule { }
