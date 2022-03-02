import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetLocationModule } from './asset-location/asset-location.module';
import { Asset3DModule } from './asset_3d/asset_3d.module';
import { AssetSubSystemModule } from './asset_sub_system/asset_sub_system.module';
import { AssetSystemModule } from './asset_system/asset_system.module';
import { AssetUDSModule } from './asset_uds/asset_uds.module';
import { AuthModule } from './auth/auth.module';
import { BuildingModule } from './building/building.module';
import { DepartmentModule } from './department/department.module';
import { FacilityTypeModule } from './facility_type/facility_type.module';
import { ImportModule } from './import/import.module';
import { RoomInformationModule } from './room-information/room-information.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { UsersModule } from './users/users.module';
import { WarrantyTypeModule } from './warranty_type/warranty_type.module';

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
    AuthModule,
    BuildingModule,
    RoomTypeModule,
    AssetLocationModule,
    DepartmentModule,
    RoomInformationModule,
    ImportModule,
    Asset3DModule,
    AssetSystemModule,
    AssetSubSystemModule,
    AssetUDSModule,
    WarrantyTypeModule,
    FacilityTypeModule
    // SharedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
