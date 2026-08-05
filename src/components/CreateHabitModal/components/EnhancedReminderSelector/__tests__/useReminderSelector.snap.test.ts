/**
 * useReminderSelector snap-on-enable tests — the seeded fallback time snaps
 * to the nearest preset only on the create path, and never overrides a
 * user-chosen time.
 */

import { act, renderHook } from '@testing-library/react-native';
import { DEFAULT_PRESETS } from '../constants';
import { useReminderSelector } from '../useReminderSelector';

jest.mock('../../../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({ triggerSelection: jest.fn() }),
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
}));

jest.mock('../../../../../utils/notifications', () => ({
  formatReminderTime: () => '2:00 PM',
  getDefaultReminderTime: () => {
    const d = new Date(2026, 5, 10);
    d.setHours(14, 0, 0, 0);
    return d;
  },
}));

const at = (hour: number, minute = 0) => {
  const d = new Date(2026, 5, 10);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const setup = (reminderTime: Date, snap: boolean) => {
  const onTimeChange = jest.fn();
  const onToggle = jest.fn();
  const { result } = renderHook(() =>
    useReminderSelector({
      onTimeChange,
      onToggle,
      presets: DEFAULT_PRESETS,
      reminderTime,
      snapDefaultToPresetOnEnable: snap,
    })
  );
  return { onTimeChange, onToggle, result };
};

describe('useReminderSelector snap-on-enable', () => {
  it('snaps the untouched 14:00 default to a preset when enabled (create)', async () => {
    const { result, onTimeChange } = setup(at(14, 0), true);

    await act(() => result.current.handleToggle(true));

    expect(onTimeChange).toHaveBeenCalledTimes(1);
    const snapped: Date = onTimeChange.mock.calls[0][0];
    const isPreset = DEFAULT_PRESETS.some(
      (p) => p.hour === snapped.getHours() && p.minute === snapped.getMinutes()
    );
    expect(isPreset).toBe(true);
  });

  it('does not snap when the flag is off (edit/prefill)', async () => {
    const { result, onTimeChange } = setup(at(14, 0), false);

    await act(() => result.current.handleToggle(true));

    expect(onTimeChange).not.toHaveBeenCalled();
  });

  it('does not snap a non-default time', async () => {
    const { result, onTimeChange } = setup(at(9, 30), true);

    await act(() => result.current.handleToggle(true));

    expect(onTimeChange).not.toHaveBeenCalled();
  });

  it('never overrides a time the user explicitly confirmed', async () => {
    const { result, onTimeChange } = setup(at(14, 0), true);

    act(() => result.current.handleCustomTimeConfirm(at(14, 0)));
    onTimeChange.mockClear();

    await act(() => result.current.handleToggle(true));

    expect(onTimeChange).not.toHaveBeenCalled();
  });

  it('does not snap when toggling off', async () => {
    const { result, onTimeChange } = setup(at(14, 0), true);

    await act(() => result.current.handleToggle(false));

    expect(onTimeChange).not.toHaveBeenCalled();
  });
});
