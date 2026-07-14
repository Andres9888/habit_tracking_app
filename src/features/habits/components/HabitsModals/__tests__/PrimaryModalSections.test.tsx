import React from 'react';
import { render } from '@testing-library/react-native';

import type { HabitsModalsProps } from '../HabitsModals.types';

jest.mock('../HabitsModals.lazy', () => {
  const ReactActual = require('react');
  const { Text } = require('react-native');

  return {
    CalendarAndDetailModals: () =>
      ReactActual.createElement(Text, null, 'Calendar modal'),
    HapticTestModalSection: () =>
      ReactActual.createElement(Text, null, 'Haptic modal'),
    SettingsModalSection: ReactActual.lazy(() => new Promise(() => {})),
  };
});

import { PrimaryModalSections } from '../PrimaryModalSections';

describe('PrimaryModalSections', () => {
  it('shows a Settings shell immediately while the Settings section chunk loads', () => {
    const state = {
      archivedHabitsCount: 0,
      celebrationsEnabled: true,
      closeSettings: jest.fn(),
      isSettingsModalLoading: true,
      onSettingsChange: jest.fn(),
      openHapticTest: jest.fn(),
      setShowHabitStrengthPercentage: jest.fn(),
      settings: undefined,
      showEditScreen: false,
      showHabitCalendar: false,
      showHabitDetail: false,
      showHabitStrengthPercentage: false,
      showHapticTest: false,
      showSettings: true,
    } as unknown as HabitsModalsProps['state'];

    const { getByTestId } = render(<PrimaryModalSections state={state} />);

    expect(getByTestId('settings-modal-loading-fallback')).toBeTruthy();
  });
});
