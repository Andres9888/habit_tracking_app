import { renderHook } from '@testing-library/react-native';
import { useCardStrengthFill } from '../useCardStrengthFill';

jest.mock('../../../theme/ThemeContext', () => ({
  useThemeColors: () => ({ isDark: false }),
}));

describe('useCardStrengthFill', () => {
  it('paints the resting width on the first render', () => {
    // The first-render animated style is the snapshot Reanimated re-commits
    // on any later React render. If it starts at 0% and the settled entry is
    // dropped from the props registry, the fill vanishes after load.
    const { result } = renderHook(() => useCardStrengthFill(87, false));
    expect(result.current.strengthFillStyle).toEqual({ width: '87%' });
  });

  it('follows later strength changes', () => {
    const { result, rerender } = renderHook(
      ({ percent }: { percent: number }) => useCardStrengthFill(percent, false),
      { initialProps: { percent: 40 } }
    );
    rerender({ percent: 60 });
    expect(result.current.strengthFillStyle).toEqual({ width: '60%' });
  });
});
