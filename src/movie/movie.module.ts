import { Module } from '@nestjs/common';
import { MovieController } from './controller/movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './models/movie.entity';
import { MovieService } from './service/movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity])],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
