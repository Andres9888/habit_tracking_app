import { renderHook } from '@testing-library/react-native';
import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

jest.mock('../../../lib/purchases', () => ({
  createPurchasesUnavailableError: jest.fn(
    () => new Error('Purchases unavailable')
  ),
  getPurchaseRuntimeInfo: jest.fn(() => ({
    checklist: [],
    message: '',
    runtime: 'native',
    title: '',
  })),
  isPurchasesAvailable: jest.fn(() => true),
  isPurchasesUnavailableError: jest.fn(
    (error: unknown) =>
      typeof error === 'object' && error !== null && 'runtime' in error
  ),
  Purchases: {
    getCustomerInfo: jest.fn(),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn(),
  },
}));

import {
  createPurchasesUnavailableError,
  getPurchaseRuntimeInfo,
  Purchases,
} from '../../../lib/purchases';
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

const mockUnavailableError = jest.mocked(createPurchasesUnavailableError);
const mockRuntimeInfo = jest.mocked(getPurchaseRuntimeInfo);
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
    mockRuntimeInfo.mockReturnValue({
      checklist: [],
      message: '',
      runtime: 'native',
      title: '',
    });
    mockUnavailableError.mockImplementation(() => {
      const runtimeInfo = mockRuntimeInfo();
      return Object.assign(new Error(runtimeInfo.message), {
        runtime: runtimeInfo.runtime,
      });
    });
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

  it('surfaces the web fallback message for unavailable purchases', async () => {
    mockRuntimeInfo.mockReturnValue({
      checklist: [],
      message:
        'Premium purchases and restores are available in the iOS or Android app.',
      runtime: 'web',
      title: 'Use the mobile app',
    });
    const { result, setError } = setup();

    await expect(result.current.purchasePackage(pkg)).rejects.toThrow(
      'Premium purchases and restores are available in the iOS or Android app.'
    );

    expect(mockPurchase).not.toHaveBeenCalled();
    expect(setError).toHaveBeenLastCalledWith(
      'Premium purchases and restores are available in the iOS or Android app.'
    );
  });

  it('surfaces the native validation checklist for unavailable restores', async () => {
    mockRuntimeInfo.mockReturnValue({
      checklist: [
        'Open this flow in a development client or TestFlight build.',
      ],
      message: 'Open this flow in a development client or TestFlight build.',
      runtime: 'native-unavailable',
      title: 'Native purchase validation needed',
    });
    const { result, setError } = setup();

    await expect(result.current.restorePurchases()).rejects.toThrow(
      'Open this flow in a development client or TestFlight build.'
    );

    expect(mockRestore).not.toHaveBeenCalled();
    expect(setError).toHaveBeenLastCalledWith(
      'Open this flow in a development client or TestFlight build.'
    );
  });
});
