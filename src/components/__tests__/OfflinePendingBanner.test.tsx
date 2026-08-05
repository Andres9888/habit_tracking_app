/**
 * OfflinePendingBanner Tests
 * Edge Case Handling: UI for offline queue status
 *
 * Tests:
 * - Visibility conditions
 * - Offline vs online states
 * - Processing state display
 * - Expandable details
 * - Sync button interaction
 * - Accessibility
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { OfflinePendingBanner, type OfflinePendingBannerProps } from '../OfflinePendingBanner';
import { useNetworkStatus } from '../../contexts/NetworkStatusContext';
import { useOfflineQueue, type QueueStats } from '../../hooks/useOfflineQueue';
import { type ProcessingState } from '../OfflineQueueProcessor';

// Mock dependencies
jest.mock('../../contexts/NetworkStatusContext');
jest.mock('../../hooks/useOfflineQueue');
jest.mock('expo-haptics');
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    default: {
      ...Reanimated.default,
      call: () => {},
    },
  };
});

// Mock components
jest.mock('lucide-react-native', () => ({
  Wifi: () => 'WifiIcon',
  WifiOff: () => 'WifiOffIcon',
  Cloud: () => 'CloudIcon',
  CloudOff: () => 'CloudOffIcon',
  ChevronDown: () => 'ChevronDownIcon',
  RefreshCw: () => 'RefreshCwIcon',
  Check: () => 'CheckIcon',
  AlertTriangle: () => 'AlertTriangleIcon',
}));

describe('OfflinePendingBanner', () => {
  const mockUseNetworkStatus = useNetworkStatus as jest.Mock;
  const mockUseOfflineQueue = useOfflineQueue as jest.Mock;

  const defaultNetworkStatus = {
    isOnline: true,
    status: {
      isConnected: true,
      isInternetReachable: true,
      connectionType: 'wifi',
      isExpensive: false,
      lastStatusChangeAt: Date.now(),
    },
    isChecking: false,
    refresh: jest.fn(),
    onOnline: jest.fn(() => jest.fn()),
    onOffline: jest.fn(() => jest.fn()),
  };

  const defaultQueueReturn = {
    hasQueuedItems: false,
    queueCount: 0,
    getStats: jest.fn().mockResolvedValue({
      totalItems: 0,
      pendingItems: 0,
      failedItems: 0,
      byType: {
        reflection: 0,
        letter: 0,
        voiceNote: 0,
        visionBoardImage: 0,
        affirmation: 0,
        habitUpdate: 0,
      },
    }),
    isLoading: false,
  };

  const mockQueueStats: QueueStats = {
    totalItems: 3,
    pendingItems: 2,
    failedItems: 1,
    byType: {
      reflection: 2,
      letter: 1,
      voiceNote: 0,
      visionBoardImage: 0,
      affirmation: 0,
      habitUpdate: 0,
    },
    oldestItemAt: Date.now() - 3600000, // 1 hour ago
  };

  const mockProcessingState: ProcessingState = {
    isProcessing: true,
    currentItem: null,
    totalItems: 5,
    processedCount: 2,
    failedCount: 0,
    progress: 0.4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNetworkStatus.mockReturnValue(defaultNetworkStatus);
    mockUseOfflineQueue.mockReturnValue(defaultQueueReturn);
  });

  describe('Visibility', () => {
    it('does not render when online with no queued items', () => {
      const { queryByTestId, queryByText } = render(<OfflinePendingBanner />);

      expect(queryByText("You're Offline")).toBeNull();
      expect(queryByText('Pending Sync')).toBeNull();
    });

    it('renders when offline', () => {
      mockUseNetworkStatus.mockReturnValue({
        ...defaultNetworkStatus,
        isOnline: false,
      });

      const { getByText } = render(<OfflinePendingBanner />);

      expect(getByText("You're Offline")).toBeTruthy();
    });

    it('renders when online with queued items', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByText } = render(<OfflinePendingBanner />);

      expect(getByText('Pending Sync')).toBeTruthy();
      expect(getByText('3 items waiting')).toBeTruthy();
    });

    it('renders when forceShow is true', () => {
      const { getByText } = render(<OfflinePendingBanner forceShow />);

      expect(getByText('All Synced')).toBeTruthy();
    });
  });

  describe('Offline State', () => {
    it('displays offline indicator', () => {
      mockUseNetworkStatus.mockReturnValue({
        ...defaultNetworkStatus,
        isOnline: false,
      });
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 2,
      });

      const { getByText } = render(<OfflinePendingBanner />);

      expect(getByText("You're Offline")).toBeTruthy();
      expect(getByText('2 items waiting')).toBeTruthy();
    });

    it('does not show sync button when offline', () => {
      mockUseNetworkStatus.mockReturnValue({
        ...defaultNetworkStatus,
        isOnline: false,
      });
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 2,
      });

      const { queryByText } = render(<OfflinePendingBanner showSyncButton />);

      expect(queryByText('Sync')).toBeNull();
    });
  });

  describe('Processing State', () => {
    it('displays syncing status when processing', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 5,
      });

      const { getByText } = render(
        <OfflinePendingBanner processingState={mockProcessingState} />
      );

      expect(getByText('Syncing...')).toBeTruthy();
      expect(getByText('2/5 items')).toBeTruthy();
    });

    it('does not show sync button while processing', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 5,
      });

      const { queryByText } = render(
        <OfflinePendingBanner
          processingState={mockProcessingState}
          showSyncButton
        />
      );

      expect(queryByText('Sync')).toBeNull();
    });
  });

  describe('Expandable Details', () => {
    it('expands on tap to show details', async () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
        getStats: jest.fn().mockResolvedValue(mockQueueStats),
      });

      const { getByRole, getByText, queryByText } = render(
        <OfflinePendingBanner />
      );

      // Details should not be visible initially
      expect(queryByText('Pending Items:')).toBeNull();

      // Tap to expand
      fireEvent.press(getByRole('button'));

      // Wait for details to appear
      await waitFor(() => {
        expect(getByText('Pending Items:')).toBeTruthy();
      });
    });

    it('shows item counts by type when expanded', async () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
        getStats: jest.fn().mockResolvedValue(mockQueueStats),
      });

      const { getByRole, getByText } = render(<OfflinePendingBanner />);

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(getByText('Reflections: 2')).toBeTruthy();
        expect(getByText('Letters: 1')).toBeTruthy();
      });
    });

    it('shows failed items warning when present', async () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
        getStats: jest.fn().mockResolvedValue(mockQueueStats),
      });

      const { getByRole, getByText } = render(<OfflinePendingBanner />);

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(getByText('1 item failed to sync')).toBeTruthy();
      });
    });

    it('uses external queueStats when provided', async () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByRole, getByText } = render(
        <OfflinePendingBanner queueStats={mockQueueStats} />
      );

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(getByText('Reflections: 2')).toBeTruthy();
      });
    });

    it('triggers haptic feedback on tap', async () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByRole } = render(<OfflinePendingBanner />);

      fireEvent.press(getByRole('button'));

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });

    it('calls onPress callback when tapped', async () => {
      const onPress = jest.fn();
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByRole } = render(<OfflinePendingBanner onPress={onPress} />);

      fireEvent.press(getByRole('button'));

      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('Sync Button', () => {
    it('shows sync button when online with items and showSyncButton is true', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByText } = render(<OfflinePendingBanner showSyncButton />);

      expect(getByText('Sync')).toBeTruthy();
    });

    it('hides sync button when showSyncButton is false', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { queryByText } = render(
        <OfflinePendingBanner showSyncButton={false} />
      );

      expect(queryByText('Sync')).toBeNull();
    });

    it('calls onSyncPress when sync button is tapped', () => {
      const onSyncPress = jest.fn();
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByText } = render(
        <OfflinePendingBanner showSyncButton onSyncPress={onSyncPress} />
      );

      fireEvent.press(getByText('Sync'));

      expect(onSyncPress).toHaveBeenCalled();
    });

    it('triggers medium haptic on sync press', () => {
      const onSyncPress = jest.fn();
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByText } = render(
        <OfflinePendingBanner showSyncButton onSyncPress={onSyncPress} />
      );

      fireEvent.press(getByText('Sync'));

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });
  });

  describe('All Synced State', () => {
    it('shows all synced message when online with no items', () => {
      const { getByText } = render(<OfflinePendingBanner forceShow />);

      expect(getByText('All Synced')).toBeTruthy();
      expect(getByText('Everything is up to date')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility label when offline', () => {
      mockUseNetworkStatus.mockReturnValue({
        ...defaultNetworkStatus,
        isOnline: false,
      });
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 5,
      });

      const { getByLabelText } = render(<OfflinePendingBanner />);

      expect(getByLabelText('Offline. 5 items pending sync')).toBeTruthy();
    });

    it('has correct accessibility label when online with items', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByLabelText } = render(<OfflinePendingBanner />);

      expect(getByLabelText('3 items waiting to sync')).toBeTruthy();
    });

    it('has accessibility hint for expansion', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByA11yHint } = render(<OfflinePendingBanner />);

      expect(getByA11yHint('Tap to expand details')).toBeTruthy();
    });

    it('sync button has accessibility label', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      const { getByLabelText } = render(<OfflinePendingBanner showSyncButton />);

      expect(getByLabelText('Sync now')).toBeTruthy();
    });
  });

  describe('Relative Time Formatting', () => {
    it('shows relative time for oldest item', async () => {
      const statsWithOldItem: QueueStats = {
        ...mockQueueStats,
        oldestItemAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      };

      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
        getStats: jest.fn().mockResolvedValue(statsWithOldItem),
      });

      const { getByRole, getByText } = render(<OfflinePendingBanner />);

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(getByText('Oldest: 2h ago')).toBeTruthy();
      });
    });

    it('shows days for very old items', async () => {
      const statsWithVeryOldItem: QueueStats = {
        ...mockQueueStats,
        oldestItemAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
      };

      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
        getStats: jest.fn().mockResolvedValue(statsWithVeryOldItem),
      });

      const { getByRole, getByText } = render(<OfflinePendingBanner />);

      fireEvent.press(getByRole('button'));

      await waitFor(() => {
        expect(getByText('Oldest: 3d ago')).toBeTruthy();
      });
    });
  });

  describe('Reduce Motion', () => {
    it('respects reduceMotion prop', () => {
      mockUseOfflineQueue.mockReturnValue({
        ...defaultQueueReturn,
        hasQueuedItems: true,
        queueCount: 3,
      });

      // Should render without animations when reduceMotion is true
      const { getByText } = render(
        <OfflinePendingBanner reduceMotion />
      );

      expect(getByText('Pending Sync')).toBeTruthy();
    });
  });
});
