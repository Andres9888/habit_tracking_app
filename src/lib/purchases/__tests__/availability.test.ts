import { Platform } from 'react-native';

jest.mock('../init', () => ({
  isPurchasesAvailable: jest.fn(),
}));

jest.mock('../client', () => ({
  isExpoGo: jest.fn(),
}));

import { isExpoGo } from '../client';
import { isPurchasesAvailable } from '../init';
import {
  getPurchaseRuntimeInfo,
  NATIVE_IAP_VALIDATION_CHECKLIST,
  WEB_PURCHASE_FALLBACK_MESSAGE,
} from '../availability';

const mockAvailable = jest.mocked(isPurchasesAvailable);
const mockExpoGo = jest.mocked(isExpoGo);

function setPlatform(os: string) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    value: os,
  });
}

describe('purchase runtime availability', () => {
  beforeEach(() => {
    mockAvailable.mockReturnValue(false);
    mockExpoGo.mockReturnValue(false);
    setPlatform('ios');
  });

  it('uses a clear web fallback when RevenueCat web checkout is not enabled', () => {
    setPlatform('web');

    expect(getPurchaseRuntimeInfo()).toEqual({
      checklist: [],
      message: WEB_PURCHASE_FALLBACK_MESSAGE,
      runtime: 'web',
      title: 'Use the mobile app',
    });
  });

  it('returns native when the SDK is available', () => {
    mockAvailable.mockReturnValue(true);

    expect(getPurchaseRuntimeInfo()).toEqual({
      checklist: [],
      message: '',
      runtime: 'native',
      title: '',
    });
  });

  it('returns the dev-client or TestFlight checklist when native IAP is unavailable', () => {
    const runtimeInfo = getPurchaseRuntimeInfo();

    expect(runtimeInfo.runtime).toBe('native-unavailable');
    expect(runtimeInfo.checklist).toEqual([...NATIVE_IAP_VALIDATION_CHECKLIST]);
    expect(runtimeInfo.message).toContain('development client or TestFlight');
    expect(runtimeInfo.message).toContain('sandbox tester');
  });

  it('identifies Expo Go as a native validation blocker', () => {
    mockExpoGo.mockReturnValue(true);

    expect(getPurchaseRuntimeInfo().runtime).toBe('expo-go');
  });
});
