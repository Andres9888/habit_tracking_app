# Plan: Remove ShareCardGenerator & All Share Buttons

## Context

The share functionality (ShareCardGenerator modal + share buttons in celebration modals + TodaysFocusCard) is being removed entirely. This feature was built months ago but is no longer desired. It spans ~30+ files across the codebase — a dedicated component system, state management hooks, celebration modal integrations, and animation hooks.

## Approach

Remove all share-related code in dependency order (leaf nodes first, then integration points), keeping pause modals and celebration modals intact but without share buttons.

---

## Step 1: Delete ShareCardGenerator directory (23 files)

```
rm -rf src/components/ShareCardGenerator/
```

## Step 2: Delete ShareButton component

```
rm src/components/ProgressSectionConsolidated/TodaysFocusCard/components/ShareButton.tsx
```

## Step 3: Delete test files

```
rm tests/unit/theme/sharecardgenerator-tokens.test.ts
```

Also check and clean share references from:
- `tests/unit/theme/primary500-text-contrast.test.ts`
- `tests/unit/theme/borderradius-small-tokens.test.ts`

## Step 4: Remove ShareCardData type

**File:** `src/features/habits/types.ts`
- Delete lines 48-54 (the `ShareCardData` type)
- Remove `MilestoneAchievement` import if only used by ShareCardData

## Step 5: Update habits state management hooks

### 5a. `src/features/habits/hooks/useHabitSelectionState.ts`
- Remove `ShareCardData` import (line 2)
- Remove `shareCardData` / `setShareCardData` from interface (lines 17-18)
- Remove `useState<ShareCardData | null>` (lines 37-38)
- Remove from return object (lines 53, 55)

### 5b. `src/features/habits/hooks/useModalVisibilityState.ts`
- Remove `showShareCard` / `setShowShareCard` from interface (lines 12-13)
- Remove `useState(false)` for showShareCard (line 39)
- Remove from return object (lines 63, 70)

### 5c. `src/features/habits/hooks/useSecondaryModalHandlers.ts`
- Remove `ShareCardData` from import (line 2)
- Remove `setShowShareCard` and `setShareCardData` from `SecondaryModalSetters` interface (lines 5-6)
- Delete `closeShareCard` function (lines 28-32)
- Delete `onShareMilestone` function (lines 34-37)
- Remove `closeShareCard` and `onShareMilestone` from return object (lines 82, 84)

### 5d. `src/features/habits/hooks/useHabitsModalsHandlers.ts`
- Remove `ShareCardData` from import (line 2)
- Remove `setShowShareCard` and `setShareCardData` from `ModalsSetters` interface (lines 9-10)
- Remove `setShareCardData` from secondaryHandlers call (line 66)
- Remove `setShowShareCard` from secondaryHandlers call (line 69)

### 5e. `src/features/habits/hooks/buildModalsSettersArg.ts`
- Remove `setShareCardData` (line 22)
- Remove `setShowShareCard` (line 27)

### 5f. `src/features/habits/hooks/buildModalsStateReturnValue.ts`
- Remove `closeShareCard` (line 37)
- Remove `shareCardData` (line 79)
- Remove `onShareMilestone` (line 104)
- Remove `showShareCard` (line 124)

### 5g. `src/features/habits/hooks/buildModalsStateReturnValue.types.ts`
- Remove `ShareCardData` import (line 2)
- Remove `closeShareCard` from HandlersReturn (line 7)
- Remove `onShareMilestone` from HandlersReturn (line 16)

### 5h. `src/features/habits/hooks/habitsModalsState.types.ts`
- Remove `ShareCardData` from import (line 15)
- Remove `showShareCard` (line 30)
- Remove `shareCardData` (line 41)
- Remove `closeShareCard` (line 54)
- Remove `onShareMilestone` (line 76)

## Step 6: Update HabitsModals components

