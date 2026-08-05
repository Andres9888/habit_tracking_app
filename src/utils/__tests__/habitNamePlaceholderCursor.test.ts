import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getHabitNamePlaceholderCursor,
  setHabitNamePlaceholderCursor,
} from '../habitNamePlaceholderCursor';

describe('habitNamePlaceholderCursor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('persists the cursor to AsyncStorage', async () => {
    await setHabitNamePlaceholderCursor({
      libraryTemplateId: 'template-1',
      staticName: null,
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@habit_app:habit_name_placeholder_cursor',
      JSON.stringify({
        libraryTemplateId: 'template-1',
        staticName: null,
      })
    );
  });

  it('reads a stored cursor from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ libraryTemplateId: 'template-2', staticName: 'Walk' })
    );

    await expect(getHabitNamePlaceholderCursor()).resolves.toEqual({
      libraryTemplateId: 'template-2',
      staticName: 'Walk',
    });
  });
});
