import { act, renderHook } from '@testing-library/react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { SPLASH_TIMEOUT_MS, useStartupReady } from '../useStartupReady';

jest.mock('expo-font', () => ({
  useFonts: jest.fn(),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('@expo-google-fonts/literata/700Bold', () => ({
  Literata_700Bold: 1,
}));

describe('useStartupReady', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (useFonts as jest.Mock).mockReturnValue([false, null]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('hides the native splash after the font wait times out', () => {
    const { result } = renderHook(() => useStartupReady());

    expect(result.current).toBe(false);
    expect(SplashScreen.hideAsync).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(SPLASH_TIMEOUT_MS);
    });

    expect(result.current).toBe(true);
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('hides the native splash as soon as fonts load', () => {
    (useFonts as jest.Mock).mockReturnValue([true, null]);

    const { result } = renderHook(() => useStartupReady());

    expect(result.current).toBe(true);
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });
});
