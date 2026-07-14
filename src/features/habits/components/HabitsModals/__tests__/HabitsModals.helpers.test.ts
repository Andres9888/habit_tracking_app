import { getSettingsProps } from '../HabitsModals.helpers';
import type { HabitsModalsProps } from '../HabitsModals.types';

describe('HabitsModals helpers', () => {
  it('passes Settings loading state through to the Settings modal section', () => {
    const state = {
      archivedHabitsCount: 0,
      celebrationsEnabled: true,
      closeSettings: jest.fn(),
      isSettingsModalLoading: true,
      onSettingsChange: jest.fn(),
      openHapticTest: jest.fn(),
      setShowHabitStrengthPercentage: jest.fn(),
      settings: undefined,
      showHabitStrengthPercentage: false,
      showSettings: true,
    } as unknown as HabitsModalsProps['state'];

    expect(getSettingsProps(state)).toMatchObject({
      archivedHabitsCount: 0,
      isSettingsModalLoading: true,
      showSettings: true,
    });
  });
});
