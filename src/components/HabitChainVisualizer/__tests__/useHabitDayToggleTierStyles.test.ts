import { renderHook } from '@testing-library/react-native';
import type { SharedValue } from 'react-native-reanimated';

import { useAnimatedTier } from '@/hooks/useAnimatedTier';
import { useHabitDayToggleTierStyles } from '../useHabitDayToggleTierStyles';

const ACCENT = '#3B82F6';

function renderStyles(strength: number, completionValue: number, missed = false) {
  return renderHook(() => {
    const tierAnim = useAnimatedTier(strength);
    return useHabitDayToggleTierStyles({
      accentColor: ACCENT,
      completion: { value: completionValue } as SharedValue<number>,
      isToday: false,
      missed,
      showCompletedShadow: completionValue === 1,
      staticBackground: missed ? '#FEF2F2' : '#f5f5f5',
      staticBorder: missed ? '#DC2626' : '#78716c',
      tierAnim,
    });
  });
}

describe('useHabitDayToggleTierStyles', () => {
  it('renders incomplete and accent completion endpoints', () => {
    expect(renderStyles(30, 0).result.current.cellStyle).toMatchObject({
      backgroundColor: '#f5f5f5',
      borderColor: '#78716c',
    });
    expect(renderStyles(30, 1).result.current.cellStyle).toMatchObject({
      backgroundColor: ACCENT,
      borderColor: ACCENT,
    });
  });

  it('preserves missed colors regardless of completion progress', () => {
    expect(renderStyles(30, 1, true).result.current.cellStyle).toMatchObject({
      backgroundColor: '#FEF2F2',
      borderColor: '#DC2626',
    });
  });

  it('preserves the legendary platinum fill and gold border', () => {
    expect(renderStyles(80, 1).result.current.cellStyle).toMatchObject({
      backgroundColor: '#E5E7EB',
      borderColor: '#F2B84B',
    });
  });

  it('composes a completed tier crossing through the shared tier progress', () => {
    const view = renderHook(
      ({ strength }) => {
        const tierAnim = useAnimatedTier(strength);
        return useHabitDayToggleTierStyles({
          accentColor: ACCENT,
          completion: { value: 1 } as SharedValue<number>,
          isToday: false,
          missed: false,
          showCompletedShadow: true,
          staticBackground: '#f5f5f5',
          staticBorder: '#78716c',
          tierAnim,
        });
      },
      { initialProps: { strength: 30 } }
    );
    view.rerender({ strength: 80 });
    expect(view.result.current.cellStyle).toMatchObject({
      backgroundColor: '#E5E7EB',
      borderColor: '#F2B84B',
    });
  });
});
