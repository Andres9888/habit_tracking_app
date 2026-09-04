import { act, renderHook } from '@testing-library/react-native';
import { useDetailPushTransition } from '../useDetailPushTransition';

// Note: the jest reanimated mock resolves withTiming to its target value
// synchronously and never invokes the finished callback, so the exit path's
// runOnJS(unmount) never fires in this environment. We assert the enter path
// (and that exit doesn't unmount instantly) rather than the eventual
// post-animation unmount, per the mock's known limitation.
describe('useDetailPushTransition', () => {
  it('mounts immediately when visible starts true', () => {
    const { result } = renderHook(
      ({ visible }: { visible: boolean }) => useDetailPushTransition(visible),
      { initialProps: { visible: true } }
    );

    expect(result.current.mounted).toBe(true);
  });

  it('stays unmounted on first render when visible starts false', () => {
    const { result } = renderHook(
      ({ visible }: { visible: boolean }) => useDetailPushTransition(visible),
      { initialProps: { visible: false } }
    );

    expect(result.current.mounted).toBe(false);
  });

  it('mounts when visible flips true and exposes an onShow handler', () => {
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) => useDetailPushTransition(visible),
      { initialProps: { visible: false } }
    );

    rerender({ visible: true });
    expect(result.current.mounted).toBe(true);
    expect(typeof result.current.onShow).toBe('function');
    expect(() => act(() => result.current.onShow())).not.toThrow();
  });

  it('keeps mounted true immediately after visible flips false (exit animates first)', () => {
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) => useDetailPushTransition(visible),
      { initialProps: { visible: true } }
    );

    expect(result.current.mounted).toBe(true);
    rerender({ visible: false });
    expect(result.current.mounted).toBe(true);
  });
});
