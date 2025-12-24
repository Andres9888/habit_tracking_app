# Color Palette Standardization - Tech Spec

## Overview

Standardize the app's color palette from Slate (cool bluish-gray) to Stone (warm gray) across all 56 affected files to ensure visual consistency with the homepage design system.

**Priority:** Critical (Ship Blocker)
**Estimated Effort:** 4-6 hours
**Impact:** HIGH - Visual inconsistency damages perceived app quality

---

## Problem Statement

The app currently uses two conflicting gray palettes:
- **Homepage & Core UI:** Stone palette (warm gray, #f8f5f1 background)
- **Auth screens, Modals, Components:** Slate palette (cool bluish-gray)

This creates jarring color temperature shifts when navigating between screens, making the app feel unpolished.

### Current State
- **299 instances** of `slate-` classes across **56 files**
- Mix of Tailwind classes (`slate-900`) and inline hex values (`#94a3b8`)
- Inconsistent application of design system

---

## Solution

Global find-and-replace of Slate palette with Stone equivalents.

### Color Mapping

| Slate Class | Slate Hex | Stone Class | Stone Hex |
|-------------|-----------|-------------|-----------|
| `slate-900` | `#0f172a` | `stone-900` | `#1c1917` |
| `slate-800` | `#1e293b` | `stone-800` | `#292524` |
| `slate-700` | `#334155` | `stone-700` | `#44403c` |
| `slate-600` | `#475569` | `stone-600` | `#57534e` |
| `slate-500` | `#64748b` | `stone-500` | `#78716c` |
| `slate-400` | `#94a3b8` | `stone-400` | `#a8a29e` |
| `slate-300` | `#cbd5e1` | `stone-300` | `#d6d3d1` |
| `slate-200` | `#e2e8f0` | `stone-200` | `#e7e5e4` |
| `slate-100` | `#f1f5f9` | `stone-100` | `#f5f5f4` |
| `slate-50`  | `#f8fafc` | `stone-50`  | `#fafaf9` |

### Hex Value Replacements

```
#0f172a → #1c1917
#1e293b → #292524
#334155 → #44403c
#475569 → #57534e
#64748b → #78716c
#94a3b8 → #a8a29e
#cbd5e1 → #d6d3d1
#e2e8f0 → #e7e5e4
#f1f5f9 → #f5f5f4
#f8fafc → #fafaf9
```

---

## Files to Update (56 total)

### Priority 1: Auth Flow (12 files)
```
src/screens/auth/SignInScreen.tsx
src/screens/auth/SignUpScreen.tsx
src/screens/auth/WelcomeScreen.tsx
src/screens/auth/components/FormInput/FormInput.tsx
src/screens/auth/components/SubmitButton/SubmitButton.tsx
src/screens/auth/components/VerificationView/VerificationView.tsx
src/screens/auth 2/                          ← DELETE (duplicate directory)
```

### Priority 2: Core Screens (2 files)
```
src/screens/HabitDetailScreen.tsx
src/screens/HabitEditScreen.tsx
```

### Priority 3: CreateHabitModal (10 files)
```
src/components/CreateHabitModal/ColorPickerSheet.tsx
src/components/CreateHabitModal/CreateHabitModalV2.tsx
src/components/CreateHabitModal/components/*.tsx
```

### Priority 4: Modals (8 files)
```
src/components/ArchivedHabitsModal/ArchivedHabitsModal.tsx
src/components/PausedHabitsModal/PausedHabitsModal.tsx
src/components/HabitCalendarModal/*.tsx
src/components/StatsNotesModal/*.tsx
```

### Priority 5: Base Components (10 files)
```
src/components/Button.tsx
src/components/Card.tsx
src/components/Checkbox.tsx
src/components/SegmentedControl.tsx
src/components/Switch.tsx
src/components/ChainConnector/ChainConnector.tsx
src/components/StreakChain/StreakChain.tsx
src/components/auth/SocialLoginButtons.tsx
```

---

## Implementation Plan

### Phase 1: Cleanup (15 min)
- [ ] Delete `src/screens/auth 2/` directory (duplicate)
- [ ] Verify no imports reference deleted files

### Phase 2: Automated Replace (30 min)
```bash
# Tailwind class replacements
find src -name "*.tsx" -exec sed -i '' 's/slate-900/stone-900/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-800/stone-800/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-700/stone-700/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-600/stone-600/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-500/stone-500/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-400/stone-400/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-300/stone-300/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-200/stone-200/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-100/stone-100/g' {} +
find src -name "*.tsx" -exec sed -i '' 's/slate-50/stone-50/g' {} +
```

### Phase 3: Hex Value Replace (30 min)
```bash
find src -name "*.tsx" -exec sed -i '' 's/#94a3b8/#a8a29e/g' {} +
# ... (see full mapping above)
```

### Phase 4: Manual Review (2-3 hours)
- [ ] Review auth screens for context-specific adjustments
- [ ] Check placeholder text colors
- [ ] Verify border colors

### Phase 5: Visual QA (1 hour)
- [ ] Navigate all screens - verify no jarring color shifts
- [ ] Test dark text on light backgrounds (contrast)

---

## Acceptance Criteria

1. `grep -r "slate-" src --include="*.tsx"` returns 0 results
2. Visual consistency across auth → home → modal transitions
3. All tests pass
4. No TypeScript errors

---

## Related Specs

- `docs/specs/homepage-design-consistency-spec.md` (completed)
- `docs/specs/login-screen/login-screen.md`
