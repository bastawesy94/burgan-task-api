import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListEntity } from './models/watch-list.entity';
import { WatchListService } from './service/watch-list.service';
import { WatchListController } from './controller/watch-list.controller';
import { UserEntity } from '../user/models/user.entity';
import { MovieEntity } from '@src/movie/models/movie.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([WatchListEntity, UserEntity, MovieEntity]),
  ],
  providers: [WatchListService],
  controllers: [WatchListController],
  exports: [WatchListService],
})
export class WatchListModule {}
