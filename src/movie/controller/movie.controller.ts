import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MovieI } from '../models/movie.interface';
import { MovieService } from '../service/movie.service';
import { MovieSearchDTO } from '../models/dto/MovieSearchDTO';
import { MovieEntity } from '../models/movie.entity';

@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get()
  findAll(): Observable<MovieI[]> {
    return this.movieService.findAll();
  }
  //example
  //http://localhost:3000/movies/search/?page=1&limit=8&genre=Drama-Mystery
  @Get('/search')
  async searchMovies(
    @Query() searchDTO: MovieSearchDTO,
  ): Promise<MovieEntity[]> {
    return await this.movieService.searchMovies(searchDTO);
  }
}
