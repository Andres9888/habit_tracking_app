/**
 * useModalCleanup Hook Tests
 */

import { renderHook } from '@testing-library/react-native';
import { useModalCleanup } from '../useModalCleanup';

describe('useModalCleanup', () => {
  it('should call cleanup when modal becomes invisible', () => {
    const cleanup = jest.fn();

    const { rerender } = renderHook(
      ({ visible }) => useModalCleanup(visible, cleanup),
      {
        initialProps: { visible: true },
      }
    );

    expect(cleanup).not.toHaveBeenCalled();

    // Modal closes
    rerender({ visible: false });

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should not call cleanup when modal opens', () => {
    const cleanup = jest.fn();

    const { rerender } = renderHook(
      ({ visible }) => useModalCleanup(visible, cleanup),
      {
        initialProps: { visible: false },
      }
    );

    expect(cleanup).not.toHaveBeenCalled();

    // Modal opens
    rerender({ visible: true });

    expect(cleanup).not.toHaveBeenCalled();
  });

  it('should not call cleanup on initial render when visible', () => {
    const cleanup = jest.fn();

    renderHook(() => useModalCleanup(true, cleanup));

    expect(cleanup).not.toHaveBeenCalled();
  });

  it('should not call cleanup on initial render when invisible', () => {
    const cleanup = jest.fn();

    renderHook(() => useModalCleanup(false, cleanup));

    expect(cleanup).not.toHaveBeenCalled();
  });

  it('should handle multiple visibility toggles', () => {
    const cleanup = jest.fn();

    const { rerender } = renderHook(
      ({ visible }) => useModalCleanup(visible, cleanup),
      {
        initialProps: { visible: false },
      }
    );

    // Open
    rerender({ visible: true });
    expect(cleanup).toHaveBeenCalledTimes(0);

    // Close
    rerender({ visible: false });
    expect(cleanup).toHaveBeenCalledTimes(1);

    // Open again
    rerender({ visible: true });
    expect(cleanup).toHaveBeenCalledTimes(1);

    // Close again
    rerender({ visible: false });
    expect(cleanup).toHaveBeenCalledTimes(2);
  });

  it('should not call cleanup when visibility stays the same', () => {
    const cleanup = jest.fn();

    const { rerender } = renderHook(
      ({ visible }) => useModalCleanup(visible, cleanup),
      {
        initialProps: { visible: true },
      }
    );

    // Stay visible
    rerender({ visible: true });
    rerender({ visible: true });

    expect(cleanup).not.toHaveBeenCalled();

    // Close
    rerender({ visible: false });
    expect(cleanup).toHaveBeenCalledTimes(1);

    // Stay invisible
    rerender({ visible: false });
    rerender({ visible: false });

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should handle cleanup function changes', () => {
    const cleanup1 = jest.fn();
    const cleanup2 = jest.fn();

    const { rerender } = renderHook(
      ({ visible, cleanup }) => useModalCleanup(visible, cleanup),
      {
        initialProps: { visible: true, cleanup: cleanup1 },
      }
    );

    // Close with first cleanup
    rerender({ visible: false, cleanup: cleanup1 });
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup2).not.toHaveBeenCalled();

    // Open with second cleanup
    rerender({ visible: true, cleanup: cleanup2 });
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup2).not.toHaveBeenCalled();

    // Close with second cleanup
    rerender({ visible: false, cleanup: cleanup2 });
    expect(cleanup1).toHaveBeenCalledTimes(1);
    expect(cleanup2).toHaveBeenCalledTimes(1);
  });
});
