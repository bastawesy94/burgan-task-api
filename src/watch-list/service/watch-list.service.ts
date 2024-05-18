import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { WatchListEntity } from '../models/watch-list.entity';
import { UserEntity } from '@src/user/models/user.entity';
import { MovieEntity } from '@src/movie/models/movie.entity';
import { CreateWatchListDto } from '../models/dto/CreateWatchList.dto';

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchListEntity)
    private watchListRepository: Repository<WatchListEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  findAll(): Observable<any[]> {
    //need handle dto
    return from(this.watchListRepository.find());
  }

  async addToWatchList(createWatchListDto: CreateWatchListDto): Promise<WatchListEntity> {
    const { userId, movieId } = createWatchListDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const watchList = new WatchListEntity();
    watchList.user = user;
    watchList.movie = movie;

    return this.watchListRepository.save(watchList);
  }
}
