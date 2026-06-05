import { renderHook, act, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import {
  useHabitCardDetailHint,
  HABIT_CARD_DETAIL_HINT_DISMISSED_KEY,
  HABIT_CARD_DETAIL_OPENED_ONCE_KEY,
} from '../useHabitCardDetailHint';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

describe('useHabitCardDetailHint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
  });

  it('hides hint when there are no habits', async () => {
    const { result } = renderHook(() =>
      useHabitCardDetailHint({ totalHabits: 0 })
    );

    await waitFor(() => {
      expect(result.current.showDetailHint).toBe(false);
    });
    expect(SecureStore.getItemAsync).not.toHaveBeenCalled();
  });

  it('shows hint when user has habits and has not dismissed or opened detail', async () => {
    const { result } = renderHook(() =>
      useHabitCardDetailHint({ totalHabits: 2 })
    );

    await waitFor(() => {
      expect(result.current.showDetailHint).toBe(true);
    });
  });

  it('hides hint when previously dismissed', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(
        key === HABIT_CARD_DETAIL_HINT_DISMISSED_KEY ? 'true' : null
      )
    );

    const { result } = renderHook(() =>
      useHabitCardDetailHint({ totalHabits: 1 })
    );

    await waitFor(() => {
      expect(result.current.showDetailHint).toBe(false);
    });
  });

  it('hides hint when detail was opened once', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) =>
      Promise.resolve(key === HABIT_CARD_DETAIL_OPENED_ONCE_KEY ? 'true' : null)
    );

    const { result } = renderHook(() =>
      useHabitCardDetailHint({ totalHabits: 1 })
    );

    await waitFor(() => {
      expect(result.current.showDetailHint).toBe(false);
    });
  });

  it('dismissDetailHint persists dismissal and hides hint', async () => {
    const { result } = renderHook(() =>
      useHabitCardDetailHint({ totalHabits: 1 })
    );

    await waitFor(() => {
      expect(result.current.showDetailHint).toBe(true);
    });

    await act(async () => {
      await result.current.dismissDetailHint();
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      HABIT_CARD_DETAIL_HINT_DISMISSED_KEY,
      'true'
    );
    expect(result.current.showDetailHint).toBe(false);
  });

  it('markDetailOpened persists opened state and hides hint', async () => {
    const { result } = renderHook(() =>
      useHabitCardDetailHint({ totalHabits: 1 })
    );

    await waitFor(() => {
      expect(result.current.showDetailHint).toBe(true);
    });

    await act(async () => {
      await result.current.markDetailOpened();
    });

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      HABIT_CARD_DETAIL_OPENED_ONCE_KEY,
      'true'
    );
    expect(result.current.showDetailHint).toBe(false);
  });
});
