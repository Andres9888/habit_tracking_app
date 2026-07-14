import { renderHook, act } from '@testing-library/react-native';

const mockUseHabitsListState = jest.fn();
const mockUseHabitsModalsState = jest.fn();
const mockUseNotificationResponse = jest.fn();

jest.mock('../useHabitsListState', () => ({
  useHabitsListState: mockUseHabitsListState,
}));
jest.mock('../useHabitsModalsState', () => ({
  useHabitsModalsState: mockUseHabitsModalsState,
}));
jest.mock('../../../../hooks/useNotificationResponse', () => ({
  useNotificationResponse: mockUseNotificationResponse,
}));

const { useHabitsApp } = jest.requireActual(
  '../useHabitsApp'
) as typeof import('../useHabitsApp');

describe('useHabitsApp notification routing', () => {
  const openHabitDetail = jest.fn();
  const matchingHabit = { _id: 'habit-123', name: 'Read' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHabitsListState.mockReturnValue({
      habits: [matchingHabit],
      handleHabitPress: jest.fn(),
      settings: undefined,
      showHabitStrengthPercentage: true,
      tracking: [],
    });
    mockUseHabitsModalsState.mockReturnValue({ openHabitDetail });
    mockUseNotificationResponse.mockReturnValue({});
  });

  it('opens Habit Detail for a tapped scheduled habit reminder', () => {
    renderHook(() => useHabitsApp());

    const handlers = mockUseNotificationResponse.mock.calls[0][0];
    act(() => {
      handlers.onHabitNotificationTap('habit-123');
    });

    expect(openHabitDetail).toHaveBeenCalledTimes(1);
    expect(openHabitDetail).toHaveBeenCalledWith(matchingHabit);
  });

  it('ignores reminder taps when the habit is no longer in the active list', () => {
    renderHook(() => useHabitsApp());

    const handlers = mockUseNotificationResponse.mock.calls[0][0];
    act(() => {
      handlers.onHabitNotificationTap('missing-habit');
    });

    expect(openHabitDetail).not.toHaveBeenCalled();
  });
});
