/**
 * The why must survive the two-stage load: the list-shaped initialHabit has no
 * why field, so only habits.get may seed it.
 */
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { Habit } from '../../../features/habits/types';
import { useHabitEditScreen } from '../useHabitEditScreen';

const mockUpdateHabit = jest.fn(() => Promise.resolve());
let mockHabit: unknown;

jest.mock('convex/react', () => ({
  useMutation: () => mockUpdateHabit,
  useQuery: () => mockHabit,
}));

jest.mock('../../../../convex/_generated/api', () => ({
  api: { habits: { get: 'habits:get', update: 'habits:update' } },
}));

jest.mock('../../../utils/notifications', () => ({
  cancelHabitReminder: jest.fn(() => Promise.resolve()),
  createDateFromTimeString: (_t?: string, d?: Date) => d ?? new Date(),
  ensureNotificationPermissions: jest.fn(() => Promise.resolve(true)),
  formatReminderTime24: () => '09:00',
  getDefaultReminderTime: () => new Date(),
  scheduleHabitReminder: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  default: () => ({ triggerSelection: jest.fn(), triggerSuccess: jest.fn() }),
}));

const savedHabit = {
  _id: 'habit-1',
  name: 'Morning walk',
  why: 'To clear my head',
} as unknown as Habit;

const listShapedHabit = { _id: 'habit-1', name: 'Morning walk' } as Habit;

function renderEditScreen() {
  return renderHook(() =>
    useHabitEditScreen({
      habitId: 'habit-1' as never,
      initialHabit: listShapedHabit,
      onClose: jest.fn(),
    })
  );
}

describe('useHabitEditScreen why', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHabit = undefined;
  });

  it('leaves why blank until habits.get resolves', () => {
    const { result } = renderEditScreen();
    expect(result.current.why).toBe('');
  });

  it('seeds why from habits.get', async () => {
    mockHabit = savedHabit;
    const { result } = renderEditScreen();

    await waitFor(() => expect(result.current.why).toBe('To clear my head'));
  });

  it('saves the trimmed why and no WOOP or identity fields', async () => {
    mockHabit = savedHabit;
    const { result } = renderEditScreen();
    await waitFor(() => expect(result.current.why).toBe('To clear my head'));

    act(() => result.current.setWhy('  Because mornings set the day  '));
    await act(async () => {
      await result.current.handleSave();
    });

    const payload = mockUpdateHabit.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.why).toBe('Because mornings set the day');
    for (const key of [
      'identity',
      'woopWish',
      'woopOutcome',
      'woopObstacle',
      'woopPlan',
    ]) {
      expect(key in payload).toBe(false);
    }
  });

  it('omits why entirely while habits.get is still loading', async () => {
    const { result } = renderEditScreen();

    await act(async () => {
      await result.current.handleSave();
    });

    const payload = mockUpdateHabit.mock.calls[0][0] as Record<string, unknown>;
    expect('why' in payload).toBe(false);
  });
});