### 6a. `src/features/habits/components/HabitsModals/HabitsModals.types.ts`
- Remove `ShareCardData` import (line 3)
- Simplify `ShareAndPauseModalsProps` to only pause props (remove lines 60-62: showShareCard, shareCardData, closeShareCard)
- Delete `ShareCardGeneratorComponent` type (lines 107-112)
- Rename interface to `PauseModalProps`

### 6b. `src/features/habits/components/HabitsModals/HabitsModals.helpers.ts`
- Update `getShareAndPauseProps` → `getPauseProps`: remove `closeShareCard`, `shareCardData`, `showShareCard` (lines 58, 61, 63)
- Rename function to `getPauseProps`

### 6c. `src/features/habits/components/HabitsModals/ShareAndPauseModals.tsx`
- Remove lazy ShareCardGenerator import (lines 5-7)
- Remove ShareCardGenerator rendering (lines 21-27)
- Remove share props from destructuring (lines 11-13)
- Remove `ShareAndPauseModalsProps` type reference, update to pause-only props
- Rename file to `PauseModal.tsx` and component to `PauseModal`

### 6d. `src/features/habits/components/HabitsModals/HabitsModals.tsx`
- Update import: `ShareAndPauseModals` → `PauseModal` (line 8)
- Update import: `getShareAndPauseProps` → `getPauseProps` (line 16)
- Update JSX: `<ShareAndPauseModals {...getShareAndPauseProps(state)} />` → `<PauseModal {...getPauseProps(state)} />` (line 47)

## Step 7: Update StreakMilestoneCelebration

### 7a. `src/components/StreakMilestoneCelebration/useCelebrationHandlers.ts`
- Remove `MilestoneLevel` import (line 11)
- Delete `ShareCardData` interface (lines 21-26)
- Remove `showShareCard` and `shareData` state (lines 30-31)
- Delete `handleShare` function (lines 70-89)
- Delete `handleShareClose` function (lines 91-95)
- Remove `shareData`, `showShareCard`, `handleShare`, `handleShareClose` from return (lines 99-100, 103-104)

### 7b. `src/components/StreakMilestoneCelebration/StreakMilestoneProvider.tsx`
- Remove `ShareCardGenerator` import (line 12)
- Remove `shareData`, `showShareCard`, `handleShare`, `handleShareClose` from destructuring (lines 40-41, 44-45)
- Remove `onShare={handleShare}` from StreakMilestoneCelebration (line 67)
- Delete ShareCardGenerator JSX block (lines 70-75)
- Remove `eslint-disable max-lines` comment (line 1) — file will be shorter

### 7c. `src/components/StreakMilestoneCelebration/types.ts`
- Remove `onShare` prop from `StreakMilestoneCelebrationProps` (lines 27-28)

### 7d. `src/components/StreakMilestoneCelebration/StreakMilestoneCelebration.tsx`
- Remove `onShare` from destructuring (line 28)
- Remove `shareButtonAnimatedStyle` and `onShare` from ActionButtons (lines 69, 71)

### 7e. `src/components/StreakMilestoneCelebration/ActionButtons.tsx`
- Remove `onShare` from interface (line 14)
- Remove `shareButtonAnimatedStyle` from interface (line 16)
- Remove `onShare` from destructuring (line 21)
- Remove `shareButtonAnimatedStyle` from destructuring (line 23)
- Delete `handleShare` function (lines 26-29)
- Delete entire Share button JSX (lines 38-46)

### 7f. `src/components/StreakMilestoneCelebration/useCelebrationAnimations.ts`
- Remove `shareButtonOpacity` and `shareButtonTranslateY` shared values (lines 25-26)
- Remove their reset logic (lines 37-38)
- Remove their reduceMotion set (lines 49-50)
- Remove their animation logic (lines 81-85)
- Remove `shareButtonAnimatedStyle` animated style (lines 110-113)
- Remove from return (line 123)

## Step 8: Update MilestoneCelebration

### 8a. `src/components/MilestoneCelebration/types.ts`
- Remove `onShare` from `MilestoneCelebrationProps` (lines 23-24)
- Remove `shareButtonTranslateY` and `shareButtonOpacity` from `AnimationValues` (lines 32-33)

