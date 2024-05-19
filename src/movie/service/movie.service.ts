import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { MovieEntity } from '../models/movie.entity';
import { MovieI } from '../models/movie.interface';
import { MovieSearchDTO } from '../models/dto/MovieSearchDTO';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  findAll(): Observable<MovieI[]> {
    return from(this.movieRepository.find());
  }

  async searchMovies(searchDTO: MovieSearchDTO): Promise<any> {
    const { title, director, page, year, country, genre, color, limit } =
      searchDTO;
    const cacheKey = `movies_${title}_${director}_${year}_${country}_${genre}_${color}_${page}_${limit}`;
    const cachedMovies = await this.cacheManager.get<{
      data: MovieEntity[];
      total: number;
    }>(cacheKey);

    if (cachedMovies) {
      console.log('Result comes from redis cache ..', cachedMovies);
      return cachedMovies;
    }

    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    if (title) {
      queryBuilder.andWhere('movie.title LIKE :title', { title: `%${title}%` });
    }
    if (director) {
      queryBuilder.andWhere('movie.director LIKE :director', {
        director: `%${director}%`,
      });
    }
    if (year) {
      queryBuilder.andWhere('movie.year = :year', { year });
    }
    if (country) {
      queryBuilder.andWhere('movie.country LIKE :country', {
        country: `%${country}%`,
      });
    }
    if (genre) {
      queryBuilder.andWhere('movie.genre LIKE :genre', { genre: `%${genre}%` });
    }
    if (color) {
      queryBuilder.andWhere('movie.colour LIKE :colour', {
        colour: `%${color}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = { data, total, page };
    await this.cacheManager.set(cacheKey, result, { ttl: Number(process.env.REDIS_TTL) }); 


    return result;
  }
}
