/**
 * `clearMilestone` reaches useHabitsModalsState twice: as a dependency of the
 * handlers memo and of the `modals` memo itself. This pins its identity at the
 * consumer boundary, so re-introducing a per-render closure in
 * useHabitMilestones fails here as well as in useHabitMilestones.test.ts.
 *
 * The second test pins the ENTIRE `modals` object. `modals` is spread into
 * BottomActionBar and every memo()'d HabitsModals section, so a fresh object
 * here re-renders all of them on every Home render. It previously churned
 * because the offline mutation hooks in src/lib/optimistic passed inline
 * confirmOptimistic/failOptimistic callbacks into useOfflineMutation's
 * useCallback deps; those are now module-level constants.
 */

import React from 'react';
import { renderHook } from '@testing-library/react-native';

// `api` is convex's `anyApi` Proxy: `api.habits.archive` mints a NEW object on
// every property access, so a Map keyed on the reference itself never hits and
// every useMutation call returns a fresh function. Key on the resolved function
// name instead — that is what makes the mock stable per call site.
jest.mock('convex/react', () => {
  const { getFunctionName } = jest.requireActual('convex/server');
  const mutations = new Map<string, () => Promise<void>>();
  return {
    useQuery: jest.fn(() => undefined),
    useMutation: jest.fn((reference: unknown) => {
      const key = getFunctionName(reference);
      if (!mutations.has(key)) mutations.set(key, () => Promise.resolve());
      return mutations.get(key);
    }),
    ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

import type { Habit } from '../../types';
import { useHabitsModalsState } from '../useHabitsModalsState';

const habits = [
  { _id: 'habit-1', name: 'Meditate', strength: 0.4 },
] as unknown as Habit[];

function renderModals() {
  return renderHook(
    ({ items }: { items: Habit[] }) =>
      useHabitsModalsState({
        habits: items,
        showHabitStrengthPercentage: false,
      }),
    { initialProps: { items: habits } }
  );
}

describe('useHabitsModalsState identity', () => {
  it('keeps clearMilestone stable across an unrelated rerender', () => {
    const { result, rerender } = renderModals();

    const first = result.current.clearMilestone;
    rerender({ items: habits });
    expect(result.current.clearMilestone).toBe(first);

    rerender({ items: habits });
    expect(result.current.clearMilestone).toBe(first);
  });

  it('keeps the whole modals object referentially stable across unrelated rerenders', () => {
    const { result, rerender } = renderModals();

    const first = result.current;
    rerender({ items: habits });

    // Report every churning key by name before the whole-object assertion, so
    // a regression names its source instead of just failing on identity.
    const churned = Object.keys(first).filter(
      (key) =>
        (first as Record<string, unknown>)[key] !==
        (result.current as Record<string, unknown>)[key]
    );
    expect(churned).toEqual([]);
    expect(result.current).toBe(first);

    rerender({ items: habits });
    expect(result.current).toBe(first);
  });
});
