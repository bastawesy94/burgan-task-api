import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { MovieEntity } from '../models/movie.entity';
import { MovieI } from '../models/movie.interface';
import { MovieSearchDTO } from '../models/dto/MovieSearchDTO';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  findAll(): Observable<MovieI[]> {
    return from(this.movieRepository.find());
  }

  async searchMovies(searchDTO: MovieSearchDTO): Promise<any> {
    const { title, director, page, year, country, genre, color, limit } =
      searchDTO;
    const pageNumber = page || 1;
    const limitNumber = limit || 10;

    const skip = (pageNumber - 1) * limitNumber;

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

    queryBuilder.skip(skip).take(limitNumber);

    const [items, count] = await queryBuilder.getManyAndCount();

    return { items, pageNumber, count };
  }
}
