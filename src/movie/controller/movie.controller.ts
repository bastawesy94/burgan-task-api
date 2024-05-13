import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MovieI } from '../models/movie.interface';
import { MovieService } from '../service/movie.service';

@Controller('movies')
export class MovieController {

    constructor(private movieService: MovieService) {}

    @Get()
    findAll(@Req() request): Observable<MovieI[]> {
        return this.movieService.findAll();
    }

}
