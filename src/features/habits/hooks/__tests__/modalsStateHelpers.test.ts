import { shouldLoadModalTracking } from '../modalsStateHelpers';

const closedVisibility = {
  isHabitCalendarOpen: false,
  isHabitDetailOpen: false,
  showEditScreen: false,
  showQuickActions: false,
};

describe('shouldLoadModalTracking', () => {
  it('keeps modal-only tracking disabled while its consumers are closed', () => {
    expect(shouldLoadModalTracking(closedVisibility)).toBe(false);
  });

  it.each([
    'isHabitCalendarOpen',
    'isHabitDetailOpen',
    'showEditScreen',
    'showQuickActions',
  ] as const)('enables tracking for %s', (visibilityKey) => {
    expect(
      shouldLoadModalTracking({
        ...closedVisibility,
        [visibilityKey]: true,
      })
    ).toBe(true);
  });
});
