# Story: Color Picker Phase 1 - Expand to 24 Preset Colors

## Overview
- **ID**: CH-001
- **Priority**: High
- **Effort**: Small (1-2 hours)
- **Dependencies**: None

## User Story
As a user creating a habit, I want more color options so I can personalize my habits with colors that match my preferences.

## Acceptance Criteria
- [ ] 24 colors displayed in 3 rows of 8
- [ ] No custom color picker (removes app freeze issue)
- [ ] White color has visible border
- [ ] Selection animation and haptic feedback work
- [ ] Selected color shows checkmark

## Tasks

### T1: Update Color Palette
**File**: `src/components/CreateHabitModal/constants.ts`
- Expand `COLORS` array from 16 to 24 colors
- Add Row 3 pastel colors:
  - `#FCA5A5` (Soft Red)
  - `#FDBA74` (Peach)
  - `#86EFAC` (Mint)
  - `#7DD3FC` (Soft Blue)
  - `#C4B5FD` (Lavender)
  - `#A8A29E` (Warm Gray)
  - `#FFFFFF` (White)
  - `#FBBF24` (Amber)

### T2: Update StyleSection Layout
**File**: `src/components/CreateHabitModal/components/StyleSection.tsx`
- Ensure flex-wrap displays 3 rows properly
- Add border styling for white color: `borderWidth: 1, borderColor: '#e2e8f0'`
- Adjust checkmark color for white (use dark checkmark)

### T3: Verify No ColorPickerSheet References
**File**: `src/components/CreateHabitModal/CreateHabitModalV2.tsx`
- Confirm no `ColorPickerSheet` import or usage
- Confirm no `onCustomColorPress` prop passed to StyleSection

## Testing Checklist
- [ ] All 24 colors render in 3 rows
- [ ] Tap any color → haptic + scale animation
- [ ] Selected color shows checkmark
- [ ] White color has visible border
- [ ] White checkmark is dark colored
- [ ] No TypeScript errors
- [ ] No console warnings

## Reference
- **Design Mockup**: `.superdesign/design_iterations/color_picker_phase1_1.html`
- **Full Spec**: `docs/specs/create-habit-screen/color-picker-phase1.md`
