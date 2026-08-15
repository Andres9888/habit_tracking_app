import { renderHook } from '@testing-library/react-native';
import { useImportGuard } from './useImportGuard';

describe('useImportGuard', () => {
  it('does not block a premium user', () => {
    const onShowPaywall = jest.fn();
    const { result } = renderHook(() => useImportGuard(true, 8, onShowPaywall));
    expect(result.current()).toBe(false);
    expect(onShowPaywall).not.toHaveBeenCalled();
  });

  it('does not block a free user under the limit', () => {
    const onShowPaywall = jest.fn();
    const { result } = renderHook(() => useImportGuard(false, 2, onShowPaywall));
    expect(result.current()).toBe(false);
    expect(onShowPaywall).not.toHaveBeenCalled();
  });

  it('shows the paywall and blocks import at the free limit', () => {
    const onShowPaywall = jest.fn();
    const { result } = renderHook(() => useImportGuard(false, 3, onShowPaywall));
    expect(result.current()).toBe(true);
    expect(onShowPaywall).toHaveBeenCalledTimes(1);
  });
});
