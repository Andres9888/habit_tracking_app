/**
 * useConflictNotification Hook Tests
 *
 * Tests for the conflict notification state management hook.
 */

import { renderHook, act } from '@testing-library/react-native';

import { useConflictNotification } from '../useConflictNotification';

describe('useConflictNotification', () => {
  describe('initial state', () => {
    it('starts with visible false', () => {
      const { result } = renderHook(() => useConflictNotification());
      expect(result.current.visible).toBe(false);
    });

    it('starts with conflictCount 0', () => {
      const { result } = renderHook(() => useConflictNotification());
      expect(result.current.conflictCount).toBe(0);
    });
  });

  describe('show', () => {
    it('sets visible to true when show is called', () => {
      const { result } = renderHook(() => useConflictNotification());

      act(() => {
        result.current.show();
      });

      expect(result.current.visible).toBe(true);
    });

    it('sets conflictCount to 1 by default', () => {
      const { result } = renderHook(() => useConflictNotification());

      act(() => {
        result.current.show();
      });

      expect(result.current.conflictCount).toBe(1);
    });

    it('sets conflictCount to provided value', () => {
      const { result } = renderHook(() => useConflictNotification());

      act(() => {
        result.current.show(5);
      });

      expect(result.current.conflictCount).toBe(5);
    });

    it('does not show when enabled is false', () => {
      const { result } = renderHook(() =>
        useConflictNotification({ enabled: false })
      );

      act(() => {
        result.current.show(3);
      });

      expect(result.current.visible).toBe(false);
      expect(result.current.conflictCount).toBe(0);
    });
  });

  describe('dismiss', () => {
    it('sets visible to false when dismiss is called', () => {
      const { result } = renderHook(() => useConflictNotification());

      act(() => {
        result.current.show();
      });

      expect(result.current.visible).toBe(true);

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.visible).toBe(false);
    });

    it('calls onDismiss callback when provided', () => {
      const onDismiss = jest.fn();
      const { result } = renderHook(() =>
        useConflictNotification({ onDismiss })
      );

      act(() => {
        result.current.show();
      });

      act(() => {
        result.current.dismiss();
      });

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('configuration', () => {
    it('accepts custom duration option', () => {
      const { result } = renderHook(() =>
        useConflictNotification({ duration: 5000 })
      );

      // Hook should work with custom duration (duration is passed through)
      act(() => {
        result.current.show();
      });

      expect(result.current.visible).toBe(true);
    });

    it('can be re-enabled after being disabled', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useConflictNotification({ enabled }),
        { initialProps: { enabled: false } }
      );

      act(() => {
        result.current.show(3);
      });

      expect(result.current.visible).toBe(false);

      rerender({ enabled: true });

      act(() => {
        result.current.show(3);
      });

      expect(result.current.visible).toBe(true);
      expect(result.current.conflictCount).toBe(3);
    });
  });

  describe('multiple shows', () => {
    it('updates count on subsequent show calls', () => {
      const { result } = renderHook(() => useConflictNotification());

      act(() => {
        result.current.show(2);
      });

      expect(result.current.conflictCount).toBe(2);

      act(() => {
        result.current.show(7);
      });

      expect(result.current.conflictCount).toBe(7);
    });

    it('maintains visibility across multiple shows', () => {
      const { result } = renderHook(() => useConflictNotification());

      act(() => {
        result.current.show(1);
      });

      expect(result.current.visible).toBe(true);

      act(() => {
        result.current.show(5);
      });

      expect(result.current.visible).toBe(true);
    });
  });
});
