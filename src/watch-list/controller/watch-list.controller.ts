import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WatchListService } from '../service/watch-list.service';

@Controller('watchLists')
export class WatchListController {

    constructor(private watchListService: WatchListService) {}

    @Get()
    findAll(@Req() request): Observable<any[]> {
        return this.watchListService.findAll();
    }

}
