---
type: analysis
title: Raw Modal → Shared Modal Migration Plan
created: 2026-03-02
tags:
  - ux-consistency
  - modal-migration
  - phase-5
related:
  - '[[UX-CONSISTENCY-05]]'
  - '[[raw-modal-audit]]'
---

# Raw Modal → Shared Modal Migration Plan

## Executive Summary

Of 28 remaining raw `Modal` imports (30 total minus 2 already migrated), **15 can migrate** to the shared Modal component, **5 can conditionally migrate** with accepted visual behavior changes (native→Reanimated), and **8 should remain as raw Modal** due to fundamentally incompatible patterns.

| Category                              | Count  | Action                                               |
| ------------------------------------- | ------ | ---------------------------------------------------- |
| Direct migration (low/medium effort)  | 15     | Migrate                                              |
| Migration with accepted visual change | 5      | Migrate if team accepts native→Reanimated transition |
| Keep as raw Modal                     | 8      | Do not migrate — patterns are incompatible           |
| **Total**                             | **28** | —                                                    |

## Shared Modal Current API

| Prop                   | Type                                       | Default       | Notes                                     |
| ---------------------- | ------------------------------------------ | ------------- | ----------------------------------------- |
| `visible`              | `boolean`                                  | —             | Required                                  |
| `onClose`              | `() => void`                               | —             | Required                                  |
| `variant`              | `bottomSheet \| fullScreen \| centerAlert` | `bottomSheet` | Layout variant                            |
| `children`             | `ReactNode`                                | —             | Content                                   |
| `inline`               | `boolean`                                  | `false`       | Render without native Modal (for nesting) |
| `disableBackdropClose` | `boolean`                                  | `false`       | Prevent tap-to-close backdrop             |
| `disableGestureClose`  | `boolean`                                  | `false`       | Prevent swipe-to-close                    |
| `backdropOpacity`      | `number`                                   | `0.5`         | Backdrop darkness (0-1)                   |
| `style`                | `ViewStyle`                                | —             | Custom content style                      |
| `respectReduceMotion`  | `boolean`                                  | `true`        | Honor system accessibility preference     |
| `skipAnimation`        | `boolean`                                  | `false`       | Instant show/hide                         |

**Built-in behaviors:** Pan-down dismiss for bottomSheet & fullScreen (120px threshold, 800px/s velocity), haptic on dismiss, semi-transparent black backdrop with tap-to-close, Reanimated spring animations, pull indicator (bottomSheet), safe area padding.

---

## Required Shared Modal API Extensions

### 1. `testID` prop (Low effort — ~5 min)

**Needed by:** IOSTimePicker
**Scope:** Add `testID?: string` to `ModalProps`, pass through to `<RNModal testID={testID}>`.

### 2. `backdropComponent` render prop (Medium effort — ~30 min) — Optional

**Needed by:** EmojiPickerSheet (blur backdrop)
**Scope:** Add `backdropComponent?: (animatedStyle: AnimatedStyle) => React.ReactNode` to `ModalProps`. When provided, render instead of `ModalBackdrop`.
**Alternative:** Keep EmojiPickerSheet as raw Modal (simpler, single consumer).

### 3. No other extensions strictly required

The existing `style`, `backdropOpacity`, `disableGestureClose`, `disableBackdropClose`, `skipAnimation`, and `inline` props cover all remaining migration needs.

---

## Migration Tiers

### Tier 1: Direct Drop-in — centerAlert group (6 files, Low effort)

These use the simplest pattern: `animationType='fade'` + semi-transparent backdrop + centered card.

#### 1. `AddImageModal` → `centerAlert` ★ Start here

**File:** `src/components/MotivationSystem/Workshop/VisionBoardSection/AddImageModal.tsx`
**Changes:**

- Replace `Modal` import from `react-native` → `../../../Modal`
- Replace `<Modal transparent animationType='fade'>` → `<Modal variant="centerAlert">`
- Remove outer `<Pressable className='flex-1 items-center justify-center bg-black/50'>` (shared Modal provides backdrop + centering)
- Remove inner `<Pressable onPress={e.stopPropagation()}>` (shared Modal handles click isolation)
- Keep content children as-is
  **Notes:** Padding `p-6` (24px) exactly matches shared Modal. Background `colors.surface` matches default. **Cleanest candidate.**

#### 2. `DualVizExplainerModal` → `centerAlert`

