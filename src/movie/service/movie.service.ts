import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { MovieEntity } from '../models/movie.entity';
import { MovieI } from '../models/movie.interface';

@Injectable()
export class MovieService {

    constructor(
        @InjectRepository(MovieEntity)
        private movieRepository: Repository<MovieEntity>,
    ) { }


    findAll(): Observable<MovieI[]> {
        return from(this.movieRepository.find());
    }
}
