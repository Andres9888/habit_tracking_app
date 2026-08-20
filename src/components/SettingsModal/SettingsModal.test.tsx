import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  return {
    ...Reanimated,
    getUseOfValueInStyleWarning: () => '',
  };
});

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    addListener: jest.fn(),
    play: jest.fn(),
    remove: jest.fn(),
    volume: 1,
  })),
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
  it('renders redesigned settings sections when visible', async () => {
    const { getByText, getByLabelText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Look & Feel')).toBeTruthy());
    expect(getByText('Habits')).toBeTruthy();
    expect(getByText('Archived habits')).toBeTruthy();
    expect(getByLabelText('Account settings')).toBeTruthy();
  });

  it('groups sounds under Reminders and export under Habits', async () => {
    const { getByText, queryByText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Reminders')).toBeTruthy());
    expect(getByText('Streak reminders')).toBeTruthy();
    expect(getByText('Completion sound')).toBeTruthy();
    // 3B: the lone export row folded into Habits, killing its own card.
    expect(queryByText('Privacy & Security')).toBeNull();
    expect(getByText('Export my data')).toBeTruthy();
  });

  it('shows the live reminder value instead of marketing copy', async () => {
    const { getByText, queryByText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Streak reminders')).toBeTruthy());
    expect(getByText('Off')).toBeTruthy();
    expect(queryByText('Nudge before an active streak slips')).toBeNull();
  });

  it('keeps the sound picker collapsed until the row is tapped', async () => {
    const { getByText, queryByLabelText } = render(
      <SettingsModal completionSoundEnabled onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Completion sound')).toBeTruthy());
    expect(getByText('Chime')).toBeTruthy();
    expect(queryByLabelText('Pop sound')).toBeNull();

    fireEvent.press(getByText('Completion sound'));
    expect(queryByLabelText('Pop sound')).toBeTruthy();
  });

  it('merges Support advocacy and moves What’s new to the footer', async () => {
    const { getByText, queryByText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Support')).toBeTruthy());
    expect(getByText('Love Chain Day?')).toBeTruthy();
    expect(getByText('Send feedback')).toBeTruthy();
    expect(queryByText('Rate Chain Day')).toBeNull();
    expect(queryByText('Share with a friend')).toBeNull();
    expect(getByText("What's new")).toBeTruthy();
  });

  it('omits surfaces removed by the redesign and the prune pass', async () => {
    const { getByText, queryByText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Look & Feel')).toBeTruthy());
    // Stats/streak belong on a future Stats screen, not Settings.
    expect(queryByText(/day streak/i)).toBeNull();
    expect(queryByText('Export habits data')).toBeNull();
    // Growth icons: removal listed in the handoff README.
    expect(queryByText('Default growth icons')).toBeNull();
    // App lock: pulled until biometrics actually gate the app.
    expect(queryByText('App lock')).toBeNull();
  });

  it('keeps the sort picker collapsed until the row is tapped', async () => {
    const { getByText, queryByText } = render(
      <SettingsModal onClose={() => {}} visible />
    );

    await waitFor(() => expect(getByText('Sort order')).toBeTruthy());
    // Direction options only exist once the tray is open.
    expect(queryByText('A → Z')).toBeNull();
  });
});
