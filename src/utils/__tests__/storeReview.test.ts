/**
 * Store Review Utility Tests
 * Tests for managing store review prompts and eligibility checks
 */

import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  incrementCompletionCount,
  maybeRequestReview,
  maybeRequestReviewFromAnalytics,
} from '../storeReview';

jest.mock('expo-store-review');
jest.mock('@react-native-async-storage/async-storage');
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('storeReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('incrementCompletionCount', () => {
    it('returns 1 for first completion', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await incrementCompletionCount();

      expect(result).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('increments count on subsequent calls', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await incrementCompletionCount();

      expect(result).toBe(6);
    });

    it('returns 0 on storage error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const result = await incrementCompletionCount();

      expect(result).toBe(0);
    });

    it('returns 0 if setItem fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Write error')
      );

      const result = await incrementCompletionCount();

      expect(result).toBe(0);
    });

    it('handles string to number conversion', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('10');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await incrementCompletionCount();

      expect(result).toBe(11);
    });
  });

  describe('maybeRequestReview', () => {
    it('does not request review for non-eligible milestone', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

      await maybeRequestReview(5);

      expect(StoreReview.requestReview).not.toHaveBeenCalled();
    });

    it('requests review for milestone 7 days', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await maybeRequestReview(7);

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });

    it('requests review for milestone 14 days', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await maybeRequestReview(14);

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });

    it('requests review for milestone 30 days', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await maybeRequestReview(30);

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });

    it('does not request review when store review not available', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      await maybeRequestReview(7);

      expect(StoreReview.requestReview).not.toHaveBeenCalled();
    });

    it('does not request review when insufficient completions', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2');
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

      await maybeRequestReview(7);

      expect(StoreReview.requestReview).not.toHaveBeenCalled();
    });
  });

  describe('maybeRequestReviewFromAnalytics', () => {
    it('requests review when performance meets criteria', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await maybeRequestReviewFromAnalytics(80, 5);

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });

    it('does not request review when completion rate too low', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

      await maybeRequestReviewFromAnalytics(60, 5);

      expect(StoreReview.requestReview).not.toHaveBeenCalled();
    });

    it('does not request review when too few habits', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);

      await maybeRequestReviewFromAnalytics(80, 2);

      expect(StoreReview.requestReview).not.toHaveBeenCalled();
    });

    it('requests review at exactly 70% completion rate', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await maybeRequestReviewFromAnalytics(70, 3);

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });

    it('handles perfect completion rate (100%)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (StoreReview.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (StoreReview.requestReview as jest.Mock).mockResolvedValue(undefined);

      await maybeRequestReviewFromAnalytics(100, 10);

      expect(StoreReview.requestReview).toHaveBeenCalled();
    });
  });
});
