# Plan: Improve Archive Habits Page Design

## Context

The archived habits page (`ArchivedHabitsModal`) is functional but feels flat compared to the rest of the app. The main habit cards have animated entrances, strength progress, stat badges, and rich visual depth — the archive page just renders plain `CompactHabitRow` cards with an emoji, name, date, and two buttons.

**Key discovery:** A full set of polished replacement components already exist in `src/components/ArchivedHabitsModal/components/` but are **not wired up**. The work is integration, not creation.

### Pre-built but unused components:
- `AnimatedHabitCard.tsx` — Rich card with staggered fade+translateY entrance, accent bar, stat badges, restore success animation
- `HabitStatsBadges.tsx` — Strength phase badge, streak badge, total completions badge
- `HabitCardHeader.tsx` — Larger icon with accent halo, name, relative date
- `ActionButtons.tsx` — Full-width Resume button with success animation, inline delete confirmation
- `StatsSummaryBar.tsx` — Aggregate count bar with Select/Select All toggle
- `DangerZoneFooter.tsx` — Dashed danger card with "Delete All Archived" button
- `ArchiveSelectionBar.tsx` — Floating bottom capsule (BlurView glass) for batch restore/delete
- `SelectionCheckbox.tsx` — Checkbox overlay for multi-select
- `useCardAnimatedStyles.ts` — Staggered entrance animations (fade + translateY, 50ms stagger, spring damping 18)
- `AnimatedHabitCard.hooks.ts` — Restore success animation (scale bounce → slide-right exit)
- `useArchiveSelection.ts` — Selection state management
- `useArchiveSelectionActions.ts` — Batch action wiring
- `useBatchArchiveActions.ts` — Batch restore/delete mutations

All already use `useThemeColors()`, theme tokens, and support dark mode.

## Changes

### 1. Update barrel export — `components/index.ts`
**File:** `src/components/ArchivedHabitsModal/components/index.ts`

Add exports for `AnimatedHabitCard`, `StatsSummaryBar`, `DangerZoneFooter`, `ArchiveSelectionBar`.

### 2. Rewire main component — `ArchivedHabitsModal.tsx`
**File:** `src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx` (currently 59 lines → ~90 lines)

Replace `CompactHabitRow` with `AnimatedHabitCard`. Wire up:
- `useReducedMotion` from `react-native-reanimated`
- `useArchiveSelection` for selection state
- `useArchiveSelectionActions` for batch action handlers
- `StatsSummaryBar` as `ListHeaderComponent` (count + select toggle)
- `DangerZoneFooter` as `ListFooterComponent` (wired to `logic.handleDeleteAll`)
- `ArchiveSelectionBar` as floating overlay when selection mode is active

The renderItem callback switches from `CompactHabitRow` to `AnimatedHabitCard`, passing:
- `index` for staggered entrance
- `reducedMotion` for accessibility
- `selectionMode`, `isSelected`, `onToggleSelect` for multi-select
- `hasReachedLimit`, `onRestore`, `onDelete`, `onUpgradePress` (same as before)

### 3. Split `ActionButtons.tsx` to meet 100-line limit
**File:** `src/components/ArchivedHabitsModal/components/ActionButtons.tsx` (149 lines → ~65 lines)

Extract `LimitReachedButtons` and `DeleteConfirmRow` into a new file:
**New file:** `src/components/ArchivedHabitsModal/components/DeleteActions.tsx` (~55 lines)

`ActionButtons.tsx` imports from `DeleteActions.tsx`.

### What stays untouched
- `ModalHeader.tsx` — already polished with BlurView and entrance animation
- `EmptyState.tsx` — already animated and styled
- `LoadingState.tsx` — skeleton loader, fine as-is
- `ArchivedHabitsModal.hooks.ts` — already exposes `handleDeleteAll`, `handleBatchRestore`, `handleBatchDelete`
- All pre-built sub-components (`AnimatedHabitCard`, `HabitStatsBadges`, etc.) — no modifications needed
- `types.ts`, `utils.ts` — already have all needed types and helpers

## Result

| Before | After |
|---|---|
| Plain flat cards, no animation | Staggered fade+translateY entrance per card |
| Only name + date shown | Strength %, streak, total completions badges |
| Small circle icon | Larger icon with accent color halo |
| Compact inline Resume/Delete buttons | Full-width Resume with success animation, inline delete confirm |
| No batch operations | Select mode with floating glass capsule bar |
| No aggregate summary | Summary bar with habit count + select toggle |
| `handleDeleteAll` existed but no UI | Danger Zone footer with Delete All button |

## Verification

1. Open app → Settings → Archived Habits (with archived habits present)
2. Cards should animate in with stagger
3. Each card shows strength badge, streak badge, completions badge
4. Resume button triggers success animation → card slides out
5. "or delete permanently" → inline "Are you sure?" confirmation
6. Tap "Select" → selection mode activates, checkboxes appear, floating bar appears
7. Select habits → batch restore/delete from floating bar
8. Scroll to bottom → Danger Zone footer visible (only when 2+ habits)
9. Test with 0 archived habits → EmptyState still renders correctly
10. Test dark mode — all components adapt
11. Test with free tier limit reached → Lock icon + "Upgrade to Resume" button
12. Run `npx expo lint` — no new warnings
