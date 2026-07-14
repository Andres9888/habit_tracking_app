import { renderHook } from '@testing-library/react-native';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

jest.mock('../../../lib/purchases', () => ({
  isPurchasesAvailable: jest.fn(() => true),
  Purchases: {
    getCustomerInfo: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
  },
}));

import { isPurchasesAvailable, Purchases } from '../../../lib/purchases';
import { usePremiumActions } from '../usePremiumActions';

const pkg = { identifier: 'annual' } as PurchasesPackage;
const freeCustomer = {
  entitlements: { active: {}, all: {} },
} as CustomerInfo;
const premiumCustomer = {
  entitlements: {
    active: { premium: { identifier: 'premium' } },
    all: {},
  },
} as unknown as CustomerInfo;

const mockAvailable = jest.mocked(isPurchasesAvailable);
const mockPurchase = jest.mocked(Purchases.purchasePackage);
const mockRestore = jest.mocked(Purchases.restorePurchases);

function setup() {
  const setCustomerInfo = jest.fn();
  const setError = jest.fn();
  const hook = renderHook(() =>
    usePremiumActions({ setCustomerInfo, setError })
  );
  return { ...hook, setCustomerInfo, setError };
}

describe('usePremiumActions purchase safety', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAvailable.mockReturnValue(true);
  });

  it('accepts only a purchase that returns an active entitlement', async () => {
    mockPurchase.mockResolvedValue({ customerInfo: premiumCustomer });
    const { result, setCustomerInfo } = setup();

    await expect(result.current.purchasePackage(pkg)).resolves.toBe(true);

    expect(setCustomerInfo).toHaveBeenCalledWith(premiumCustomer);
  });

  it('silently returns false when the user cancels', async () => {
    mockPurchase.mockRejectedValue({
      code: 'PURCHASE_CANCELLED',
      message: 'Cancelled',
      userCancelled: true,
    });
    const { result, setError } = setup();

    await expect(result.current.purchasePackage(pkg)).resolves.toBe(false);

    expect(setError).toHaveBeenLastCalledWith(null);
  });

  it('rethrows a real purchase failure so the paywall can show feedback', async () => {
    const failure = {
      code: 'PURCHASE_FAILED',
      message: 'Card declined',
      userCancelled: false,
    };
    mockPurchase.mockRejectedValue(failure);
    const { result, setError } = setup();

    await expect(result.current.purchasePackage(pkg)).rejects.toBe(failure);

    expect(setError).toHaveBeenLastCalledWith('Card declined');
  });

  it('rejects a completed purchase without an active entitlement', async () => {
    mockPurchase.mockResolvedValue({ customerInfo: freeCustomer });
    const { result, setError } = setup();

    await expect(result.current.purchasePackage(pkg)).rejects.toThrow(
      'premium access is not active yet'
    );

    expect(setError).toHaveBeenLastCalledWith(
      'Purchase completed, but premium access is not active yet'
    );
  });

  it('allows only one RevenueCat purchase request at a time', async () => {
    let resolvePurchase!: (value: { customerInfo: CustomerInfo }) => void;
    mockPurchase.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePurchase = resolve;
        })
    );
    const { result } = setup();

    const first = result.current.purchasePackage(pkg);
    const duplicate = result.current.purchasePackage(pkg);

    await expect(duplicate).resolves.toBe(false);
    resolvePurchase({ customerInfo: premiumCustomer });
    await expect(first).resolves.toBe(true);
    expect(mockPurchase).toHaveBeenCalledTimes(1);
  });

  it('rethrows restore failures instead of reporting no purchases found', async () => {
    const failure = new Error('Network unavailable');
    mockRestore.mockRejectedValue(failure);
    const { result, setError } = setup();

    await expect(result.current.restorePurchases()).rejects.toBe(failure);

    expect(setError).toHaveBeenLastCalledWith('Failed to restore purchases');
  });
});
