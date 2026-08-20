import { renderHook } from '@testing-library/react-native';
import { useResetDetailFlow } from '../useResetDetailFlow';

describe('useResetDetailFlow', () => {
  it('resets when the modal hides', () => {
    const reset = jest.fn();
    const { rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useResetDetailFlow(reset, visible, 'habit_1'),
      { initialProps: { visible: true } }
    );
    reset.mockClear();
    rerender({ visible: false });
    expect(reset).toHaveBeenCalled();
  });

  it('resets when the habit changes', () => {
    const reset = jest.fn();
    const { rerender } = renderHook(
      ({ habitId }: { habitId: string }) =>
        useResetDetailFlow(reset, true, habitId),
      { initialProps: { habitId: 'habit_1' } }
    );
    reset.mockClear();
    rerender({ habitId: 'habit_2' });
    expect(reset).toHaveBeenCalled();
  });
});
