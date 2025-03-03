import { Test, TestingModule } from '@nestjs/testing';
import { SubdivisionService } from './subdivision.service';

describe('SubdivisionService', () => {
  let service: SubdivisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubdivisionService],
    }).compile();

    service = module.get<SubdivisionService>(SubdivisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
