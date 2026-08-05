import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  return {
    ...Reanimated,
    getUseOfValueInStyleWarning: () => '',
  };
});

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        replayAsync: jest.fn(),
        unloadAsync: jest.fn(),
      }),
    },
  },
}));

jest.mock('@clerk/clerk-expo', () => ({
  useClerk: () => ({ signOut: jest.fn() }),
  useUser: () => ({
    user: {
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
    },
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: require('react-native').View,
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  it('renders redesigned settings sections when visible', () => {
    const { getByText, getByLabelText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    expect(getByText('Look & Feel')).toBeTruthy();
    expect(getByText('Habits')).toBeTruthy();
    expect(getByText('Archived habits')).toBeTruthy();
    expect(getByText('Export habits data')).toBeTruthy();
    expect(getByLabelText('Account settings')).toBeTruthy();
  });
});
