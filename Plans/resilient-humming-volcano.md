# Plan

## 1. Remove push/pull/pivot from sort order (DONE)
Removed `phase1_push`, `phase2_pivot`, `phase3_pull` from `phaseOrder` maps in:
- `src/features/habits/hooks/habitsSortHelpers.ts`
- `src/features/habits/hooks/useHabitsSorting.ts`

## 2. Add sort icon in front of sort label in SortChip

### Context
The SortChip right side currently shows `sortLabel + ChevronRight`. User wants a sort icon added before the sort label.

### Change
In `src/features/habits/components/SortChip/SortChip.tsx`:
- Import `ArrowUpDown` from `lucide-react-native` (standard sort icon)
- Add `<ArrowUpDown>` before the sort label text in the right-side `<View>`

### Verification
- Visual check in simulator/browser
- Existing tests pass
