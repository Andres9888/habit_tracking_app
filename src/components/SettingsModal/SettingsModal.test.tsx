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

jest.mock('@clerk/expo', () => ({
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

jest.mock('../../lib/performance/settingsOpenTiming', () => ({
  clearSettingsOpenTiming: jest.fn(),
  markSettingsOpenContentReady: jest.fn(),
  markSettingsOpenFirstVisible: jest.fn(),
}));

import {
  markSettingsOpenContentReady,
  markSettingsOpenFirstVisible,
} from '../../lib/performance/settingsOpenTiming';
import { SettingsModalLoadingFallback } from './components/SettingsModalFallback';
import SettingsModal from './SettingsModal';

describe('SettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('marks first visible and content ready once after loading resolves', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <SettingsModal isLoading onClose={onClose} visible />
    );

    expect(markSettingsOpenFirstVisible).toHaveBeenCalledWith({
      isLoading: true,
    });
    expect(markSettingsOpenContentReady).not.toHaveBeenCalled();

    rerender(
      <SettingsModal
        archivedHabitsCount={3}
        isPremium
        onClose={onClose}
        visible
      />
    );
    expect(markSettingsOpenContentReady).toHaveBeenCalledWith({
      archivedHabitsCount: 3,
      isPremium: true,
    });

    rerender(
      <SettingsModal archivedHabitsCount={4} onClose={onClose} visible />
    );
    expect(markSettingsOpenContentReady).toHaveBeenCalledTimes(1);
  });

  it('renders the loading shell used by lazy Settings boundaries', () => {
    const { getByTestId } = render(
      <SettingsModalLoadingFallback onClose={() => {}} visible />
    );

    expect(getByTestId('settings-modal-loading-fallback')).toBeTruthy();
  });
});
