import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { WatchListEntity } from '../models/watch-list.entity';

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchListEntity)
    private watchListRepository: Repository<WatchListEntity>,
  ) {}

  findAll(): Observable<any[]> {
    //need handle dto
    return from(this.watchListRepository.find());
  }
}
