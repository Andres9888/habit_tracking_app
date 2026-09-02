import {
  createSettingsUpdaters,
  SETTINGS_SAVE_ERROR,
} from './SettingsModal.settingsUpdaters';

function createSetters() {
  return {
    setCompactViewState: jest.fn(),
    setConnectorStyleState: jest.fn(),
    setDarkModeState: jest.fn(),
    setReduceMotionState: jest.fn(),
    setShowGradientFillState: jest.fn(),
  };
}

const CURRENT = {
  compactView: false,
  connectorStyle: 'full' as const,
  darkModePreference: 'system' as const,
  reduceMotion: false,
  showGradientFill: true,
};

describe('createSettingsUpdaters', () => {
  it('applies the new value locally BEFORE awaiting persistence', async () => {
    let resolveUpdate: (() => void) | undefined;
    const update = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveUpdate = resolve;
        })
    );
    const setters = createSetters();
    const updaters = createSettingsUpdaters(
      update,
      setters,
      CURRENT,
      jest.fn()
    );

    const pending = updaters.setCompactView(true);

    // The switch is fully controlled by this state — if it only moved after the
    // mutation resolved, the control would sit still on a slow connection.
    expect(setters.setCompactViewState).toHaveBeenCalledWith(true);
    expect(update).toHaveBeenCalledWith({ compactView: true });

    resolveUpdate?.();
    await pending;
  });

  it('rolls back and reports when persistence fails', async () => {
    const update = jest.fn().mockRejectedValue(new Error('offline'));
    const setters = createSetters();
    const onError = jest.fn();
    const updaters = createSettingsUpdaters(update, setters, CURRENT, onError);

    await updaters.setCompactView(true);

    expect(setters.setCompactViewState).toHaveBeenNthCalledWith(1, true);
    expect(setters.setCompactViewState).toHaveBeenNthCalledWith(2, false);
    expect(onError).toHaveBeenCalledWith(SETTINGS_SAVE_ERROR);
  });

  it('does not reject — a failed write is reported, not thrown at call sites', async () => {
    const update = jest.fn().mockRejectedValue(new Error('offline'));
    const updaters = createSettingsUpdaters(
      update,
      createSetters(),
      CURRENT,
      jest.fn()
    );

    // Call sites fire these with `void`, so a rejection would surface as an
    // unhandled promise rejection and nothing else.
    await expect(updaters.setCompactView(true)).resolves.toBeUndefined();
  });

  it('sends a single-key patch, never the whole settings document', async () => {
    const update = jest.fn().mockResolvedValue(undefined);
    const updaters = createSettingsUpdaters(
      update,
      createSetters(),
      CURRENT,
      jest.fn()
    );

    await updaters.setDarkModePreference('dark');

    expect(update).toHaveBeenCalledWith({ darkMode: 'dark' });
  });

  it('reports sort-mode failures even though there is no local value to revert', async () => {
    const update = jest.fn().mockRejectedValue(new Error('offline'));
    const onError = jest.fn();
    const updaters = createSettingsUpdaters(
      update,
      createSetters(),
      CURRENT,
      onError
    );

    await updaters.setHabitSortMode('name_asc');

    expect(onError).toHaveBeenCalledWith(SETTINGS_SAVE_ERROR);
  });
});
