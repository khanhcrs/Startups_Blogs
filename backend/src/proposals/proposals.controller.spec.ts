import type { AuthenticatedRequest } from '../auth/auth.types';
import type { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';

describe('ProposalsController authenticated identity', () => {
  const getMyProposals = jest.fn();
  const getProposal = jest.fn();
  const approveProposal = jest.fn();
  const rejectProposal = jest.fn();
  const controller = new ProposalsController({
    getMyProposals,
    getProposal,
    approveProposal,
    rejectProposal,
  } as unknown as ProposalsService);
  const request = {
    user: { userId: 'database-owner-id' },
  } as unknown as AuthenticatedRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses userId for listing the owner proposals', async () => {
    getMyProposals.mockResolvedValue([]);

    await controller.getMyProposals(request);

    expect(getMyProposals).toHaveBeenCalledWith('database-owner-id');
  });

  it('uses userId for reading, approving and rejecting a proposal', async () => {
    getProposal.mockResolvedValue({});
    approveProposal.mockResolvedValue({});
    rejectProposal.mockResolvedValue({});

    await controller.getProposal('proposal-id', request);
    await controller.approveProposal('proposal-id', request);
    await controller.rejectProposal('proposal-id', request);

    expect(getProposal).toHaveBeenCalledWith(
      'proposal-id',
      'database-owner-id',
    );
    expect(approveProposal).toHaveBeenCalledWith(
      'proposal-id',
      'database-owner-id',
    );
    expect(rejectProposal).toHaveBeenCalledWith(
      'proposal-id',
      'database-owner-id',
    );
  });
});
