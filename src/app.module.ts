import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { MovieModule } from './movie/movie.module';

dotenv.config();
console.log("##############",process.env.DB_URL);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
      synchronize: true,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')]
    }),
    UserModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
