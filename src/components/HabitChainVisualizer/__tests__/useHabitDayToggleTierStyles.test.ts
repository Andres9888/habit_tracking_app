import { renderHook } from '@testing-library/react-native';

import { useAnimatedTier } from '@/hooks/useAnimatedTier';
import { useHabitDayToggleTierStyles } from '../useHabitDayToggleTierStyles';

/**
 * Guards the worklet's reset branch: when a cell is uncompleted (or missed),
 * cellStyle must return the static colors so an always-attached animated
 * style snaps the cell back instead of leaving the last tier color painted.
 * The jest Reanimated mock executes worklets synchronously.
 */

const ACCENT = '#3B82F6';
const STATIC_BG = '#f5f5f5';
const STATIC_BORDER = '#78716c';

function renderTierStyles(overrides: {
  completed: boolean;
  missed?: boolean;
  strengthPercent?: number;
}) {
  return renderHook(() => {
    const tierAnim = useAnimatedTier(overrides.strengthPercent ?? 30);
    return useHabitDayToggleTierStyles({
      accentColor: ACCENT,
      completed: overrides.completed,
      isToday: false,
      missed: overrides.missed ?? false,
      showCompletedShadow: overrides.completed,
      staticBackground: STATIC_BG,
      staticBorder: STATIC_BORDER,
      tierAnim,
    });
  });
}

describe('useHabitDayToggleTierStyles', () => {
  it('returns the static reset colors when uncompleted', () => {
    const { result } = renderTierStyles({ completed: false });

    expect(result.current.cellStyle).toEqual({
      backgroundColor: STATIC_BG,
      borderColor: STATIC_BORDER,
    });
  });

  it('returns the static reset colors when missed', () => {
    const { result } = renderTierStyles({ completed: true, missed: true });

    expect(result.current.cellStyle).toEqual({
      backgroundColor: STATIC_BG,
      borderColor: STATIC_BORDER,
    });
  });

  it('returns tier colors when completed', () => {
    // strength 30 -> 'chain' tier, which uses the habit accent color
    const { result } = renderTierStyles({ completed: true });

    expect(result.current.cellStyle).toEqual({
      backgroundColor: ACCENT,
      borderColor: ACCENT,
    });
  });
});
