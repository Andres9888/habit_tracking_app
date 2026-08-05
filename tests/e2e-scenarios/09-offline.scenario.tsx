/**
 * Scenario S16: Offline support indicator.
 *
 * With no connectivity the habits screen surfaces a non-blocking offline
 * indicator so the user knows changes will sync later.
 * PASS when, with the network reported offline, the offline indicator
 * (testID habits-offline-indicator) becomes visible on the habits screen.
 */
import { screen, waitFor } from '@testing-library/react-native';

// Report the device as offline for this scenario (overrides the online base mock).
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(async () => ({
    isConnected: false,
    isInternetReachable: false,
    type: 'NONE',
  })),
  addNetworkStateListener: jest.fn((cb) => {
    cb({ isConnected: false, isInternetReachable: false, type: 'NONE' });
    return { remove: jest.fn() };
  }),
  NetworkStateType: {
    NONE: 'NONE',
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
    UNKNOWN: 'UNKNOWN',
  },
}));

import { HabitsApp } from '../../src/features/habits/HabitsApp';
import {
  makeHabit,
  renderScreen,
  resetConvex,
  seedCommonQueries,
} from './harness';

describe('S16 Offline indicator', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries([makeHabit({ name: 'Morning Run' })]);
  });

  it('shows the offline indicator when disconnected', async () => {
    renderScreen(<HabitsApp />);
    await screen.findByText('Morning Run');
    await waitFor(() =>
      expect(screen.getByTestId('habits-offline-indicator')).toBeTruthy()
    );
  });
});
