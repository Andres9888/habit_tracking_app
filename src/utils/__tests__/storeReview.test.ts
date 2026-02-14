import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

import { incrementCompletionCount, maybeRequestReview } from '../storeReview';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('storeReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000_000_000);
    (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('increments count safely when stored completion count is malformed', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not-a-number');

    const count = await incrementCompletionCount();

    expect(count).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@store_review_completion_count',
      '1'
    );
  });

  it('treats malformed last prompt timestamp as expired cooldown', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('5')
      .mockResolvedValueOnce('invalid-timestamp');

    await maybeRequestReview(7);

    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@store_review_last_prompt',
      '1000000000000'
    );
  });
});
