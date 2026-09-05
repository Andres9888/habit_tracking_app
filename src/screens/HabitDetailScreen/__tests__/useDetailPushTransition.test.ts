import { act, renderHook } from '@testing-library/react-native';
import { useDetailPushTransition } from '../useDetailPushTransition';

// Note: the jest reanimated mock resolves withTiming to its target value
// synchronously AND invokes the trailing `finished` callback synchronously
// (finished = true), so the exit path's runOnJS(unmount) fires immediately
// in this environment — unlike the real ~300ms animation on device, where
// `mounted` stays true until the exit animation actually completes.
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

  it('unmounts once the exit animation finishes', () => {
    const { result, rerender } = renderHook(
      ({ visible }: { visible: boolean }) => useDetailPushTransition(visible),
      { initialProps: { visible: true } }
    );

    expect(result.current.mounted).toBe(true);
    rerender({ visible: false });
    // The mock's withTiming resolves (and fires its finished callback)
    // synchronously, so unmount runs immediately here — on device this
    // happens only after the exit animation completes.
    expect(result.current.mounted).toBe(false);
  });
});