**File:** `src/components/MotivationSystem/Workshop/DualVizSetup/components/DualVizExplainerModal.tsx`
**Changes:** Same pattern as AddImageModal. Remove `shadow-xl` from inner card (shared Modal provides alert shadow). `p-5` (20px) vs shared Modal's 24px — accept shared Modal padding or use `style={{ padding: 0 }}`.

#### 3. `WOOPExplainerModal` → `centerAlert`

**File:** `src/components/MotivationSystem/Workshop/WOOPSection/WOOPExplainerModal.tsx`
**Changes:** Identical pattern to DualVizExplainerModal.

#### 4. `ExportMenu` → `centerAlert`

**File:** `src/screens/AnalyticsScreen/components/ExportMenu.tsx`
**Changes:** Replace Modal import. Use `style={{ padding: 0 }}` to manage padding inside children from `styles.exportMenu`. Remove `styles.modalOverlay` Pressable.

#### 5. `MiniCalendarPopup` → `centerAlert`

**File:** `src/components/CalendarTimeline/components/MiniCalendarPopup.tsx`
**Changes:** Replace Modal. Use `style={{ width: 300, padding: 16, backgroundColor: cardBg }}` to override shared defaults (85%/400px → 300px fixed). Gains `accessibilityViewIsModal` (**bug fix**).

#### 6. `IOSTimePicker` → `centerAlert`

**File:** `src/components/CreateHabitModal/components/TimePickerModal/IOSTimePicker.tsx`
**Changes:** Replace Modal. Remove Pressable wrappers. Move `testID` to content child (or add `testID` prop to shared Modal first). **Requires testID API extension** for full test parity.

---

### Tier 2: Direct Drop-in — bottomSheet group (4 files, Low-Medium effort)

#### 7. `DayHabitsBottomSheet` → `bottomSheet` ★ Cleanest bottom sheet

**File:** `src/components/DayHabitsBottomSheet/DayHabitsBottomSheet.tsx`
**Changes:**

- Replace Modal import
- Replace with `<Modal variant="bottomSheet">`
- Remove manual `backdropStyle` Animated.View
- Remove `GestureDetector` + `panGesture` from `useSheetAnimations`
- Remove `DragHandle` component (shared Modal provides pull indicator)
- Simplify or remove `useSheetAnimations` hook
  **Notes:** `colors.surface` matches default. Mid-drag haptic feedback lost (shared Modal fires haptic only on dismiss).

#### 8. `EmojiPicker` (V1) → `bottomSheet`

**File:** `src/components/EmojiPicker/EmojiPicker.tsx`
**Changes:** Replace Modal. Use `disableGestureClose`. Remove `bg-black/50` View. Keep 85% height constraint inside children.
**Notes:** No gesture dismiss. Native `animationType='slide'` → Reanimated spring (visually similar).

#### 9. `SortBottomSheet` → `bottomSheet`

**File:** `src/features/habits/components/SortBottomSheet/SortBottomSheet.tsx`
**Changes:**

- Replace with `<Modal variant="bottomSheet" style={{ backgroundColor: themeColors.card }}>`
- Remove `useSortBottomSheet`'s custom backdrop/gesture/animation logic
- Remove custom drag handle (shared Modal provides pull indicator)
  **Notes:** Uses `themeColors.card` not `surface` — requires `style` override. Custom backdrop opacity animation during drag will be lost.

#### 10. `QuickActionsSheet` → `bottomSheet`

**File:** `src/components/QuickActionsSheet/QuickActionsSheet.tsx`
**Changes:**

- Replace Modal import
- Remove `SlideInDown`/`SlideOutDown` entering/exiting layout animations
- Remove `FadeIn`/`FadeOut` backdrop animations
- Remove inline `Gesture.Pan()` definition
- Remove absolute positioning — shared Modal handles layout
  **Notes:** Open-haptic behavior unique to this component will be lost. Gains `statusBarTranslucent` (**bug fix**).

---

### Tier 3: Medium Effort — fullScreen group (5 files)

#### 11. `VisualizationModal` → `fullScreen`

**File:** `src/components/StatsNotesModal/NotesList/components/VisualizationModal.tsx`
**Changes:** Replace with `<Modal variant="fullScreen" backdropOpacity={0} style={{ backgroundColor: 'transparent', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>`. Move `LinearGradient` inside children.
**Notes:** True edge-to-edge fullscreen. Multiple style overrides needed.

#### 12. `StatsNotesModal` → `fullScreen` (reclassified from centerAlert)

**File:** `src/components/StatsNotesModal/StatsNotesModal.tsx`
**Changes:** Replace Modal. Use `variant="fullScreen"`. Despite audit classification as centerAlert, this is a tall `flex-1` card — better as fullScreen. Remove Pressable backdrop.
**Notes:** Content is a padded rounded card — keeps visual structure inside children.

