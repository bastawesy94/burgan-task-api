import { Test, TestingModule } from '@nestjs/testing';
import { WatchListService } from './watchList.service';

describe('WatchListService', () => {
  let service: WatchListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchListService],
    }).compile();

    service = module.get<WatchListService>(WatchListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
