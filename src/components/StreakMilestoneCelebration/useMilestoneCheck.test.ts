import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import {
  checkAndTriggerMilestone,
  persistMilestoneShown,
} from './useMilestoneCheck';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-haptics', () => ({
  NotificationFeedbackType: { Success: 'success' },
  notificationAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('useMilestoneCheck storage guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('treats invalid JSON as empty state in checkAndTriggerMilestone', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('not-json');

    const milestone = await checkAndTriggerMilestone('habit-1', 6, 7);

    expect(milestone?.days).toBe(7);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
  });

  it('ignores non-array JSON in persistMilestoneShown', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{"days":7}');

    await persistMilestoneShown('habit-2', 30);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@chain_day:streak_milestones_shown:habit-2',
      JSON.stringify([30])
    );
  });

  it('filters invalid values from stored milestone arrays', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([7, '30', null, 100])
    );

    await persistMilestoneShown('habit-3', 30);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@chain_day:streak_milestones_shown:habit-3',
      JSON.stringify([7, 100, 30])
    );
  });
});
