/**
 * HabitsListRenders — barrel export for FlatList render-slot factories.
 *
 * React Native's `FlatList` accepts `ListHeaderComponent`, `ListEmptyComponent`,
 * and `renderItem`. Each factory here builds the JSX
 * element for one of those slots, keeping `HabitsListContent` focused on wiring.
 *
 * These are **plain functions** (not components) because FlatList expects
 * `React.ReactElement | null`, not a component reference.  They are memoised
 * at the call-site via `useMemo` / `useCallback`.
 */

export { renderHabitsListHeader } from './renderHabitsListHeader';
export { renderHabitRow } from './renderHabitRow';
