import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { MovieModule } from './movie/movie.module';
import { WatchListModule } from './watch-list/watch-list.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import * as dotenv from 'dotenv';

dotenv.config();
console.log('##############', process.env.DB_URL);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    UserModule,
    MovieModule,
    WatchListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
