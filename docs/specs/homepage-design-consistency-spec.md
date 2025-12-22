# Homepage Design Consistency Spec

## Overview

This spec addresses design inconsistencies identified during a UX audit of the Habit Homepage. The goal is to unify the visual language across all homepage components for a cohesive, polished user experience.

## Related Artifacts

- **Audit Mock:** `.superdesign/design_iterations/homepage_audit_recommendations_1.html`
- **Sort Position Mocks:** `.superdesign/design_iterations/sort_position_mock_1.html`, `sort_position_mock_2.html`

---

## Issues & Specifications

### 1. Color Palette Standardization (Critical)

**Problem:** Multiple color palettes in use across homepage components.

| Component | Current Palette | Colors Used |
|-----------|----------------|-------------|
| `HabitsEmptyState` | Slate | `#0f172a`, `#475569`, `#64748b`, `#f8fafc` |
| `DraggableHabit` | Stone | `#1c1917`, `#44403c`, `#a8a29e`, `#f5f5f4` |
| `HabitsHeader` | Stone | `#44403c`, `#92400e` (amber accents) |
| `DailyMomentumMeter` | Mixed | Inline hex values |

**Specification:**
- Standardize on **Stone palette** throughout (warmer tones match beige background `#f8f5f1`)
- Replace all Slate references with Stone equivalents:

| Slate (Remove) | Stone (Use Instead) | Purpose |
|----------------|---------------------|---------|
| `#0f172a` (slate-900) | `#1c1917` (stone-900) | Primary text |
| `#475569` (slate-600) | `#57534e` (stone-600) | Secondary text |
| `#64748b` (slate-500) | `#78716c` (stone-500) | Tertiary text |
| `#94a3b8` (slate-400) | `#a8a29e` (stone-400) | Muted text |
| `#e2e8f0` (slate-200) | `#e7e5e4` (stone-200) | Borders |
| `#f8fafc` (slate-50) | `#fafaf9` (stone-50) | Surfaces |

**Files to Update:**
- `src/features/habits/components/HabitsEmptyState.tsx` — Lines 68-96 (COLORS constant)

---

### 2. Divider Style Unification (Critical)

**Problem:** Dividers use inconsistent opacity values and styling approaches.

| Location | Current Style |
|----------|---------------|
| `DraggableHabit` fallback divider | `rgba(120, 113, 108, 0.08)` |
| Card borders | `#f5f5f4` (stone-100) |
| Some components | Tailwind `border-stone-100` |

**Specification:**
- Use `#f5f5f4` (stone-100) or Tailwind `border-stone-100` for all dividers
- Divider height: `1px` (use `h-px` in Tailwind)
- Create shared constant if needed:

```typescript
// In theme or constants file
export const DIVIDER_COLOR = '#f5f5f4'; // stone-100
```

**Files to Update:**
- `src/components/DraggableHabit/DraggableHabit.tsx` — Line 584-587

---

### 3. Strength Bar Consistency (Minor)

**Problem:** When `showHabitStrengthPercentage` is false, the fallback divider differs visually from the strength bar.

**Specification:**
- Fallback divider height should match strength bar track height: `1.5px` (currently `1px`)
- Use same border-radius: `rounded-full`
- Maintain consistent vertical spacing (`mb-3`)

**Files to Update:**
- `src/components/DraggableHabit/DraggableHabit.tsx` — Lines 581-588

---

### 4. Completed Habit Visual Treatment (Minor)

**Problem:** Completed habits use `opacity-70` which dims them negatively. Contradicts positive reinforcement goal.

**Current:**
- Card opacity: 70%
- Text: strikethrough

**Specification:**
- Remove opacity reduction
- Add subtle success tint to card background: `bg-emerald-50/30` or `rgba(220, 252, 231, 0.3)`
- Keep strikethrough on habit name
- Optional: Add subtle checkmark overlay or border accent

**Files to Update:**
- `src/components/DraggableHabit/DraggableHabit.tsx` — Card background logic based on completion state

---

## Out of Scope

- Dark mode theming (colors defined but not active)
- Animation timing adjustments (currently consistent)
- Icon sizing changes (already HIG compliant at 44px)

---

## Success Criteria

1. All text colors use Stone palette consistently
2. All dividers use `stone-100` (#f5f5f4)
3. Completed habits feel celebratory, not diminished
4. No visual jarring when scrolling between components

---

## Design References

- Current homepage mock: `.superdesign/design_iterations/homepage_audit_recommendations_1.html`

---

## Tasks

**Priority:** High
**Estimated Effort:** 2-3 hours

### Phase 1: Critical Issues

- [x] **Task 1.1: Standardize HabitsEmptyState colors to Stone palette**
  - File: `src/features/habits/components/HabitsEmptyState.tsx`
  - Replace COLORS constant (lines 68-96) with Stone equivalents
  - Update all inline color references in the component
  - Test: Visual inspection of empty state matches rest of homepage
  - **Completed:** Updated COLORS constant to use Stone palette (stone-900, stone-600, stone-500, stone-400, stone-200, stone-50). Fixed ChevronDown icon color from #94a3b8 to #a8a29e.

- [x] **Task 1.2: Unify divider styles across DraggableHabit**
  - File: `src/components/DraggableHabit/DraggableHabit.tsx`
  - Replace `rgba(120, 113, 108, 0.08)` with `#f5f5f4` (stone-100)
  - Ensure divider uses `h-px` or explicit 1px height
  - Test: Dividers match card border color
  - **Completed:** Updated fallback divider to use `#f5f5f4` (stone-100) for consistency with card borders.

---

### Phase 2: Minor Issues

- [x] **Task 2.1: Adjust fallback divider height for consistency**
  - File: `src/components/DraggableHabit/DraggableHabit.tsx`
  - Change divider from `h-[1px]` to `h-[1.5px]` to match strength bar track
  - Add `rounded-full` if not present
  - Test: Visual parity between habits with/without strength bar
  - **Completed:** Updated divider height to `h-[1.5px]` and added `rounded-full` class for visual parity with strength bar track.

- [x] **Task 2.2: Update completed habit visual treatment**
  - File: `src/components/DraggableHabit/DraggableHabit.tsx`
  - Remove or reduce opacity on completed habits (currently 0.7)
  - Add subtle green tint: `backgroundColor: 'rgba(220, 252, 231, 0.3)'` when all week days are done
  - Keep strikethrough on habit name
  - Test: Completed habits feel celebratory, not dimmed
  - **Completed:** Added celebratory green tint for perfect week (emerald-50 at 30% opacity), emerald-300 border, and enhanced shadow with emerald-500 color when `isWeekComplete` is true.

---

## Verification Checklist

After completing all tasks:

- [ ] Open app and scroll through habits — no color jarring between components
- [ ] Empty state colors match habit cards when habits exist
- [ ] All dividers are same color and opacity
- [ ] Completed habits have green tint, not dimmed
- [ ] Run existing tests to ensure no regressions
