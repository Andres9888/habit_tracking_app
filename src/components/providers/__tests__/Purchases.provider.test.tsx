import { render, waitFor } from '@testing-library/react-native';
import { View } from 'react-native';

jest.mock('@clerk/clerk-expo', () => ({
  useUser: jest.fn(),
}));
jest.mock('../../../hooks/usePremium', () => ({
  PremiumProvider: jest.fn(({ children }) => children),
}));
jest.mock('../../../lib/timing/scheduleWhenIdle', () => ({
  scheduleWhenIdle: jest.fn((callback: () => void) => {
    callback();
    return jest.fn();
  }),
}));
jest.mock('../../../lib/purchases', () => ({
  identifyUser: jest.fn(),
  initializePurchases: jest.fn(),
  isPurchasesAvailable: jest.fn(),
  logoutPurchases: jest.fn(),
}));

import { useUser } from '@clerk/clerk-expo';
import { PremiumProvider } from '../../../hooks/usePremium';
import {
  identifyUser,
  initializePurchases,
  isPurchasesAvailable,
} from '../../../lib/purchases';
import { PurchasesProvider } from '../Purchases.provider';

const mockUseUser = jest.mocked(useUser);
const mockPremiumProvider = jest.mocked(PremiumProvider);
const mockIdentifyUser = jest.mocked(identifyUser);
const mockInitializePurchases = jest.mocked(initializePurchases);
const mockIsPurchasesAvailable = jest.mocked(isPurchasesAvailable);

describe('PurchasesProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: { id: 'user-1' },
    } as ReturnType<typeof useUser>);
    mockInitializePurchases.mockResolvedValue(true);
    mockIdentifyUser.mockResolvedValue(true);
  });

  it('enables premium data after initializing for a fresh signed-in user', async () => {
    mockIsPurchasesAvailable.mockReturnValueOnce(false).mockReturnValue(true);

    render(
      <PurchasesProvider>
        <View />
      </PurchasesProvider>
    );

    await waitFor(() =>
      expect(mockPremiumProvider).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: true, identityKey: 'user-1' }),
        undefined
      )
    );
    expect(mockInitializePurchases).toHaveBeenCalledWith('user-1');
    expect(mockIdentifyUser).not.toHaveBeenCalled();
  });

  it('does not expose stale customer data when identification fails', async () => {
    mockIsPurchasesAvailable.mockReturnValue(true);
    mockIdentifyUser.mockResolvedValue(false);

    render(
      <PurchasesProvider>
        <View />
      </PurchasesProvider>
    );

    await waitFor(() =>
      expect(mockIdentifyUser).toHaveBeenCalledWith('user-1')
    );
    expect(
      mockPremiumProvider.mock.calls.some(([props]) => props.enabled)
    ).toBe(false);
  });
});