#### 13. `CreateHabitModalCentered` → `fullScreen`

**File:** `src/components/CreateHabitModal/CreateHabitModalCentered.tsx`
**Changes:**

- Replace with `<Modal variant="fullScreen">`
- Move `KeyboardAvoidingView` inside children
- Remove `useSwipeDismiss` hook (shared Modal provides fullScreen swipe gesture)
- Remove `bg-black/50` backdrop
  **Notes:** `KeyboardAvoidingView` works correctly as a child inside shared Modal's content area.

#### 14. `HabitEditScreen` → `fullScreen`

**File:** `src/screens/HabitEditScreen/HabitEditScreen.tsx`
**Changes:**

- Replace with `<Modal variant="fullScreen" style={{ backgroundColor: themeColors.background }}>`
- Move `KeyboardAvoidingView` inside children
- Remove `bg-black/50` backdrop
- Inner `FadeIn`/`FadeInUp` stagger animations remain unchanged
  **Notes:** Uses `themeColors.background` not `surface` — requires `style` override. Currently no gesture dismiss — gains shared Modal fullScreen swipe-down (may want `disableGestureClose`).

#### 15. `HabitDetailScreen` → `fullScreen` (High complexity)

**File:** `src/screens/HabitDetailScreen/HabitDetailScreen.tsx`
**Changes:**

- Replace with `<Modal variant="fullScreen" style={{ backgroundColor: 'transparent' }}>`
- Move `LinearGradient` inside children
- **Restructure `HabitDetailModals`** — currently rendered as sibling inside raw Modal; must move inside children or render outside Modal entirely
- Move `KeyboardAvoidingView` inside children
  **Notes:** The sibling-modal pattern is the main complexity. `HabitDetailModals` renders sub-modals alongside content inside the same raw `<Modal>` — needs architectural restructuring.

---

### Tier 4: Conditional — Native `pageSheet`/`fullScreen` (5 files)

These use native iOS `presentationStyle` providing OS-level behaviors (background scaling, native swipe gesture, card appearance) that the shared Modal cannot replicate.

**Decision needed:** Trade native OS modal presentation for Reanimated-based consistency?

| Component                | File                                                                                                       | Native Style                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| HabitStrengthInfoModal   | `src/components/HabitStrengthHistory/InfoModal/index.tsx`                                                  | `pageSheet`                        |
| BenefitsVariant          | `src/components/PremiumPaywall/BenefitsVariant.tsx`                                                        | `pageSheet`, `transparent={false}` |
| AffirmationScheduleModal | `src/components/MotivationSystem/Workshop/AffirmationScheduleModal/AffirmationScheduleModal.tsx`           | `pageSheet`                        |
| WriteLetterModal         | `src/components/MotivationSystem/Workshop/LettersSection/components/WriteLetterModal/WriteLetterModal.tsx` | `pageSheet`                        |
| ReadLetterModal          | `src/components/MotivationSystem/Workshop/LettersSection/components/ReadLetterModal/ReadLetterModal.tsx`   | `fullScreen` + `fade`              |

**If migrating:** Use `variant="fullScreen"` with `backdropOpacity={0}` and custom `style` for background.

**Recommendation:** Keep as raw Modal. The native `pageSheet` presentation is an intentional iOS design pattern that provides a superior user experience. ReadLetterModal's fade entry is emotionally intentional for the "letter reveal" experience.

---

### Tier 5: Do Not Migrate (8 files)

These have patterns fundamentally incompatible with the shared Modal.

| Component                  | File                                                                               | Reason                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **SettingsModal**          | `src/components/SettingsModal/SettingsModal.tsx`                                   | Native opaque modal (no `transparent`); two separate `<Modal>` elements; no backdrop                                           |
| **HabitCalendarModal**     | `src/components/HabitCalendarModal/HabitCalendarModal.tsx`                         | Native opaque modal; nested `HabitEditScreen` modal inside; has `accessibilityViewIsModal` bug                                 |
| **HapticTestModalSection** | `src/features/habits/components/HabitsModals/HapticTestModalSection.tsx`           | Native opaque modal; debug/dev tool — low priority                                                                             |
| **VisionBoardPreview**     | `src/components/VisionBoardPreview/VisionBoardPreview.tsx`                         | Multi-directional swipe gestures (down=close, left/right=navigate); 90% black backdrop; incompatible gesture model             |
| **RevenueCatPaywall**      | `src/components/RevenueCatPaywall/RevenueCatPaywall.tsx`                           | `presentationStyle='fullScreen'` wrapping third-party `RevenueCatUI.Paywall`; cannot control                                   |
| **BlurOverlayVariant**     | `src/components/PremiumPaywall/BlurOverlayVariant.tsx`                             | Full-screen `BlurView` (80% intensity) as backdrop; no blur support in shared Modal                                            |
| **HeatmapTooltip**         | `src/components/BinaryHeatmap/HeatmapTooltip.tsx`                                  | Absolutely positioned tooltip at x/y coordinates; incompatible with all shared Modal variants                                  |
| **SuccessAnimation**       | `src/components/CreateHabitModal/components/SuccessAnimation/SuccessAnimation.tsx` | Full-screen confetti particles as siblings to card; animated backdrop opacity; celebration animation architecture incompatible |

