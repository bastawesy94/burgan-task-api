import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieEntity } from '../models/movie.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { MovieSearchDTO } from '../models/dto/MovieSearchDTO';
import { of } from 'rxjs';

const movieEntity = {
  id: 1,
  title: 'Test Movie',
  director: 'Test Director',
  year: 2020,
  country: 'Test Country',
  genre: 'Test Genre',
  colour: 'Test Colour',
} as unknown as MovieEntity;

const movieArray = [movieEntity];

const repositoryMock = {
  find: jest.fn().mockReturnValue(of(movieArray)),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([movieArray, 1]),
  })),
};

const cacheManagerMock = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('MovieService', () => {
  let service: MovieService;
  let repository: Repository<MovieEntity>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: repositoryMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repository = module.get<Repository<MovieEntity>>(
      getRepositoryToken(MovieEntity),
    );
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all movies', (done) => {
    service.findAll().subscribe((movies) => {
      expect(movies).toEqual(movieArray);
      done();
    });
  });

  it('should return cached movies if they exist', async () => {
    const searchDTO: MovieSearchDTO = {
      title: 'Test Movie',
      director: 'Test Director',
      page: 1,
      year: 2020,
      country: 'Test Country',
      genre: 'Test Genre',
      color: 'Test Colour',
      limit: 10,
    };

    const cacheKey = `movies_${searchDTO.title}_${searchDTO.director}_${searchDTO.year}_${searchDTO.country}_${searchDTO.genre}_${searchDTO.color}_${searchDTO.page}_${searchDTO.limit}`;
    const cachedMovies = { data: movieArray, total: 1 };

    cacheManagerMock.get.mockResolvedValue(cachedMovies);

    const result = await service.searchMovies(searchDTO);
    expect(result).toEqual(cachedMovies);
    expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
  });

  it('should query and cache movies if not cached', async () => {
    const searchDTO: MovieSearchDTO = {
      title: 'Test Movie',
      director: 'Test Director',
      page: 1,
      year: 2020,
      country: 'Test Country',
      genre: 'Test Genre',
      color: 'Test Colour',
      limit: 10,
    };

    const cacheKey = `movies_${searchDTO.title}_${searchDTO.director}_${searchDTO.year}_${searchDTO.country}_${searchDTO.genre}_${searchDTO.color}_${searchDTO.page}_${searchDTO.limit}`;
    const queryResult = { data: movieArray, total: 1, page: 1 };

    cacheManagerMock.get.mockResolvedValue(null);
    cacheManagerMock.set.mockResolvedValue(null);

    const result = await service.searchMovies(searchDTO);
    expect(result).toEqual(queryResult);
    expect(cacheManager.set).toHaveBeenCalledWith(
      cacheKey,
      queryResult,
      { ttl: 600 },
    );
  });
});
