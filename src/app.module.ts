import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetLocationModule } from './asset-location/asset-location.module';
import { AuthModule } from './auth/auth.module';
import { BuildingModule } from './building/building.module';
import { DepartmentModule } from './department/department.module';
import { ImportModule } from './import/import.module';
import { PetModule } from './pet/pet.module';
import { RoomInformationModule } from './room-information/room-information.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        autoLoadEntities: true,
        keepConnectionAlive: true,
        type: 'postgres',
        host: 'localhost',
        port: 1115,
        username: '',
        password: '',
        database: 'first_test',
        migrationsRun: false,
        ssl: false,
        entities: ["dist/**/*.entity.js"],
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    PetModule,
    AuthModule,
    BuildingModule,
    RoomTypeModule,
    AssetLocationModule,
    DepartmentModule,
    RoomInformationModule,
    ImportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
