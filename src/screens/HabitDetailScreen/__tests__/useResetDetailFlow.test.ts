import { renderHook } from '@testing-library/react-native';
import { useResetDetailFlow } from '../useResetDetailFlow';

describe('useResetDetailFlow', () => {
  it('resets on reopen, not while the modal is still sliding out', () => {
    const reset = jest.fn();
    const { rerender } = renderHook(
      ({ visible }: { visible: boolean }) =>
        useResetDetailFlow(reset, visible, 'habit_1'),
      { initialProps: { visible: true } }
    );
    reset.mockClear();
    rerender({ visible: false });
    expect(reset).not.toHaveBeenCalled();
    rerender({ visible: true });
    expect(reset).toHaveBeenCalledTimes(1);
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
