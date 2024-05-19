import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { WatchListEntity } from '../models/watch-list.entity';
import { UserEntity } from '../../user/models/user.entity';
import { MovieEntity } from '../../movie/models/movie.entity';
import { CreateWatchListDto } from '../models/dto/CreateWatchList.dto';
import axios from 'axios';
import * as dotenv from 'dotenv';
import datasource from '@src/datasource.config';

dotenv.config();

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchListEntity)
    private watchListRepository: Repository<WatchListEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) { }

  findAll(): Observable<any[]> {
    return from(
      this.watchListRepository
        .createQueryBuilder('watchList')
        .leftJoinAndSelect('watchList.user', 'user')
        .leftJoinAndSelect('watchList.movie', 'movie')
        .select('user.id', 'userId')
        .addSelect('movie.id', 'movieId')
        .addSelect('movie.title', 'movieTitle')
        .groupBy('user.id, movie.id, movie.title')
        .getRawMany(),
    ).pipe(
      map(results => {
        const usersMap = {};
        results.forEach(result => {
          const userId = result.userId;
          if (!usersMap[userId]) {
            usersMap[userId] = {
              userId: userId,
              movies: []
            };
          }
          usersMap[userId].movies.push({
            movieId: result.movieId,
            movieTitle: result.movieTitle
          });
        });
        return Object.values(usersMap);
      })
    );
  }

  async addToWatchList(createWatchListDto: CreateWatchListDto): Promise<WatchListEntity> {
    const { userId, movieId } = createWatchListDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    const watchlistEntry = new WatchListEntity();
    watchlistEntry.user = user;
    watchlistEntry.movie = movie;

    const existingEntry = await this.watchListRepository.findOne({ where: { user, movie } });
    console.log("existingEntry --->",existingEntry)
    if (existingEntry) {
      throw new ConflictException('This movie is already in the user\'s watch list');
    }

    console.log("watchlistEntry--->", watchlistEntry)
    return await this.watchListRepository.save(watchlistEntry);
  }

  async addValueToMyWatchList(userBody: any) {
    const { userId } = userBody;
    // Fetch all movies in the user's watchlist
    const userWatchList = await this.watchListRepository.find({
      where: { user: { id: userId } },
      relations: ['movie'],
    });
    console.log("userWatchList ==>", userWatchList)
    for (const entry of userWatchList) {
      const movieTitle = entry.movie.title;
      try {

        const tmdbResponse = await axios.get(
          `${process.env.THE_MOVIE_DB_URL}/search/movie?query=${encodeURIComponent(movieTitle)}&api_key=${process.env.THE_MOVIE_DB_API_KEY}`
        );
        console.log("tmdbResponse -------->", tmdbResponse);
        const movieData = tmdbResponse.data.results[0];
        if (movieData) {
          entry.movie.adult = movieData.adult;
          entry.movie.overview = movieData.overview;
          entry.movie.poster_path = movieData.poster_path;
          entry.movie.vote_average = movieData.vote_average;
          entry.movie.vote_count = movieData.vote_count;
          entry.movie.popularity = movieData.popularity;

          await this.movieRepository.save(entry.movie);
        }
      }
      catch (err) {
        console.log(err);
      }
    }
  }
  async getWatchListByUserId(userId: number): Promise<WatchListEntity[]> {
    return this.watchListRepository.find({
      where: { user: { id: userId } },
      relations: ['movie'],
    });
  }
}
