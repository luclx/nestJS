import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { PetModule } from './pet/pet.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    PetModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
