import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { UserModule } from '../../user/user.module';
import { WatchListModule } from '../../watch-list/watch-list.module';
import { UserEntity } from '../../user/models/user.entity';
import { MovieEntity } from '../models/movie.entity';

describe('MovieController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [UserEntity,MovieEntity],
      imports: [AppModule,UserModule,WatchListModule],
      exports: [UserEntity,MovieEntity]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET movies', async () => {
    const response = await request(app.getHttpServer()).get('/movies');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/GET movies/search', async () => {
    const response = await request(app.getHttpServer())
      .get('/movies/search')
      .query({ page: 1, limit: 8, genre: 'Drama-Mystery' });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
