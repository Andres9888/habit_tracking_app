import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

const mockTriggerError = jest.fn();
const mockTriggerLightImpact = jest.fn();
const mockTriggerSelection = jest.fn();
const mockTriggerSuccess = jest.fn();

jest.mock('../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerError: mockTriggerError,
    triggerLightImpact: mockTriggerLightImpact,
    triggerSelection: mockTriggerSelection,
    triggerSuccess: mockTriggerSuccess,
  }),
}));
jest.mock('../../../lib/analytics/interactions', () => ({
  logInteraction: jest.fn(),
}));

import { usePaywallActions } from '../usePaywallActions';

const pkg = { identifier: 'annual' } as PurchasesPackage;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function setup(purchasePackage: () => Promise<boolean>) {
  const onClose = jest.fn();
  const onPurchaseSuccess = jest.fn();
  const onRestoreSuccess = jest.fn();
  const hook = renderHook(() =>
    usePaywallActions({
      onClose,
      onPurchaseSuccess,
      onRestoreSuccess,
      purchasePackage,
      restorePurchases: jest.fn(async () => false),
    })
  );
  return { ...hook, onClose, onPurchaseSuccess };
}

describe('usePaywallActions purchase feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('closes only after confirmed purchase success', async () => {
    const purchasePackage = jest.fn(async () => true);
    const { result, onClose, onPurchaseSuccess } = setup(purchasePackage);

    await act(async () => result.current.handlePurchase(pkg));

    expect(onPurchaseSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockTriggerSuccess).toHaveBeenCalledTimes(1);
  });

  it('keeps user cancellation quiet and leaves the paywall open', async () => {
    const purchasePackage = jest.fn(async () => false);
    const { result, onClose } = setup(purchasePackage);

    await act(async () => result.current.handlePurchase(pkg));

    expect(Alert.alert).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(mockTriggerError).not.toHaveBeenCalled();
  });

  it('shows actionable feedback when the purchase fails', async () => {
    const purchasePackage = jest.fn(async () => {
      throw new Error('Card declined');
    });
    const { result, onClose } = setup(purchasePackage);

    await act(async () => result.current.handlePurchase(pkg));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Purchase Failed',
      'Please check your payment method and try again.',
      [{ text: 'OK' }]
    );
    expect(mockTriggerError).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores a rapid duplicate tap until the first purchase finishes', async () => {
    const pending = deferred<boolean>();
    const purchasePackage = jest.fn(() => pending.promise);
    const { result, onClose, onPurchaseSuccess } = setup(purchasePackage);
    let first!: Promise<void>;

    act(() => {
      first = result.current.handlePurchase(pkg);
      void result.current.handlePurchase(pkg);
    });

    expect(purchasePackage).toHaveBeenCalledTimes(1);
    expect(result.current.isProcessing).toBe(true);

    await act(async () => {
      pending.resolve(true);
      await first;
    });

    expect(onPurchaseSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
