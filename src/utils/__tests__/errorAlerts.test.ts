/**
 * Error Alerts Utility Tests
 * Tests for user-facing error alerts and retry callbacks
 */

import { Alert } from 'react-native';
import {
  showSaveError,
  showCreateError,
  showSyncError,
  showGenericError,
  showNetworkError,
  showRetryableError,
} from '../errorAlerts';

// Mock React Native Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('errorAlerts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showSaveError', () => {
    it('calls Alert.alert with correct title', () => {
      showSaveError();
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('Save Failed');
    });

    it('includes message about save failure', () => {
      showSaveError();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBeTruthy();
      expect(typeof call[1]).toBe('string');
    });

    it('shows OK button when no retry callback provided', () => {
      showSaveError();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(1);
      expect(buttons[0].text).toBe('OK');
    });

    it('shows Cancel and Retry buttons when retry callback provided', () => {
      const mockRetry = jest.fn();
      showSaveError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text).toBe('Cancel');
      expect(buttons[1].text).toBe('Retry');
    });

    it('calls retry callback when retry button pressed', () => {
      const mockRetry = jest.fn();
      showSaveError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      buttons[1].onPress();
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('showCreateError', () => {
    it('calls Alert.alert with correct title', () => {
      showCreateError();
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[0]).toBe("Couldn't Create Habit");
    });

    it('includes message about create failure', () => {
      showCreateError();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBeTruthy();
    });

    it('supports retry callback', () => {
      const mockRetry = jest.fn();
      showCreateError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(2);
      buttons[1].onPress();
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('showSyncError', () => {
    it('calls Alert.alert with correct title', () => {
      showSyncError();
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('Sync Failed');
    });

    it('shows OK button when no retry provided', () => {
      showSyncError();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(1);
      expect(buttons[0].text).toBe('OK');
    });

    it('shows OK and Retry Now buttons when retry provided', () => {
      const mockRetry = jest.fn();
      showSyncError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(2);
      expect(buttons[0].text).toBe('OK');
      expect(buttons[1].text).toBe('Retry Now');
    });

    it('calls retry callback when Retry Now pressed', () => {
      const mockRetry = jest.fn();
      showSyncError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      buttons[1].onPress();
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('showGenericError', () => {
    it('calls Alert.alert with generic title', () => {
      showGenericError();
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('Something Went Wrong');
    });

    it('uses provided custom message', () => {
      const customMessage = 'Custom error message';
      showGenericError(customMessage);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBe(customMessage);
    });

    it('uses default message when not provided', () => {
      showGenericError();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBeTruthy();
    });

    it('supports retry callback', () => {
      const mockRetry = jest.fn();
      showGenericError('Error', mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(2);
      buttons[1].onPress();
      expect(mockRetry).toHaveBeenCalled();
    });

    it('handles undefined message gracefully', () => {
      showGenericError(undefined);
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('showNetworkError', () => {
    it('calls Alert.alert with connection title', () => {
      showNetworkError();
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('Connection Issue');
    });

    it('includes network error message', () => {
      showNetworkError();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBeTruthy();
    });

    it('supports retry callback', () => {
      const mockRetry = jest.fn();
      showNetworkError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(2);
      buttons[1].onPress();
      expect(mockRetry).toHaveBeenCalled();
    });
  });

  describe('showRetryableError', () => {
    it('calls Alert.alert with Error title', () => {
      showRetryableError('Test error');
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('Error');
    });

    it('uses provided message parameter', () => {
      const message = 'Custom error message';
      showRetryableError(message);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBe(message);
    });

    it('shows OK button when no retry provided', () => {
      showRetryableError('Error message');
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(1);
      expect(buttons[0].text).toBe('OK');
    });

    it('shows Cancel and Retry buttons when retry provided', () => {
      const mockRetry = jest.fn();
      showRetryableError('Error message', mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      expect(buttons).toHaveLength(2);
      expect(buttons[1].text).toBe('Retry');
      buttons[1].onPress();
      expect(mockRetry).toHaveBeenCalled();
    });

    it('handles empty string message', () => {
      showRetryableError('');
      expect(Alert.alert).toHaveBeenCalled();
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBe('');
    });

    it('handles very long error messages', () => {
      const longMessage = 'A'.repeat(500);
      showRetryableError(longMessage);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      expect(call[1]).toBe(longMessage);
    });
  });

  describe('alert button behavior', () => {
    it('Cancel button has cancel style', () => {
      const mockRetry = jest.fn();
      showSaveError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      const cancelButton = buttons.find((b: any) => b.text === 'Cancel');
      expect(cancelButton?.style).toBe('cancel');
    });

    it('Retry button has default style', () => {
      const mockRetry = jest.fn();
      showSaveError(mockRetry);
      const call = (Alert.alert as jest.Mock).mock.calls[0];
      const buttons = call[2];
      const retryButton = buttons.find((b: any) => b.text === 'Retry');
      expect(retryButton?.style).toBeUndefined();
    });
  });

  describe('multiple error alerts in sequence', () => {
    it('can call multiple alert functions without interference', () => {
      const retry1 = jest.fn();
      const retry2 = jest.fn();

      showSaveError(retry1);
      showCreateError(retry2);
      showNetworkError();

      expect(Alert.alert).toHaveBeenCalledTimes(3);
    });

    it('each retry callback is independent', () => {
      const retry1 = jest.fn();
      const retry2 = jest.fn();

      showSaveError(retry1);
      const call1 = (Alert.alert as jest.Mock).mock.calls[0];
      call1[2][1].onPress();

      showCreateError(retry2);
      const call2 = (Alert.alert as jest.Mock).mock.calls[1];
      call2[2][1].onPress();

      expect(retry1).toHaveBeenCalledTimes(1);
      expect(retry2).toHaveBeenCalledTimes(1);
    });
  });
});
