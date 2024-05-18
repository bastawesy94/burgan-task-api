import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WatchListService } from '../service/watch-list.service';
import { WatchListEntity } from '../models/watch-list.entity';

@Controller('watchList')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}

  @Get()
  findAll(): Observable<any[]> {
    return this.watchListService.findAll();
  }
  @Post()
  async addToWatchList(@Body() createWatchListDto: any): Promise<WatchListEntity> {
    return this.watchListService.addToWatchList(createWatchListDto);
  }
}
