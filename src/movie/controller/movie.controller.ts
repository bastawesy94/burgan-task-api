import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { MovieI } from '../models/movie.interface';
import { MovieSearchDTO } from '../models/dto/MovieSearchDTO';
import { MovieEntity } from '../models/movie.entity';
import { MovieService } from '../service/movie.service';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({ status: 200, description: 'Returns all movies.' })
  findAll(): Observable<MovieI[]> {
    return this.movieService.findAll();
  }
  
  @Get('/search')
  @ApiOperation({ summary: 'Search movies' })
  @ApiResponse({ status: 200, description: 'Returns the search results.' })
  @ApiQuery({ name: 'title', required: false, description: 'Movie title' })
  @ApiQuery({ name: 'director', required: false, description: 'Movie director' })
  @ApiQuery({ name: 'year', required: false, description: 'Movie year' })
  @ApiQuery({ name: 'country', required: false, description: 'Movie country' })
  @ApiQuery({ name: 'genre', required: false, description: 'Movie genre' })
  @ApiQuery({ name: 'color', required: false, description: 'Movie color' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page' })
  async searchMovies(
    @Query() searchDTO: MovieSearchDTO,
  ): Promise<MovieEntity[]> {
    return await this.movieService.searchMovies(searchDTO);
  }
}
