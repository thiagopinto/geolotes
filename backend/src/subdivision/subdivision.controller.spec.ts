import { Test, TestingModule } from '@nestjs/testing';
import { SubdivisionController } from './subdivision.controller';
import { SubdivisionService } from './subdivision.service';

describe('SubdivisionController', () => {
  let controller: SubdivisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubdivisionController],
      providers: [SubdivisionService],
    }).compile();

    controller = module.get<SubdivisionController>(SubdivisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
