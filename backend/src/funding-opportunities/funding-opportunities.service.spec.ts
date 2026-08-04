import { Test, TestingModule } from '@nestjs/testing';
import { FundingOpportunitiesService } from './funding-opportunities.service';

describe('FundingOpportunitiesService', () => {
  let service: FundingOpportunitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FundingOpportunitiesService],
    }).compile();

    service = module.get<FundingOpportunitiesService>(FundingOpportunitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
