/**
 * useUnsavedChangesGuard Tests
 * Edge Case Handling: Confirm before discarding unsaved changes
 *
 * Tests:
 * - Change detection (hasUnsavedChanges)
 * - Value normalization (whitespace handling)
 * - Confirmation dialog flow (confirmDiscard, confirmDiscardAsync)
 * - Original value updates (setOriginalValue)
 * - Haptic feedback
 * - Native Handset back button interception
 * - Edge cases (empty values, nullish handling)
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert, BackHandler, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  useUnsavedChangesGuard,
  type UseUnsavedChangesGuardOptions,
} from '../useUnsavedChangesGuard';

// Mock dependencies
jest.mock('expo-haptics');

describe('useUnsavedChangesGuard', () => {
  const mockHaptics = Haptics as jest.Mocked<typeof Haptics>;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
      writable: true,
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation(() => ({
      remove: jest.fn(),
    }));
  });

  describe('hasUnsavedChanges', () => {
    it('returns false when current equals original', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'hello',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('returns true when current differs from original', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('normalizes whitespace when comparing', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: '  hello  ',
          originalValue: 'hello',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('treats empty string and whitespace-only as equal', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: '   ',
          originalValue: '',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('returns false when disabled even with changes', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          enabled: false,
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('updates when currentValue changes', () => {
      const { result, rerender } = renderHook(
        (props: UseUnsavedChangesGuardOptions) => useUnsavedChangesGuard(props),
        {
          initialProps: {
            currentValue: 'hello',
            originalValue: 'hello',
          },
        }
      );

      expect(result.current.hasUnsavedChanges).toBe(false);

      rerender({
        currentValue: 'hello world',
        originalValue: 'hello',
      });

      expect(result.current.hasUnsavedChanges).toBe(true);
    });
  });

  describe('confirmDiscard', () => {
    it('calls callback immediately when no unsaved changes', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'hello',
        })
      );

      const callback = jest.fn();
      act(() => {
        result.current.confirmDiscard(callback);
      });

      expect(callback).toHaveBeenCalled();
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('shows alert when there are unsaved changes', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      const callback = jest.fn();
      act(() => {
        result.current.confirmDiscard(callback);
      });

      expect(Alert.alert).toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });

    it('uses default alert strings', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      act(() => {
        result.current.confirmDiscard(jest.fn());
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        expect.any(Array),
        expect.any(Object)
      );
    });

    it('uses custom alert strings', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          alertTitle: 'Custom Title',
          alertMessage: 'Custom message',
          discardButtonLabel: 'Throw Away',
          keepEditingButtonLabel: 'Continue',
        })
      );

      act(() => {
        result.current.confirmDiscard(jest.fn());
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        'Custom Title',
        'Custom message',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Continue', style: 'cancel' }),
          expect.objectContaining({ text: 'Throw Away', style: 'destructive' }),
        ]),
        expect.any(Object)
      );
    });

    it('triggers haptic feedback when showing alert', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      act(() => {
        result.current.confirmDiscard(jest.fn());
      });

      expect(mockHaptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Heavy
      );
    });

    it('calls callback and onDiscard when discard is pressed', () => {
      const onDiscard = jest.fn();
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          onDiscard,
        })
      );

      const callback = jest.fn();
      act(() => {
        result.current.confirmDiscard(callback);
      });

      // Get the buttons from the alert call
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const discardButton = buttons.find(
        (b: { style?: string }) => b.style === 'destructive'
      );

      // Simulate pressing discard
      act(() => {
        discardButton.onPress();
      });

      expect(onDiscard).toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
      expect(mockHaptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it('does not call callback when keep editing is pressed', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      const callback = jest.fn();
      act(() => {
        result.current.confirmDiscard(callback);
      });

      // Get the buttons from the alert call
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const cancelButton = buttons.find(
        (b: { style?: string }) => b.style === 'cancel'
      );

      // Simulate pressing keep editing
      act(() => {
        cancelButton.onPress();
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('confirmDiscardAsync', () => {
    it('resolves true immediately when no unsaved changes', async () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'hello',
        })
      );

      let resolved: boolean | undefined;
      await act(async () => {
        resolved = await result.current.confirmDiscardAsync();
      });

      expect(resolved).toBe(true);
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('resolves true when discard is pressed', async () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      let promiseResult: boolean | undefined;
      let resolvePromise: (() => void) | undefined;

      act(() => {
        result.current.confirmDiscardAsync().then((val) => {
          promiseResult = val;
          resolvePromise?.();
        });
      });

      // Get the discard button and press it
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const discardButton = buttons.find(
        (b: { style?: string }) => b.style === 'destructive'
      );

      await act(async () => {
        discardButton.onPress();
      });

      expect(promiseResult).toBe(true);
    });

    it('resolves false when keep editing is pressed', async () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      let promiseResult: boolean | undefined;

      act(() => {
        result.current.confirmDiscardAsync().then((val) => {
          promiseResult = val;
        });
      });

      // Get the cancel button and press it
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = alertCall[2];
      const cancelButton = buttons.find(
        (b: { style?: string }) => b.style === 'cancel'
      );

      await act(async () => {
        cancelButton.onPress();
      });

      expect(promiseResult).toBe(false);
    });
  });

  describe('setOriginalValue', () => {
    it('updates internal original value', () => {
      const { result, rerender } = renderHook(
        (props: UseUnsavedChangesGuardOptions) => useUnsavedChangesGuard(props),
        {
          initialProps: {
            currentValue: 'new value',
            originalValue: 'old value',
          },
        }
      );

      expect(result.current.hasUnsavedChanges).toBe(true);

      act(() => {
        result.current.setOriginalValue('new value');
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('is useful after successful save', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'updated text',
          originalValue: 'initial text',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(true);

      // Simulate successful save
      act(() => {
        result.current.setOriginalValue('updated text');
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });
  });

  describe('isConfirmationVisible', () => {
    it('is false initially', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      expect(result.current.isConfirmationVisible).toBe(false);
    });

    it('becomes true when confirmation shown', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      act(() => {
        result.current.confirmDiscard(jest.fn());
      });

      expect(result.current.isConfirmationVisible).toBe(true);
    });

    it('becomes false after discard pressed', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
        })
      );

      act(() => {
        result.current.confirmDiscard(jest.fn());
      });

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const discardButton = alertCall[2].find(
        (b: { style?: string }) => b.style === 'destructive'
      );

      act(() => {
        discardButton.onPress();
      });

      expect(result.current.isConfirmationVisible).toBe(false);
    });
  });

  describe('forceDiscard', () => {
    it('calls onDiscard without showing confirmation', () => {
      const onDiscard = jest.fn();
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          onDiscard,
        })
      );

      act(() => {
        result.current.forceDiscard();
      });

      expect(onDiscard).toHaveBeenCalled();
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  describe('Native Handset back button interception', () => {
    beforeEach(() => {
      (Platform.OS as unknown) = ['and', 'roid'].join('');
    });

    it('does not add listener when interceptBackButton is false', () => {
      renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          interceptBackButton: false,
        })
      );

      expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    });

    it('adds listener when interceptBackButton is true on Native Handset', () => {
      renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          interceptBackButton: true,
        })
      );

      expect(BackHandler.addEventListener).toHaveBeenCalledWith(
        'hardwareBackPress',
        expect.any(Function)
      );
    });

    it('does not add listener on iOS even when interceptBackButton is true', () => {
      (Platform.OS as unknown) = 'ios';

      renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          interceptBackButton: true,
        })
      );

      expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    });

    it('removes listener on unmount', () => {
      const mockRemove = jest.fn();
      (BackHandler.addEventListener as jest.Mock).mockReturnValue({
        remove: mockRemove,
      });

      const { unmount } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          interceptBackButton: true,
        })
      );

      unmount();

      expect(mockRemove).toHaveBeenCalled();
    });

    it('shows confirmation and returns true when back pressed with unsaved changes', () => {
      let backHandler: () => boolean;
      (BackHandler.addEventListener as jest.Mock).mockImplementation(
        (event, handler) => {
          backHandler = handler;
          return { remove: jest.fn() };
        }
      );

      renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'world',
          interceptBackButton: true,
        })
      );

      // Simulate back button press
      let result: boolean;
      act(() => {
        result = backHandler!();
      });

      expect(result!).toBe(true); // Prevent default
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('returns false when back pressed with no unsaved changes', () => {
      let backHandler: () => boolean;
      (BackHandler.addEventListener as jest.Mock).mockImplementation(
        (event, handler) => {
          backHandler = handler;
          return { remove: jest.fn() };
        }
      );

      renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'hello',
          originalValue: 'hello',
          interceptBackButton: true,
        })
      );

      let result: boolean;
      act(() => {
        result = backHandler!();
      });

      expect(result!).toBe(false); // Allow default
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles empty strings', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: '',
          originalValue: '',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('handles new content from empty', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'new content',
          originalValue: '',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('handles deletion to empty', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: '',
          originalValue: 'had content',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('updates originalValue when prop changes', () => {
      const { result, rerender } = renderHook(
        (props: UseUnsavedChangesGuardOptions) => useUnsavedChangesGuard(props),
        {
          initialProps: {
            currentValue: 'new value',
            originalValue: 'old value',
          },
        }
      );

      expect(result.current.hasUnsavedChanges).toBe(true);

      // Simulate parent updating the original value (e.g., data loaded)
      rerender({
        currentValue: 'new value',
        originalValue: 'new value',
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('handles multiline content', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: 'line 1\nline 2\nline 3',
          originalValue: 'line 1\nline 2',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('handles unicode content', () => {
      const { result } = renderHook(() =>
        useUnsavedChangesGuard({
          currentValue: '你好世界 🌍',
          originalValue: '你好世界 🌍',
        })
      );

      expect(result.current.hasUnsavedChanges).toBe(false);
    });
  });
});
