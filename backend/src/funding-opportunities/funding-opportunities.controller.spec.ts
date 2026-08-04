import { Test, TestingModule } from '@nestjs/testing';
import { FundingOpportunitiesController } from './funding-opportunities.controller';

describe('FundingOpportunitiesController', () => {
  let controller: FundingOpportunitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FundingOpportunitiesController],
    }).compile();

    controller = module.get<FundingOpportunitiesController>(FundingOpportunitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
