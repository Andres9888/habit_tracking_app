import { act, renderHook } from '@testing-library/react-native';
import {
  isSettingsOpen,
  resetSettingsOpenForTests,
  setSettingsOpen,
  useSettingsOpen,
} from '../settingsOpenStore';

describe('settingsOpenStore', () => {
  beforeEach(() => resetSettingsOpenForTests());

  it('starts closed', () => {
    expect(isSettingsOpen()).toBe(false);
    const { result } = renderHook(() => useSettingsOpen());
    expect(result.current).toBe(false);
  });

  it('notifies subscribers on change and ignores no-op sets', () => {
    const { result } = renderHook(() => useSettingsOpen());
    let renders = 0;
    const counter = renderHook(() => {
      renders += 1;
      return useSettingsOpen();
    });
    const before = renders;

    act(() => setSettingsOpen(true));
    expect(result.current).toBe(true);
    expect(counter.result.current).toBe(true);
    expect(renders).toBe(before + 1);

    act(() => setSettingsOpen(true));
    expect(renders).toBe(before + 1);

    act(() => setSettingsOpen(false));
    expect(result.current).toBe(false);
  });
});
