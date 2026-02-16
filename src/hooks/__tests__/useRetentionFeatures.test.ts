/**
 * useRetentionFeatures Hook Tests
 * Validates retention logic and feature orchestration
 */

import { renderHook } from '@testing-library/react-hooks';
import { useRetentionFeatures } from '../useRetentionFeatures';

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => ({
    activeUsers: 42,
    completionsToday: 1247,
  })),
}));

const mockHabits = [
  {
    _id: '1',
    category: 'health',
    completedToday: false,
    currentStreak: 7,
    name: 'Morning run',
  },
  {
    _id: '2',
    category: 'mindfulness',
    completedToday: true,
    currentStreak: 3,
    name: 'Meditation',
  },
];

describe('useRetentionFeatures', () => {
  it('returns correct shape', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    expect(result.current).toHaveProperty('shouldShowSocialProof');
    expect(result.current).toHaveProperty('shouldShowComebackMessage');
    expect(result.current).toHaveProperty('shouldShowChainNudge');
    expect(result.current).toHaveProperty('shouldShowSmartSuggestions');
    expect(result.current).toHaveProperty('globalStats');
  });

  it('shows social proof when habits exist', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    expect(result.current.shouldShowSocialProof).toBe(true);
  });

  it('shows comeback message when user missed yesterday', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: false,
        habits: mockHabits,
      })
    );

    expect(result.current.shouldShowComebackMessage).toBe(true);
    expect(result.current.daysSinceLastActivity).toBeGreaterThan(0);
  });

  it('does not show comeback when user completed yesterday', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    expect(result.current.shouldShowComebackMessage).toBe(false);
  });

  it('identifies incomplete habits correctly', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    expect(result.current.incompleteHabits).toHaveLength(1);
    expect(result.current.incompleteHabits[0].name).toBe('Morning run');
  });

  it('identifies highest streak habit', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    expect(result.current.highestStreakHabit?.name).toBe('Morning run');
    expect(result.current.highestStreakHabit?.currentStreak).toBe(7);
  });

  it('extracts user categories', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    expect(result.current.userCategories).toContain('health');
    expect(result.current.userCategories).toContain('mindfulness');
  });

  it('calculates completion rate correctly', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits,
      })
    );

    // 1 out of 2 completed = 0.5
    expect(result.current.completionRate).toBe(0.5);
  });

  it('shows suggestions for engaged users with < 5 habits', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: mockHabits, // 2 habits, 50% completion
      })
    );

    expect(result.current.shouldShowSmartSuggestions).toBe(true);
  });

  it('does not show suggestions for users with >= 5 habits', () => {
    const manyHabits = [...mockHabits, ...mockHabits, ...mockHabits];
    
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        habits: manyHabits,
      })
    );

    expect(result.current.shouldShowSmartSuggestions).toBe(false);
  });

  it('shows chain nudge in evening with incomplete habits', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        currentHour: 19, // 7 PM
        habits: mockHabits,
      })
    );

    expect(result.current.shouldShowChainNudge).toBe(true);
  });

  it('does not show chain nudge in morning', () => {
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        currentHour: 9, // 9 AM
        habits: mockHabits,
      })
    );

    expect(result.current.shouldShowChainNudge).toBe(false);
  });

  it('does not show chain nudge when all habits complete', () => {
    const completedHabits = mockHabits.map(h => ({
      ...h,
      completedToday: true,
    }));
    
    const { result } = renderHook(() =>
      useRetentionFeatures({
        completedYesterday: true,
        currentHour: 19,
        habits: completedHabits,
      })
    );

    expect(result.current.shouldShowChainNudge).toBe(false);
  });
});
