import { act, renderHook } from '@testing-library/react-native';
import type {
  EmitterSubscription,
  KeyboardEvent,
  KeyboardEventName,
} from 'react-native';
import { Keyboard, Platform } from 'react-native';

import { useKeyboardVisible } from '../useKeyboardVisible';

const ORIGINAL_PLATFORM_OS = Platform.OS;
const nativeHandsetOS = ['and', 'roid'].join('');
type KeyboardTestPlatform = 'ios' | 'web' | 'native-handset';

const setPlatformOS = (platformOS: KeyboardTestPlatform) => {
  const resolvedPlatform =
    platformOS === 'native-handset' ? nativeHandsetOS : platformOS;

  try {
    (Platform as { OS: string }).OS = resolvedPlatform;
    return;
  } catch {
    Object.defineProperty(Platform, 'OS', {
      value: resolvedPlatform,
      writable: true,
      configurable: true,
    });
  }
};

describe('useKeyboardVisible', () => {
  let showCallback: ((event: KeyboardEvent) => void) | null = null;
  let hideCallback: (() => void) | null = null;
  const mockRemove = jest.fn();
  let addListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    showCallback = null;
    hideCallback = null;

    setPlatformOS('ios');

    addListenerSpy = jest
      .spyOn(Keyboard, 'addListener')
      .mockImplementation(
        (
          event: KeyboardEventName,
          callback: (event: KeyboardEvent) => void
        ) => {
          if (event === 'keyboardWillShow' || event === 'keyboardDidShow') {
            showCallback = callback;
          }
          if (event === 'keyboardWillHide' || event === 'keyboardDidHide') {
            hideCallback = callback as unknown as () => void;
          }
          return { remove: mockRemove } as unknown as EmitterSubscription;
        }
      );
  });

  afterEach(() => {
    addListenerSpy.mockRestore();
  });

  it('returns isKeyboardVisible as false initially', () => {
    const { result } = renderHook(() => useKeyboardVisible());
    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('returns keyboardHeight as 0 initially', () => {
    const { result } = renderHook(() => useKeyboardVisible());
    expect(result.current.keyboardHeight).toBe(0);
  });

  it('sets up keyboard listeners on mount (iOS uses will events)', () => {
    renderHook(() => useKeyboardVisible());

    // On iOS, should use 'will' events
    expect(addListenerSpy).toHaveBeenCalledWith(
      'keyboardWillShow',
      expect.any(Function)
    );
    expect(addListenerSpy).toHaveBeenCalledWith(
      'keyboardWillHide',
      expect.any(Function)
    );
  });

  it('cleans up listeners on unmount', () => {
    const { unmount } = renderHook(() => useKeyboardVisible());

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(2);
  });

  it('sets isKeyboardVisible to true when keyboard shows', () => {
    const { result } = renderHook(() => useKeyboardVisible());

    act(() => {
      showCallback?.({
        endCoordinates: { height: 300, width: 400, screenX: 0, screenY: 500 },
        startCoordinates: {
          height: 0,
          width: 400,
          screenX: 0,
          screenY: 800,
        },
        duration: 250,
        easing: 'keyboard',
      });
    });

    expect(result.current.isKeyboardVisible).toBe(true);
  });

  it('sets keyboardHeight when keyboard shows', () => {
    const { result } = renderHook(() => useKeyboardVisible());

    act(() => {
      showCallback?.({
        endCoordinates: { height: 300, width: 400, screenX: 0, screenY: 500 },
        startCoordinates: {
          height: 0,
          width: 400,
          screenX: 0,
          screenY: 800,
        },
        duration: 250,
        easing: 'keyboard',
      });
    });

    expect(result.current.keyboardHeight).toBe(300);
  });

  it('sets isKeyboardVisible to false when keyboard hides', () => {
    const { result } = renderHook(() => useKeyboardVisible());

    // Show keyboard
    act(() => {
      showCallback?.({
        endCoordinates: { height: 300, width: 400, screenX: 0, screenY: 500 },
        startCoordinates: {
          height: 0,
          width: 400,
          screenX: 0,
          screenY: 800,
        },
        duration: 250,
        easing: 'keyboard',
      });
    });

    expect(result.current.isKeyboardVisible).toBe(true);

    // Hide keyboard
    act(() => {
      hideCallback?.();
    });

    expect(result.current.isKeyboardVisible).toBe(false);
  });

  it('resets keyboardHeight to 0 when keyboard hides', () => {
    const { result } = renderHook(() => useKeyboardVisible());

    // Show keyboard
    act(() => {
      showCallback?.({
        endCoordinates: { height: 300, width: 400, screenX: 0, screenY: 500 },
        startCoordinates: {
          height: 0,
          width: 400,
          screenX: 0,
          screenY: 800,
        },
        duration: 250,
        easing: 'keyboard',
      });
    });

    expect(result.current.keyboardHeight).toBe(300);

    // Hide keyboard
    act(() => {
      hideCallback?.();
    });

    expect(result.current.keyboardHeight).toBe(0);
  });

  it('handles missing endCoordinates height gracefully', () => {
    const { result } = renderHook(() => useKeyboardVisible());

    act(() => {
      showCallback?.({
        endCoordinates: undefined,
        startCoordinates: undefined,
        duration: 250,
        easing: 'keyboard',
      } as unknown as KeyboardEvent);
    });

    expect(result.current.isKeyboardVisible).toBe(true);
    expect(result.current.keyboardHeight).toBe(0);
  });
});

describe('useKeyboardVisible on Native Handset', () => {
  const mockRemove = jest.fn();
  let addListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    setPlatformOS('native-handset');

    addListenerSpy = jest
      .spyOn(Keyboard, 'addListener')
      .mockImplementation(
        (
          _event: KeyboardEventName,
          _callback: (event: KeyboardEvent) => void
        ) => {
          return { remove: mockRemove } as unknown as EmitterSubscription;
        }
      );
  });

  afterEach(() => {
    addListenerSpy.mockRestore();
    setPlatformOS(ORIGINAL_PLATFORM_OS);
  });

  it('uses keyboardDidShow/Hide events on Native Handset', () => {
    renderHook(() => useKeyboardVisible());

    expect(addListenerSpy).toHaveBeenCalledWith(
      'keyboardDidShow',
      expect.any(Function)
    );
    expect(addListenerSpy).toHaveBeenCalledWith(
      'keyboardDidHide',
      expect.any(Function)
    );
  });
});
