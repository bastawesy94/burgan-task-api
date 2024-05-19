import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchListService } from './watch-list.service';
import { WatchListEntity } from '../models/watch-list.entity';
import { UserEntity } from '../../user/models/user.entity';
import { MovieEntity } from '../../movie/models/movie.entity';
import { ConflictException } from '@nestjs/common';
import { CreateWatchListDto } from '../models/dto/CreateWatchList.dto';
import axios from 'axios';

jest.mock('axios');

describe('WatchListService', () => {
  let service: WatchListService;
  let watchListRepository: Repository<WatchListEntity>;
  let userRepository: Repository<UserEntity>;
  let movieRepository: Repository<MovieEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchListService,
        {
          provide: getRepositoryToken(WatchListEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MovieEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WatchListService>(WatchListService);
    watchListRepository = module.get<Repository<WatchListEntity>>(getRepositoryToken(WatchListEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToWatchList', () => {
    it('should add a movie to the watchlist', async () => {
      const createWatchListDto: CreateWatchListDto = { userId: 1, movieId: 1 };
      const user = new UserEntity();
      const movie = new MovieEntity();
      const watchListEntry = new WatchListEntity();
      watchListEntry.user = user;
      watchListEntry.movie = movie;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(movie);
      jest.spyOn(watchListRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(watchListRepository, 'save').mockResolvedValue(watchListEntry);

      expect(await service.addToWatchList(createWatchListDto)).toEqual(watchListEntry);
    });

    it('should throw conflict exception if movie is already in watchlist', async () => {
      const createWatchListDto: CreateWatchListDto = { userId: 1, movieId: 1 };
      const user = new UserEntity();
      const movie = new MovieEntity();
      const watchListEntry = new WatchListEntity();
      watchListEntry.user = user;
      watchListEntry.movie = movie;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(movie);
      jest.spyOn(watchListRepository, 'findOne').mockResolvedValue(watchListEntry);

      await expect(service.addToWatchList(createWatchListDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('addValueToMyWatchList', () => {
    it('should update movies in watchlist with additional information', async () => {
      const userId = 1;
      const userWatchList = [
        { movie: { title: 'Test Movie', id: 1 } },
      ];
      const movieData = {
        adult: false,
        overview: 'Test Overview',
        poster_path: '/test.jpg',
        vote_average: 8.5,
        vote_count: 100,
        popularity: 10.0,
      };

      jest.spyOn(watchListRepository, 'find').mockResolvedValue(userWatchList as any);
      (axios.get as jest.Mock).mockResolvedValue({ data: { results: [movieData] } });
      jest.spyOn(movieRepository, 'save').mockResolvedValue(null);

      await service.addValueToMyWatchList({ userId });

      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.THE_MOVIE_DB_URL}/search/movie?query=Test%20Movie&api_key=${process.env.THE_MOVIE_DB_API_KEY}`
      );
      expect(movieRepository.save).toHaveBeenCalledWith({
        ...userWatchList[0].movie,
        ...movieData,
      });
    });

    it('should log error if axios request fails', async () => {
      const userId = 1;
      const userWatchList = [
        { movie: { title: 'Test Movie', id: 1 } },
      ];

      jest.spyOn(watchListRepository, 'find').mockResolvedValue(userWatchList as any);
      (axios.get as jest.Mock).mockRejectedValue(new Error('API Error'));
      jest.spyOn(console, 'log').mockImplementation(() => {});

      await service.addValueToMyWatchList({ userId });

      expect(console.log).toHaveBeenCalledWith(new Error('API Error'));
    });
  });
});
