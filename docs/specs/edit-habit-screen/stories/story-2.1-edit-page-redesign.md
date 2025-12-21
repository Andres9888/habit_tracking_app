# Story 2.1: Edit Habit Page - Major Redesign

Status: Draft

## Story

As a **user editing an existing habit**,
I want **a modern, intuitive edit experience that matches the polished Create Habit flow**,
so that **I can easily modify my habit's settings with the same delightful UX I experienced when creating it**.

---

## Problem Statement

The current `HabitEditScreen` has several UX issues compared to the modern `CreateHabitModalV2`:

| Issue | Current State | Target State |
|-------|---------------|--------------|
| **Color selection** | Random color on emoji change, no explicit picker | 24-color palette in 3 rows (matches create flow) |
| **Emoji selection** | Opens separate sheet, disconnected from preview | Integrated emoji picker with live preview |
| **Visual hierarchy** | Flat sections, no clear grouping | Card-based sections with clear visual separation |
| **Delete action** | Top-right trash icon (dangerous placement) | Bottom section with confirmation dialog |
| **Goal unit picker** | Non-functional dropdown (visual only) | Working picker modal or inline selection |
| **Missing features** | No cue/affirmations access, no archive option | Links to advanced features from habit detail |

---

## Acceptance Criteria

### AC1: Color Picker Parity
- [x] Display 24 curated colors in 3 rows (same as `CreateHabitModalV2`)
- [x] Remove random color assignment on emoji change
- [x] Selected color shows checkmark indicator
- [x] White color has visible border

**Note:** Using 16 colors from shared COLORS constant (2 rows) to match CreateHabitModal exactly.

### AC2: Icon/Emoji Selection
- [ ] Large icon preview at top (current implementation - keep)
- [ ] "Browse Icons" opens `EmojiPickerSheet` (current - keep)
- [ ] Color selection is explicit (separate from emoji)

### AC3: Improved Visual Hierarchy
- [ ] Group related settings into clear card sections
- [ ] Section headers with consistent typography
- [ ] Proper spacing between sections (16px gap)

### AC4: Safe Delete Flow
- [ ] Move delete action to bottom "Danger Zone" section
- [ ] Require confirmation dialog before delete
- [ ] Show habit name in confirmation ("Delete 'Exercise'?")
- [ ] Cancel and Delete buttons (Delete in red)

### AC5: Working Goal Unit Picker
- [ ] Tapping unit dropdown opens selection modal
- [ ] Options: minutes, hours, times, pages, reps, steps, glasses
- [ ] Selected unit persists on save

### AC6: Archive Option
- [ ] Add "Archive Habit" option in Manage section
- [ ] Archive confirmation dialog
- [ ] Archived habits hidden from home but data preserved

### AC7: Link to Advanced Features
- [ ] "Edit Cue & Intention" row → navigates to cue editor
- [ ] "Edit Affirmations" row → navigates to affirmations editor
- [ ] "View Why & Vision Board" row → navigates to motivation section

---

## Tasks / Subtasks

### T1: Color Picker Integration (AC: 1)
- [x] Import `COLORS` constant from `CreateHabitModal/constants.ts`
- [x] Replace random color logic with explicit color picker grid
- [x] Style color circles with selection indicator
- [x] Add white color border styling

**Completion Notes (T1):** Implemented 16-color picker with animated selection, haptic feedback, and checkmark indicators. Light colors display gray checkmark for contrast. White color shows subtle border. Removed random color assignment on emoji change.

### T2: Improve Section Layout (AC: 3)
- [ ] Create consistent `SectionCard` component or use shared styling
- [ ] Group into: Identity, Schedule, Reminders, Goals, Advanced, Manage
- [ ] Apply 16px gap between sections

### T3: Relocate Delete Action (AC: 4)
- [ ] Remove trash icon from header
- [ ] Add "Danger Zone" section at bottom
- [ ] Implement confirmation dialog with habit name
- [ ] Style delete button as destructive (red)

### T4: Goal Unit Picker (AC: 5)
- [ ] Create simple bottom sheet or inline picker
- [ ] Wire up unit selection state
- [ ] Ensure unit persists through save

### T5: Archive Habit Feature (AC: 6)
- [ ] Add "Archive" button in Manage section
- [ ] Implement archive confirmation dialog
- [ ] Call `archiveHabit` mutation (if exists, or create)
- [ ] Navigate back to home on archive

### T6: Advanced Feature Links (AC: 7)
- [ ] Add navigation rows for Cue, Affirmations, Vision Board
- [ ] Wire up navigation to respective screens/modals
- [ ] Show chevron-right indicator

### T7: Polish & Testing
- [ ] Verify all interactions have haptic feedback
- [ ] Test on iOS and Android
- [ ] Ensure no TypeScript errors
- [ ] Test keyboard handling for text inputs

---

## Dev Notes

### Architecture Pattern
- `HabitEditScreen` is a modal (`<Modal>` component)
- Uses Convex mutations for `updateHabit` and `removeHabit`
- Should reuse components from `CreateHabitModal` where possible

### Shared Components to Reuse
- `COLORS` array from `src/components/CreateHabitModal/constants.ts`
- Color selection UI pattern from `StyleSection.tsx`
- `EmojiPickerSheet` already integrated (keep as-is)

### Mutations Available
- `api.habits.update` - existing
- `api.habits.remove` - existing
- `api.habits.archive` - may need to create

### Testing Strategy
- Manual testing on iOS simulator
- Test all AC items against checklist
- Verify haptic feedback on selections
- Test reminder time picker works

### Project Structure Notes

**Files to modify:**
- `src/screens/HabitEditScreen.tsx` - main changes

**Files to reference:**
- `src/components/CreateHabitModal/constants.ts` - COLORS array
- `src/components/CreateHabitModal/components/StyleSection.tsx` - color picker pattern
- `docs/specs/settings-page/archive-habits-ux-spec.md` - archive flow spec

### References

- [Source: src/screens/HabitEditScreen.tsx] - Current implementation
- [Source: docs/specs/create-habit-screen/color-picker-phase1.md] - Color picker spec
- [Source: docs/specs/settings-page/archive-habits-ux-spec.md] - Archive habits spec
- [Source: docs/specs/habit-details-screen/stories/story-1.9.4-habit-detail-manage-actions.md] - Manage actions pattern

---

## Change Log

| Date       | Version | Description   | Author |
| ---------- | ------- | ------------- | ------ |
| 2025-12-21 | 0.1     | Initial draft | Bob    |

---

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML/JSON will be added here by context workflow -->

### Agent Model Used

Claude Opus 4.5

### Debug Log References

### Completion Notes List

### File List

- `src/screens/HabitEditScreen.tsx`
- `src/components/CreateHabitModal/constants.ts`
- `convex/habits.ts` (if archive mutation needed)
