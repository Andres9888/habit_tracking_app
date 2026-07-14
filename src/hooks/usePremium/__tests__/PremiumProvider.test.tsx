import { renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import type { CustomerInfo } from 'react-native-purchases';

jest.mock('../../../lib/purchases', () => ({
  isPurchasesAvailable: jest.fn(() => true),
  Purchases: {
    addCustomerInfoUpdateListener: jest.fn(),
    getCustomerInfo: jest.fn(),
    getOfferings: jest.fn(),
    purchasePackage: jest.fn(),
    removeCustomerInfoUpdateListener: jest.fn(),
    restorePurchases: jest.fn(),
  },
}));

import { Purchases } from '../../../lib/purchases';
import { PremiumProvider } from '../Premium.provider';
import { usePremium } from '../usePremium';

const mockCustomerInfo = {
  entitlements: { active: {}, all: {} },
  managementURL: null,
} as CustomerInfo;

const mockGetCustomerInfo = jest.mocked(Purchases.getCustomerInfo);
const mockGetOfferings = jest.mocked(Purchases.getOfferings);
const mockAddListener = jest.mocked(Purchases.addCustomerInfoUpdateListener);

function wrapper({ children }: PropsWithChildren) {
  return (
    <PremiumProvider enabled identityKey='user-1'>
      {children}
    </PremiumProvider>
  );
}

describe('PremiumProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCustomerInfo.mockResolvedValue(mockCustomerInfo);
    mockGetOfferings.mockResolvedValue({
      all: {},
      current: { availablePackages: [] },
    } as Awaited<ReturnType<typeof Purchases.getOfferings>>);
  });

  it('shares one RevenueCat request and listener across consumers', async () => {
    const { result } = renderHook(
      () => ({ first: usePremium(), second: usePremium() }),
      { wrapper }
    );

    await waitFor(() =>
      expect(result.current.first.entitlementReady).toBe(true)
    );

    expect(result.current.first).toBe(result.current.second);
    expect(mockGetCustomerInfo).toHaveBeenCalledTimes(1);
    expect(mockGetOfferings).toHaveBeenCalledTimes(1);
    expect(mockAddListener).toHaveBeenCalledTimes(1);
  });

  it('resolves entitlement without waiting for offerings', async () => {
    mockGetOfferings.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => usePremium(), { wrapper });

    await waitFor(() => expect(result.current.entitlementReady).toBe(true));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoadingOfferings).toBe(true);
  });
});
