import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { UserEntity } from '../models/user.entity';
import { UserI } from '../models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', done => {
      const userArray: any[] = [
        { id: 1, userName: 'test1', password: 'test1' },
        { id: 2, userName: 'test2', password: 'test2' },
      ];

      jest.spyOn(userRepository, 'find').mockReturnValue(Promise.resolve(userArray));

      service.findAll().subscribe((users) => {
        expect(users).toEqual(userArray);
        done();
      });
    });
  });
});