### Conditional: EmojiPickerSheet (V2) — Depends on `backdropComponent` Extension

**File:** `src/components/EmojiPickerV2/EmojiPickerSheet/EmojiPickerSheet.tsx`

If `backdropComponent` is added to shared Modal:

- Replace backdrop with `backdropComponent={(style) => <AnimatedBlurView style={style} intensity={20} tint='dark' />}`
- Remove custom gesture from `useSheetAnimations`
- Keep `searchBarAnimatedStyle`/`searchFocusAnim` inside children

**Recommendation:** Keep as raw Modal. The `backdropComponent` adds complexity for a single consumer. The blur backdrop, search bar animations, and gesture system are tightly coupled — migration would require significant restructuring.

---

## Recommended Migration Order

Execute in this order to maximize value and minimize risk:

### Wave 1: centerAlert drop-ins (6 files)

1. `AddImageModal` — cleanest candidate, padding matches exactly
2. `DualVizExplainerModal` — identical pattern
3. `WOOPExplainerModal` — identical pattern
4. `ExportMenu` — simple card menu
5. `MiniCalendarPopup` — needs style overrides for width
6. `IOSTimePicker` — needs testID handling

### Wave 2: bottomSheet drop-ins (4 files)

7. `DayHabitsBottomSheet` — cleanest bottom sheet
8. `EmojiPicker` (V1) — simple, no gestures
9. `SortBottomSheet` — medium effort, style overrides
10. `QuickActionsSheet` — medium effort, animation replacement

### Wave 3: fullScreen modals (5 files)

11. `VisualizationModal` — gradient background, style overrides
12. `StatsNotesModal` — reclassified as fullScreen
13. `CreateHabitModalCentered` — KeyboardAvoidingView restructure
14. `HabitEditScreen` — KeyboardAvoidingView + background override
15. `HabitDetailScreen` — complex sibling modal restructure

---

## Bugs Found During Analysis (Fix Regardless of Migration)

| Bug                                     | File                               | Description                                                          |
| --------------------------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| `accessibilityViewIsModal` as text node | `HabitCalendarModal.tsx`           | Prop rendered outside JSX tag — becomes text content instead of prop |
| `accessibilityViewIsModal` as text node | `RevenueCatPaywall.tsx` (web path) | Same bug pattern                                                     |
| Missing `accessibilityViewIsModal`      | `MiniCalendarPopup.tsx`            | Prop not present                                                     |
| Missing `accessibilityViewIsModal`      | `SuccessAnimation.tsx`             | Prop not present                                                     |
| Missing `statusBarTranslucent`          | `QuickActionsSheet.tsx`            | Status bar may overlap on Android                                    |
| Missing `statusBarTranslucent`          | `EmojiPicker.tsx`                  | Same issue                                                           |

---

## Post-Migration Verification

After all waves complete, run:

```bash
grep -r "from 'react-native'" src/ --include="*.tsx" | grep "Modal" | grep -v "src/components/Modal/"
```

**Expected remaining raw Modal files (13):**

Do-not-migrate (8):

- `SettingsModal.tsx`, `HabitCalendarModal.tsx`, `HapticTestModalSection.tsx`
- `VisionBoardPreview.tsx`, `RevenueCatPaywall.tsx`, `BlurOverlayVariant.tsx`
- `HeatmapTooltip.tsx`, `SuccessAnimation.tsx`

Native pageSheet/fullScreen (5, if keeping):

- `HabitStrengthInfoModal`, `BenefitsVariant`, `AffirmationScheduleModal`
- `WriteLetterModal`, `ReadLetterModal`

Conditional (1):

- `EmojiPickerSheet.tsx` (if `backdropComponent` extension not built)
