import { clearSessionData } from '../../../../providers/OfflineProvider/clearSessionData';
import { getQueryCacheScope, setQueryCacheScope } from '../keys';

jest.mock('../../../../lib/offline/persistence', () => ({
  clearLegacyQueueState: jest.fn().mockResolvedValue(undefined),
  clearQueueState: jest.fn().mockResolvedValue(undefined),
}));

describe('clearSessionData query-cache scope', () => {
  it('does not clobber the active query cache scope', async () => {
    setQueryCacheScope('user_456');

    await clearSessionData('user_123');

    expect(getQueryCacheScope()).toBe('user_456');
  });
});