### 8b. `src/components/MilestoneCelebration/MilestoneCelebration.tsx`
- Remove `onShare` from destructuring (line 32)
- Remove `onShare` from MilestoneActions props (line 78)

### 8c. `src/components/MilestoneCelebration/MilestoneActions.tsx`
- Remove `onShare` from interface (line 14)
- Remove `shareButtonStyle` from interface (line 16)
- Remove from destructuring (lines 21-22)
- Delete `handleShare` function (lines 26-31)
- Delete share button JSX block (lines 41-52)

### 8d. `src/components/MilestoneCelebration/useMilestoneAnimations.ts`
- Remove `shareButtonTranslateY` and `shareButtonOpacity` shared values (lines 25-26)
- Remove from animations object (lines 36-37)
- Remove their set logic in reduceMotion (lines 48-49)

### 8e. `src/components/MilestoneCelebration/animationSequences.ts`
- Remove share button animation sequences (check for shareButton references)

### 8f. `src/components/MilestoneCelebration/useMilestoneAnimatedStyles.ts`
- Remove `shareButtonStyle` animated style (check for shareButton references)

## Step 9: Update TodaysFocusCard

### 9a. `src/components/ProgressSectionConsolidated/TodaysFocusCard.types.ts`
- Remove `onShare` from `TodaysFocusCardProps` (lines 86-87)

### 9b. `src/components/ProgressSectionConsolidated/TodaysFocusCard/TodaysFocusCard.tsx`
- Remove `ShareButton` import (line 22)
- Remove `onShare` from destructuring (line 33)
- Remove `animations.shareButtonOpacity` and `onShare` from useCelebrationEffects call (lines 42, 45)
- Delete entire `<ShareButton ... />` JSX (lines 82-88)

### 9c. `src/components/ProgressSectionConsolidated/TodaysFocusCard/hooks/useCelebrationEffects.ts`
- Remove `shareButtonOpacity` parameter (line 31)
- Remove `onShare` parameter (line 34)
- Remove `handleSharePress` from result interface (line 24)
- Remove `shareButtonOpacity.value` animation (lines 48-51)
- Remove `shareButtonOpacity.value = 1` reduced motion (line 57)
- Delete `handleSharePress` function (lines 68-73)
- Remove from return (line 77)

### 9d. `src/components/ProgressSectionConsolidated/TodaysFocusCard/hooks/useFocusAnimations.ts`
- Remove `shareButtonOpacity` shared value (line 45)
- Remove `shareButtonAnimatedStyle` animated style (lines 96-98)
- Remove from interface (lines 31, 35)
- Remove from return (lines 101, 106, 109)

## Step 10: Check callers of TodaysFocusCard for `onShare` prop

Search for `<TodaysFocusCard` and remove any `onShare` prop being passed.

---

## Verification

1. Run `npx tsc --noEmit` to check for type errors
2. Run `npm run lint` to check for unused imports/dead code
3. Grep for remaining references: `grep -r "ShareCard\|onShare\|shareCard\|showShareCard\|closeShareCard\|onShareMilestone\|ShareButton\|handleShare" src/ --include="*.ts" --include="*.tsx"` (should only find `useSharedValue` and unrelated Share API usage)
4. Run the app to verify celebration modals still work without share buttons

## Files Summary

**Delete entirely (25 files):**
- `src/components/ShareCardGenerator/` (23 files)
- `src/components/ProgressSectionConsolidated/TodaysFocusCard/components/ShareButton.tsx`
- `tests/unit/theme/sharecardgenerator-tokens.test.ts`

**Edit (~24 files):**
- State management: 8 files in `src/features/habits/hooks/`
- HabitsModals: 4 files (rename ShareAndPauseModals → PauseModal)
- Types: 1 file (`src/features/habits/types.ts`)
- StreakMilestoneCelebration: 6 files
- MilestoneCelebration: ~6 files
- TodaysFocusCard: 4 files
- Test files: 2 files (check for share references)
