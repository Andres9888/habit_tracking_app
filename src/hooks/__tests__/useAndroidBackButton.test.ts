/**
 * useAndroidBackButton Hook Tests
 */

import { renderHook } from '@testing-library/react-native';
import { BackHandler, Platform } from 'react-native';
import { useAndroidBackButton } from '../useAndroidBackButton';

// Mock React Native modules
jest.mock('react-native', () => ({
  BackHandler: {
    addEventListener: jest.fn(),
  },
  Platform: {
    OS: 'android',
  },
}));

describe('useAndroidBackButton', () => {
  const mockOnClose = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (BackHandler.addEventListener as jest.Mock).mockReturnValue({
      remove: mockRemove,
    });
  });

  it('should register back handler when visible on Android', () => {
    renderHook(() => useAndroidBackButton(true, mockOnClose));

    expect(BackHandler.addEventListener).toHaveBeenCalledWith(
      'hardwareBackPress',
      expect.any(Function)
    );
  });

  it('should not register handler when not visible', () => {
    renderHook(() => useAndroidBackButton(false, mockOnClose));

    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
  });

  it('should call onClose when back button pressed', () => {
    (BackHandler.addEventListener as jest.Mock).mockImplementation(
      (event, handler) => {
        // Simulate back press
        const result = handler();
        expect(result).toBe(true); // Should return true to prevent default
        return { remove: mockRemove };
      }
    );

    renderHook(() => useAndroidBackButton(true, mockOnClose));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should remove listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useAndroidBackButton(true, mockOnClose)
    );

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('should remove and re-add listener when visible changes', () => {
    const { rerender } = renderHook(
      ({ visible }) => useAndroidBackButton(visible, mockOnClose),
      {
        initialProps: { visible: true },
      }
    );

    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);
    expect(mockRemove).toHaveBeenCalledTimes(0);

    // Hide modal
    rerender({ visible: false });

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1); // Still 1

    // Show modal again
    rerender({ visible: true });

    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('should update handler when onClose changes', () => {
    const onClose1 = jest.fn();
    const onClose2 = jest.fn();

    const { rerender } = renderHook(
      ({ onClose }) => useAndroidBackButton(true, onClose),
      {
        initialProps: { onClose: onClose1 },
      }
    );

    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(1);

    // Change onClose
    rerender({ onClose: onClose2 });

    // Should re-register with new handler
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(BackHandler.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('should not register handler on iOS', () => {
    // Change platform to iOS
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true,
    });

    renderHook(() => useAndroidBackButton(true, mockOnClose));

    expect(BackHandler.addEventListener).not.toHaveBeenCalled();

    // Reset to Android
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      writable: true,
    });
  });

  it('should not register handler on web', () => {
    // Change platform to web
    Object.defineProperty(Platform, 'OS', {
      value: 'web',
      writable: true,
    });

    renderHook(() => useAndroidBackButton(true, mockOnClose));

    expect(BackHandler.addEventListener).not.toHaveBeenCalled();

    // Reset to Android
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      writable: true,
    });
  });
});
