import { act, renderHook } from '@testing-library/react-native';
import { logInteraction } from '../../lib/analytics/interactions';
import { useHabitsAppHandlers } from './useHabitsAppHandlers';

jest.mock('../../lib/analytics/interactions', () => ({
  logInteraction: jest.fn(),
}));

const mockLog = logInteraction as jest.MockedFunction<typeof logInteraction>;

function setup(overrides?: {
  hasReachedHabitLimit?: boolean;
  isPremiumUser?: boolean;
}) {
  const openCreateHabitScreen = jest.fn();
  const triggerSelection = jest.fn();
  const hook = renderHook(() =>
    useHabitsAppHandlers({
      hasReachedHabitLimit: overrides?.hasReachedHabitLimit ?? false,
      isPremiumUser: overrides?.isPremiumUser ?? false,
      openCreateHabitScreen,
      triggerSelection,
    })
  );
  return { ...hook, openCreateHabitScreen, triggerSelection };
}

describe('useHabitsAppHandlers habit-limit gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens create when the free user is under the limit', () => {
    const { result, openCreateHabitScreen } = setup();
    act(() => {
      result.current.handleCreateHabitRequest();
    });
    expect(openCreateHabitScreen).toHaveBeenCalledTimes(1);
    expect(result.current.paywallVisible).toBe(false);
  });

  it('shows the paywall and does not create at the free limit', () => {
    const { result, openCreateHabitScreen } = setup({
      hasReachedHabitLimit: true,
    });
    act(() => {
      result.current.handleCreateHabitRequest();
    });
    expect(openCreateHabitScreen).not.toHaveBeenCalled();
    expect(result.current.paywallVisible).toBe(true);
    expect(mockLog).toHaveBeenCalledWith('premium_habit_limit_reached', {
      habitCount: 3,
    });
  });

  it('lets a premium user create past the free cap', () => {
    const { result, openCreateHabitScreen } = setup({
      hasReachedHabitLimit: true,
      isPremiumUser: true,
    });
    act(() => {
      result.current.handleCreateHabitRequest();
    });
    expect(openCreateHabitScreen).toHaveBeenCalledTimes(1);
    expect(result.current.paywallVisible).toBe(false);
  });

  it('opens create after a successful purchase from the habit-limit paywall', () => {
    const { result, openCreateHabitScreen } = setup({
      hasReachedHabitLimit: true,
    });
    act(() => {
      result.current.handleCreateHabitRequest();
    });
    act(() => {
      result.current.handlePaywallSuccess();
    });
    expect(openCreateHabitScreen).toHaveBeenCalledTimes(1);
    expect(result.current.paywallVisible).toBe(false);
    expect(mockLog).toHaveBeenCalledWith('premium_purchase_success', {
      source: 'habit_limit',
    });
  });

  it('does not open create after a successful upgrade-source purchase', () => {
    const { result, openCreateHabitScreen } = setup();
    act(() => {
      result.current.handleUpgradeIntent();
    });
    act(() => {
      result.current.handlePaywallSuccess();
    });
    expect(openCreateHabitScreen).not.toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalledWith('premium_purchase_success', {
      source: 'home_prompt',
    });
  });
});
