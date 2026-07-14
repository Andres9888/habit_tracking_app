import { renderHook } from '@testing-library/react-native';

jest.mock('../../../lib/queryCache', () => ({
  useCachedQuery: jest.fn(),
}));

import { useCachedQuery } from '../../../lib/queryCache';
import { useWarmTemplatesCache } from '../useWarmTemplatesCache';

const mockCachedQuery = jest.mocked(useCachedQuery);

describe('useWarmTemplatesCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribes only while the Templates Library is visible', () => {
    const { rerender } = renderHook(
      ({ visible }) => useWarmTemplatesCache(visible),
      { initialProps: { visible: false } }
    );

    expect(mockCachedQuery).toHaveBeenCalledTimes(2);
    expect(mockCachedQuery).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'skip',
      { entryName: 'templates.list' }
    );
    expect(mockCachedQuery).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'skip',
      { entryName: 'templates.getImportedTemplateIds' }
    );

    mockCachedQuery.mockClear();
    rerender({ visible: true });

    expect(mockCachedQuery).toHaveBeenCalledTimes(2);
    expect(mockCachedQuery).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      {},
      { entryName: 'templates.list' }
    );
    expect(mockCachedQuery).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      {},
      { entryName: 'templates.getImportedTemplateIds' }
    );
  });
});
