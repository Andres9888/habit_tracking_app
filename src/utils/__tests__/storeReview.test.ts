import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { Alert, Linking } from 'react-native';
import { incrementCompletionCount, maybeRequestReview } from '../storeReview';

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(async () => true),
  requestReview: jest.fn(async () => undefined),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();

  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        store.set(key, value);
      }),
      clear: jest.fn(async () => {
        store.clear();
      }),
    },
  };
});

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    canOpenURL: jest.fn(async () => true),
    openURL: jest.fn(async () => undefined),
  },
}));

describe('storeReview', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('requests review when user is happy after a positive moment', async () => {
    for (let i = 0; i < 5; i += 1) {
      // Meet minimum completion requirement
      await incrementCompletionCount();
    }

    (Alert.alert as jest.Mock).mockImplementation(
      (_title: string, _message: string, buttons: Array<{ onPress?: () => void }>) => {
        buttons[1]?.onPress?.();
      }
    );

    await maybeRequestReview({ milestoneDays: 7, currentStreak: 7 });

    expect(StoreReview.requestReview).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('routes unhappy users to feedback instead of store review', async () => {
    for (let i = 0; i < 5; i += 1) {
      await incrementCompletionCount();
    }

    (Alert.alert as jest.Mock).mockImplementation(
      (_title: string, _message: string, buttons: Array<{ onPress?: () => void }>) => {
        buttons[0]?.onPress?.();
      }
    );

    await maybeRequestReview({ milestoneDays: 14, currentStreak: 14 });

    expect(StoreReview.requestReview).not.toHaveBeenCalled();
    expect(Linking.openURL).toHaveBeenCalledTimes(1);
  });

  it('stops prompting after 3 lifetime prompts', async () => {
    for (let i = 0; i < 5; i += 1) {
      await incrementCompletionCount();
    }

    (Alert.alert as jest.Mock).mockImplementation(
      (_title: string, _message: string, buttons: Array<{ onPress?: () => void }>) => {
        buttons[1]?.onPress?.();
      }
    );

    await maybeRequestReview({ milestoneDays: 7, currentStreak: 7 });

    await AsyncStorage.setItem('@store_review_last_prompt', '0');
    await maybeRequestReview({ milestoneDays: 14, currentStreak: 14 });

    await AsyncStorage.setItem('@store_review_last_prompt', '0');
    await maybeRequestReview({ milestoneDays: 30, currentStreak: 30 });

    await AsyncStorage.setItem('@store_review_last_prompt', '0');
    await maybeRequestReview({ milestoneDays: 7, currentStreak: 7 });

    expect(StoreReview.requestReview).toHaveBeenCalledTimes(3);
  });
});
