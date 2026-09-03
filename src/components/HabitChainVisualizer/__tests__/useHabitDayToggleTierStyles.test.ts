import { renderHook } from '@testing-library/react-native';

import { useAnimatedTier } from '@/hooks/useAnimatedTier';
import { useHabitDayToggleTierStyles } from '../useHabitDayToggleTierStyles';

const ACCENT = '#3B82F6';

function renderStyles(strength: number, showCompletedShadow = true) {
  return renderHook(() => {
    const tierAnim = useAnimatedTier(strength);
    return useHabitDayToggleTierStyles({
      accentColor: ACCENT,
      isToday: false,
      showCompletedShadow,
      tierAnim,
    });
  });
}

describe('useHabitDayToggleTierStyles', () => {
  it('renders the accent tier fill and border', () => {
    expect(renderStyles(30).result.current.cellStyle).toMatchObject({
      backgroundColor: ACCENT,
      borderColor: ACCENT,
    });
  });

  it('preserves the legendary platinum fill and gold border', () => {
    expect(renderStyles(80).result.current.cellStyle).toMatchObject({
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
          isToday: false,
          showCompletedShadow: true,
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

  it('drops the completed glow when the cell is not completed', () => {
    expect(renderStyles(80, false).result.current.shadowStyle).toMatchObject({
      elevation: 0,
      shadowOpacity: 0,
      shadowRadius: 0,
    });
  });
});
