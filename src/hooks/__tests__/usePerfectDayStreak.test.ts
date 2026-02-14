/**
 * Tests for usePerfectDayStreak hook
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@perfect_day_streak';

describe('Perfect Day Streak Storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('should store and retrieve streak data', async () => {
    const data = {
      bestStreak: 3,
      currentStreak: 3,
      lastPerfectDate: '2026-02-14',
      totalPerfectDays: 5,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(stored!)).toEqual(data);
  });

  it('should handle missing data gracefully', async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    expect(stored).toBeNull();
  });
});
