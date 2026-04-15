# Archive Page Redesign — Card Stack (Tinder-style)

## Context

The current `ArchivedHabitsModal` is a utilitarian FlatList buried in Settings. After exploring 40 variations across psychology, monetization, and core UX patterns, the **Card Stack** pattern was selected. It forces a decision on each habit (restore, delete, or skip), creates a satisfying "processing" flow, and shows rich habit data with the user's own identity/why statements.

**Design reference**: `.superdesign/design_iterations/archive_redesign_v4_ux_core.html` → Variation #7

## Chosen Design: Card Stack

### How It Works
- Archived habits presented as a **stacked card deck** (like Tinder/Bumble)
- User processes **one habit at a time** — each card shows emoji, name, stats, and identity/why
- **Three actions**: Restore (large green button), Delete (red X button), Skip (gray forward button)
- **Progress dots** at top showing position (1 of N)
- Cards visually stack with offset/scale to show depth
- Front card has slight rotation for organic feel
- After all cards processed, show completion state

### Card Content (per habit)
- Large emoji icon (64px)
- Habit name (22px, bold)
- "Archived X days ago" subtitle
- Three stat columns: Strength % | Streak days | Total sessions
- User's identity/why statement (if set) in warm amber quote block
- Strength level emoji + label (⚡ Automatic, 💪 Strong, etc.)

### Actions
- **Restore** (green, 72px circle, center): Calls `unarchive` mutation, card animates right + fade
- **Delete** (red, 64px circle, left): Shows confirmation alert first, then `removeHabit`, card animates left + fade
- **Skip** (gray, 64px circle, right): Card animates down, moves to end of deck

### After All Cards Processed
- Show summary: "You restored 2, deleted 1, skipped 1"
- Button to "Review Skipped" or "Done"

### Premium Upsell
- After processing all cards, show subtle banner: "🛡️ Streak Protection — Premium freezes streaks while archived. Try Free →"
- Non-intrusive, only appears after the flow completes

## Files to Modify

### New Components (create)
```
src/components/ArchivedHabitsModal/
├── components/
│   ├── CardStack.tsx          # Main card stack with gesture handling
│   ├── ArchiveCard.tsx        # Individual card (stats, identity, emoji)
│   ├── CardActions.tsx        # Three circular action buttons
│   ├── ProgressDots.tsx       # Position indicator (1 of N)
│   └── CompletionSummary.tsx  # Post-processing summary screen
```

### Existing Files to Edit
- `ArchivedHabitsModal.tsx` — Replace FlatList with CardStack when habits exist
- `ArchivedHabitsModal.hooks.ts` — Add skip tracking state, completion summary logic

### Files to Keep (no changes)
- `ModalHeader.tsx` — Reuse as-is
- `EmptyState.tsx` — Reuse as-is
- `LoadingState.tsx` — Reuse as-is

### Files to Remove (replaced by card stack)
- `AnimatedHabitCard.tsx` — Replaced by ArchiveCard
- `HabitStatsBadges.tsx` — Stats moved inline to ArchiveCard
- `ActionButtons.tsx` — Replaced by CardActions
- `HabitCardHeader.tsx` — Merged into ArchiveCard
- `StrengthBackground.tsx` — Replaced by card layout
- `StatsSummaryBar.tsx` — Replaced by ProgressDots
- `DangerZoneFooter.tsx` — No longer needed (delete is per-card)

### Backend (no changes needed)
- `convex/habits/archive.ts` — Existing `unarchive` and `listArchived` work as-is

### Reuse from Codebase
- `useReduceMotion` hook — Already used, keep for accessibility
- `useArchivedHabitsModalLogic` — Keep and extend with skip state
- Gesture handling from `react-native-gesture-handler` (already used in swipe actions)
- `Animated` from `react-native-reanimated` (already used throughout app)
- Theme tokens from `src/theme/` — `useThemeColors()`, `spacing`, `typography`
- `strengthLevelInfo` from `ArchivedHabitsModal/utils.ts` — Reuse for emoji/label

## Implementation Steps

### Step 1: Create ProgressDots component
Simple dot indicator: active dot is green, rest are gray. Props: `total`, `current`.

### Step 2: Create ArchiveCard component
Large centered card with emoji, name, stats grid, and optional identity/why block. No gesture handling — just presentation. Uses theme tokens.

### Step 3: Create CardActions component
Three circular buttons in a row: Delete (red, left), Restore (green, center, larger), Skip (gray, right). Each button has press animation (scale spring).

### Step 4: Create CardStack component
Core gesture logic using `react-native-reanimated` + `react-native-gesture-handler`:
- PanGesture on front card for swipe left/right
- Animated card offset behind (scale 0.95, translateY +8)
- On action: animate front card off-screen, shift stack
- Track processed habits and their actions (restore/delete/skip)

### Step 5: Create CompletionSummary component
Shows after all cards processed: "2 restored, 1 deleted, 1 skipped". Buttons: "Review Skipped" and "Done". Subtle premium upsell banner.

### Step 6: Wire into ArchivedHabitsModal
Replace FlatList rendering with CardStack. Keep ModalHeader, EmptyState, LoadingState. Remove old sub-components.

### Step 7: Clean up removed files
Delete the 7 replaced sub-components listed above.

## Verification

1. **Load test**: Open Settings → Archived Habits with 0, 1, 3, 10 archived habits
2. **Restore flow**: Tap restore button → habit unarchives → card animates out → next card appears → habit shows in active list
3. **Delete flow**: Tap delete → confirmation alert → confirm → card animates out → habit permanently deleted
4. **Skip flow**: Tap skip → card moves to end → eventually comes back
5. **Completion**: Process all cards → see summary → tap Done → returns to settings
6. **Empty state**: Archive all habits, then restore all via card stack → empty state appears
7. **Accessibility**: Verify with reduced motion (no spring animations, instant transitions)
8. **Dark mode**: All theme tokens adapt via `useThemeColors()`
9. **Premium banner**: Appears after completion, taps open paywall
