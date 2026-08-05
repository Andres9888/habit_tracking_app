import {
  buildContinuationArgs,
  resolveRecalculateStaleArgs,
} from './recalcStaleArgs';

describe('recalculate stale strength args', () => {
  it('threads the same cutoff through continuation pages', () => {
    const resolved = resolveRecalculateStaleArgs(
      { batchSize: 2, cutoff: 12345, staleAfterMs: 1000 },
      { batchSize: 100, cutoff: 99999, staleAfterMs: 2000 }
    );

    expect(buildContinuationArgs(resolved, 'cursor_2')).toEqual({
      batchSize: 2,
      cursor: 'cursor_2',
      cutoff: 12345,
      staleAfterMs: 1000,
    });
  });
});
