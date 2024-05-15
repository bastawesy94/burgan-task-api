import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListEntity } from './models/watch-list.entity';
import { WatchListService } from './service/watch-list.service';
import { WatchListController } from './controller/watch-list.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WatchListEntity])
  ],
  providers: [WatchListService],
  controllers: [WatchListController]
})
export class WatchListModule {}
