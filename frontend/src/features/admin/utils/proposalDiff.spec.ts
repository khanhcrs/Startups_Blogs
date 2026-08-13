import { describe, expect, it } from 'vitest';
import { createProposalDiff } from './proposalDiff';

describe('createProposalDiff', () => {
  it('returns only changed allowlisted fields', () => {
    expect(
      createProposalDiff(
        { title: 'Old', content: '<p>same</p>', viewCount: 12 },
        { title: 'New', content: '<p>same</p>', viewCount: 99 },
        ['title', 'content'],
      ),
    ).toEqual({ title: 'New' });
  });

  it('compares arrays and objects by value', () => {
    expect(
      createProposalDiff(
        { tags: ['a', 'b'], metadata: { featured: true } },
        { tags: ['a', 'b'], metadata: { featured: true } },
        ['tags', 'metadata'],
      ),
    ).toEqual({});
  });

  it('does not emit undefined because JSON requests would silently omit it', () => {
    expect(
      createProposalDiff(
        { website: 'https://example.com' },
        { website: undefined },
        ['website'],
      ),
    ).toEqual({});
  });
});
