/**
 * OfflineProvider Tests
 *
 * Tests for the offline queue restoration provider.
 */

import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { OfflineProvider } from './Offline.provider';
import { useOfflineContext } from './useOfflineContext';
import {
  getOfflineQueueManager,
  resetOfflineQueueManager,
} from '../../lib/offline';
import * as persistence from '../../lib/offline/persistence';
import { optimisticStore } from '../../lib/optimistic/store';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockUseAuth = jest.fn();

jest.mock('@clerk/expo', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the persistence module
jest.mock('../../lib/offline/persistence', () => ({
  loadQueueState: jest.fn(),
  saveQueueState: jest.fn(),
  clearQueueState: jest.fn(),
  clearLegacyQueueState: jest.fn(),
  OFFLINE_QUEUE_STORAGE_KEY: '@chainday:offline_queue_v1',
  setQueueStorageScope: jest.fn(),
}));

const mockLoadQueueState = persistence.loadQueueState as jest.Mock;
const mockSaveQueueState = persistence.saveQueueState as jest.Mock;
const mockClearQueueState = persistence.clearQueueState as jest.Mock;

/**
 * Test component that displays context values
 */
function TestConsumer() {
  const { isRestored, isRestoring, restorationError } = useOfflineContext();
  return (
    <>
      <Text testID='isRestored'>{String(isRestored)}</Text>
      <Text testID='isRestoring'>{String(isRestoring)}</Text>
      <Text testID='error'>{restorationError?.message ?? 'none'}</Text>
    </>
  );
}

describe('OfflineProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetOfflineQueueManager();
    optimisticStore.reset();
    mockUseAuth.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      userId: 'user_123',
    });
    mockLoadQueueState.mockResolvedValue({
      version: 1,
      operations: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    mockSaveQueueState.mockResolvedValue(undefined);
    mockClearQueueState.mockResolvedValue(undefined);
  });

  describe('rendering', () => {
    it('renders children', () => {
      const { getByText } = render(
        <OfflineProvider>
          <Text>Test Child</Text>
        </OfflineProvider>
      );

      expect(getByText('Test Child')).toBeTruthy();
    });
  });

  describe('auto-restoration', () => {
    it('automatically restores queue on mount', async () => {
      const { getByTestId } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      // Initially restoring
      expect(getByTestId('isRestoring').props.children).toBe('true');

      // Wait for restoration to complete
      await waitFor(() => {
        expect(getByTestId('isRestored').props.children).toBe('true');
        expect(getByTestId('isRestoring').props.children).toBe('false');
      });

      expect(mockLoadQueueState).toHaveBeenCalledTimes(1);
    });

    it('does not restore queue while signed out', async () => {
      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: false,
        userId: null,
      });

      const { getByTestId } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(getByTestId('isRestored').props.children).toBe('true');
        expect(getByTestId('isRestoring').props.children).toBe('false');
      });

      expect(mockLoadQueueState).not.toHaveBeenCalled();
    });

    it('skips auto-restore when skipAutoRestore is true', async () => {
      const { getByTestId } = render(
        <OfflineProvider skipAutoRestore>
          <TestConsumer />
        </OfflineProvider>
      );

      // Should be immediately restored without loading
      expect(getByTestId('isRestored').props.children).toBe('true');
      expect(getByTestId('isRestoring').props.children).toBe('false');
      expect(mockLoadQueueState).not.toHaveBeenCalled();
    });
  });

  describe('restoration states', () => {
    it('shows isRestoring as true during restoration', async () => {
      // Make loadQueueState slow
      mockLoadQueueState.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { getByTestId } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      // Should be restoring initially
      expect(getByTestId('isRestoring').props.children).toBe('true');
      expect(getByTestId('isRestored').props.children).toBe('false');
    });

    it('sets isRestored to true after successful restoration', async () => {
      const { getByTestId } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(getByTestId('isRestored').props.children).toBe('true');
      });
    });
  });

  describe('error handling', () => {
    it('captures restoration error', async () => {
      mockLoadQueueState.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe('Storage error');
        expect(getByTestId('isRestoring').props.children).toBe('false');
      });
    });

    it('wraps non-Error objects in Error', async () => {
      mockLoadQueueState.mockRejectedValue('string error');

      const { getByTestId } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe(
          'Queue restoration failed'
        );
      });
    });
  });

  describe('restoreQueue function', () => {
    it('can manually trigger restoration', async () => {
      function ManualRestoreConsumer() {
        const { isRestored, restoreQueue } = useOfflineContext();
        return (
          <>
            <Text testID='isRestored'>{String(isRestored)}</Text>
            <Text testID='trigger' onPress={() => restoreQueue()}>
              Restore
            </Text>
          </>
        );
      }

      const { getByTestId } = render(
        <OfflineProvider skipAutoRestore>
          <ManualRestoreConsumer />
        </OfflineProvider>
      );

      // Initially restored but queue hasn't been loaded
      expect(mockLoadQueueState).not.toHaveBeenCalled();

      // Trigger manual restoration
      await act(async () => {
        getByTestId('trigger').props.onPress();
      });

      await waitFor(() => {
        expect(mockLoadQueueState).toHaveBeenCalledTimes(1);
      });
    });

    it('prevents concurrent restoration calls', async () => {
      let resolveLoad: () => void;
      mockLoadQueueState.mockImplementation(
        () =>
          new Promise<typeof persistence.loadQueueState>((resolve) => {
            resolveLoad = () =>
              resolve({
                version: 1,
                operations: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
              } as unknown);
          })
      );

      function ManualRestoreConsumer() {
        const { restoreQueue } = useOfflineContext();
        return (
          <Text testID='trigger' onPress={() => restoreQueue()}>
            Restore
          </Text>
        );
      }

      const { getByTestId } = render(
        <OfflineProvider skipAutoRestore>
          <ManualRestoreConsumer />
        </OfflineProvider>
      );

      // Call restore twice quickly
      await act(async () => {
        getByTestId('trigger').props.onPress();
        getByTestId('trigger').props.onPress();
      });

      // Should only call loadQueueState once
      expect(mockLoadQueueState).toHaveBeenCalledTimes(1);

      // Resolve to clean up
      await act(async () => {
        resolveLoad!();
      });
    });
  });

  describe('useOfflineContext', () => {
    it('throws when used outside provider', () => {
      // Suppress console.error for this test
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useOfflineContext must be used within an OfflineProvider');

      spy.mockRestore();
    });
  });

  describe('queue manager integration', () => {
    it('restores data into the singleton manager', async () => {
      const testOperations = [
        {
          id: 'op_1',
          type: 'toggleCompletion' as const,
          payload: { habitId: 'h1', date: '2026-01-30', toCompleted: true },
          status: 'pending' as const,
          createdAt: Date.now(),
          retryCount: 0,
        },
      ];

      mockLoadQueueState.mockResolvedValue({
        version: 1,
        operations: testOperations,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        const manager = getOfflineQueueManager();
        expect(manager.getState().operations).toHaveLength(1);
        expect(manager.getState().operations[0].id).toBe('op_1');
      });
    });

    it('emits queue:restored event after restoration', async () => {
      const manager = getOfflineQueueManager();
      const events: string[] = [];
      manager.subscribe((event) => events.push(event.type));

      render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(events).toContain('queue:restored');
      });
    });
  });

  describe('session cleanup', () => {
    it('clears persisted state when the authenticated user changes', async () => {
      const { rerender } = render(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(mockLoadQueueState).toHaveBeenCalledTimes(1);
      });

      mockUseAuth.mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_456',
      });

      rerender(
        <OfflineProvider>
          <TestConsumer />
        </OfflineProvider>
      );

      await waitFor(() => {
        expect(mockClearQueueState).toHaveBeenCalledWith('user_123');
      });
    });
  });
});
