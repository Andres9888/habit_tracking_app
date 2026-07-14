import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

jest.mock('../../../lib/purchases', () => ({
  getPurchaseRuntimeInfo: jest.fn(() => ({
    checklist: [],
    message: '',
    runtime: 'native',
    title: '',
  })),
  Purchases: {
    restorePurchases: jest.fn(),
  },
}));

import { getPurchaseRuntimeInfo, Purchases } from '../../../lib/purchases';
import { useRestorePurchases } from '../useRestorePurchases';

const mockRuntimeInfo = jest.mocked(getPurchaseRuntimeInfo);
const mockRestore = jest.mocked(Purchases.restorePurchases);

describe('SettingsModal useRestorePurchases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockRuntimeInfo.mockReturnValue({
      checklist: [],
      message: '',
      runtime: 'native',
      title: '',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows web fallback without calling RevenueCat restore', async () => {
    mockRuntimeInfo.mockReturnValue({
      checklist: [],
      message:
        'Premium purchases and restores are available in the iOS or Android app.',
      runtime: 'web',
      title: 'Use the mobile app',
    });
    const { result } = renderHook(() => useRestorePurchases());

    await act(async () => {
      result.current.handleRestore();
    });

    expect(mockRestore).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(
      'Use the mobile app',
      'Premium purchases and restores are available in the iOS or Android app.'
    );
  });

  it('shows the native validation checklist without calling RevenueCat restore', async () => {
    mockRuntimeInfo.mockReturnValue({
      checklist: [
        'Open this flow in a development client or TestFlight build.',
      ],
      message: 'Open this flow in a development client or TestFlight build.',
      runtime: 'native-unavailable',
      title: 'Native purchase validation needed',
    });
    const { result } = renderHook(() => useRestorePurchases());

    await act(async () => {
      result.current.handleRestore();
    });

    expect(mockRestore).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith(
      'Native purchase validation needed',
      'Open this flow in a development client or TestFlight build.'
    );
  });
});
