import { renderHook } from '@testing-library/react-native';
import { useCachedQuery } from '../../../lib/queryCache';
import { useHabitNamePlaceholder } from './useHabitNamePlaceholder';

jest.mock('../../../lib/queryCache', () => ({
  useCachedQuery: jest.fn(),
}));

describe('useHabitNamePlaceholder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCachedQuery as jest.Mock).mockReturnValue(undefined);
  });

  it('skips catalog/habits queries while the add-habit flow is closed', () => {
    renderHook(() => useHabitNamePlaceholder(false));

    expect(useCachedQuery).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      'skip',
      { entryName: 'templates.list' }
    );
    expect(useCachedQuery).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      'skip',
      { entryName: 'habits.list' }
    );
    expect(useCachedQuery).toHaveBeenNthCalledWith(
      3,
      expect.anything(),
      'skip',
      { entryName: 'templates.getImportedTemplateIds' }
    );
  });
});
