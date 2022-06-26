import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SorEntity } from './entities/sor.entity';
import { SorService } from './sor.service';
@Module({
  imports: [TypeOrmModule.forFeature([SorEntity])],
  controllers: [],
  providers: [SorService],
  exports: [SorService]
})
export class SorModule { }
