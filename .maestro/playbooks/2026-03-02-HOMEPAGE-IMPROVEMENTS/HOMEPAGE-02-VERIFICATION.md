# Homepage Improvements Playbook — Phase 02 (Verification)

## Goal

Validate all 5 homepage improvements with machine-checkable pass/fail criteria. Each check can be run independently. A full verification pass should take <2 minutes.

## Pre-flight

Before running verification, ensure:

- All source files compile: `npx tsc --noEmit 2>&1 | grep -c "error TS"` should return `0`
- ESLint max-lines passes on all changed files (listed per improvement below)

---

## Verification Checklist

### V1: Contextual Streak Greeting

- [ ] **File exists**: `useStreakGreeting.ts` hook exists in CalendarTimeline hooks directory

  ```bash
  ls src/components/CalendarTimeline/hooks/useStreakGreeting.ts
  ```

  - PASS: file exists
  - FAIL: file not found

- [ ] **Greeting logic coverage**: All 6 greeting states are implemented

  ```bash
  rg -c "Good morning|Good afternoon|Good evening|Great start|day streak|Perfect day|Fresh start" src/components/CalendarTimeline/hooks/useStreakGreeting.ts
  ```

  - PASS: count ≥ 6 (all states present)
  - FAIL: count < 6

- [ ] **Badge rendering**: Streak badge component renders in ProgressGreeting

  ```bash
  rg -n "streak-badge|streakBadge|badge.*emoji|🔥|⚡" src/components/CalendarTimeline/components/ProgressGreeting.tsx
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches

- [ ] **Old greeting removed**: `getGreeting()` standalone function is no longer the primary greeting source

  ```bash
  rg -n "getGreeting\(\)" src/components/CalendarTimeline/components/ProgressGreeting.tsx
  ```

  - PASS: 0 matches OR used only as fallback inside useStreakGreeting
  - FAIL: still used as primary greeting without streak awareness

- [ ] **Dark mode support**: Streak greeting uses isDark-aware colors

  ```bash
  rg -n "isDark" src/components/CalendarTimeline/hooks/useStreakGreeting.ts src/components/CalendarTimeline/components/ProgressGreeting.tsx
  ```

  - PASS: at least 1 match in ProgressGreeting
  - FAIL: 0 matches

- [ ] **Max-lines compliance**:
  ```bash
  wc -l src/components/CalendarTimeline/hooks/useStreakGreeting.ts src/components/CalendarTimeline/components/ProgressGreeting.tsx
  ```

  - PASS: both files ≤100 lines
  - FAIL: any file >100 lines

### V2: Completion Celebration Micro-Animation

- [ ] **Animation import**: Reanimated animation used in ProgressText

  ```bash
  rg -n "ZoomIn|FadeIn|BounceIn|withSpring|useAnimatedStyle|entering=" src/components/CalendarTimeline/components/ProgressText.tsx
  ```

  - PASS: at least 1 animation-related import/usage
  - FAIL: 0 matches

- [ ] **"All done!" still renders**: The completion text is preserved

  ```bash
  rg -n "All done" src/components/CalendarTimeline/components/ProgressText.tsx
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches (regression — removed completion text)

- [ ] **Max-lines compliance**:
  ```bash
  wc -l src/components/CalendarTimeline/components/ProgressText.tsx
  ```

  - PASS: ≤100 lines
  - FAIL: >100 lines

### V3: Week Progress Micro-Bar

- [ ] **File exists**: MicroProgressBar component created

  ```bash
  ls src/components/CalendarTimeline/components/MicroProgressBar.tsx
  ```

  - PASS: file exists
  - FAIL: file not found

- [ ] **Props interface**: Component accepts completed and total

  ```bash
  rg -n "completed.*number|total.*number" src/components/CalendarTimeline/components/MicroProgressBar.tsx
  ```

  - PASS: both props found
  - FAIL: missing props

- [ ] **Animated width**: Bar fill width is animated

  ```bash
  rg -n "withTiming|useAnimatedStyle|animatedStyle|interpolate" src/components/CalendarTimeline/components/MicroProgressBar.tsx
  ```

  - PASS: at least 1 animation usage
  - FAIL: 0 matches (static width, no animation)

- [ ] **Integrated into CalendarTimeline**: MicroProgressBar is rendered in the shelf

  ```bash
  rg -n "MicroProgressBar" src/components/CalendarTimeline/CalendarTimeline.tsx
  ```

  - PASS: at least 1 match (import + usage)
  - FAIL: 0 matches

- [ ] **Dark mode support**: Theme-aware track/fill colors

  ```bash
  rg -n "isDark" src/components/CalendarTimeline/components/MicroProgressBar.tsx
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches

- [ ] **Max-lines compliance**:
  ```bash
  wc -l src/components/CalendarTimeline/components/MicroProgressBar.tsx src/components/CalendarTimeline/CalendarTimeline.tsx
  ```

  - PASS: both files ≤100 lines
  - FAIL: any file >100 lines

### V4: Today Breathing Glow

- [ ] **Animation present**: Breathing shadow animation exists for today cell

  ```bash
  rg -n "withRepeat|breathe|glow|shadowOpacity" src/components/CalendarTimeline/components/DayCellContent.tsx src/components/CalendarTimeline/hooks/useTodayGlow.ts 2>/dev/null
  ```

  - PASS: at least 1 match in either file
  - FAIL: 0 matches in both

- [ ] **Respects reduceMotion**: Animation is gated on reduceMotion

  ```bash
  rg -n "reduceMotion" src/components/CalendarTimeline/components/DayCellContent.tsx src/components/CalendarTimeline/hooks/useTodayGlow.ts 2>/dev/null
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches (accessibility violation)

- [ ] **Only applies to today**: Animation is conditional on isCurrentDay

  ```bash
  rg -n "isCurrentDay|isToday" src/components/CalendarTimeline/components/DayCellContent.tsx src/components/CalendarTimeline/hooks/useTodayGlow.ts 2>/dev/null
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches (animation applies to all cells)

- [ ] **Max-lines compliance**:
  ```bash
  wc -l src/components/CalendarTimeline/components/DayCellContent.tsx
  ```

  - PASS: ≤100 lines
  - FAIL: >100 lines

### V5: Shelf Gradient Bleed

- [ ] **Gradient element exists**: A gradient or fade view is rendered at shelf bottom

  ```bash
  rg -n "LinearGradient|gradient|bleed|fadeOut|shelfFade" src/components/CalendarTimeline/CalendarTimeline.tsx src/components/CalendarTimeline/CalendarTimeline.styles.ts
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches

- [ ] **Non-interactive**: Gradient doesn't intercept touches

  ```bash
  rg -n "pointerEvents.*none" src/components/CalendarTimeline/CalendarTimeline.tsx src/components/CalendarTimeline/CalendarTimeline.styles.ts
  ```

  - PASS: at least 1 match
  - FAIL: 0 matches (may block touch on habit cards below)

- [ ] **Max-lines compliance**:
  ```bash
  wc -l src/components/CalendarTimeline/CalendarTimeline.tsx
  ```

  - PASS: ≤100 lines
  - FAIL: >100 lines

---

## Global Checks

- [ ] **TypeScript compiles**: No type errors in changed files

  ```bash
  npx tsc --noEmit 2>&1 | grep -E "CalendarTimeline|ProgressText|MicroProgressBar|useStreakGreeting|useTodayGlow" | grep -c "error"
  ```

  - PASS: 0 errors
  - FAIL: any errors

- [ ] **ESLint max-lines**: All changed files comply

  ```bash
  npx eslint --no-warn --rule '{"max-lines": ["error", {"max": 100, "skipBlankLines": true, "skipComments": true}]}' \
    src/components/CalendarTimeline/components/ProgressGreeting.tsx \
    src/components/CalendarTimeline/components/ProgressText.tsx \
    src/components/CalendarTimeline/components/DayCellContent.tsx \
    src/components/CalendarTimeline/CalendarTimeline.tsx \
    src/components/CalendarTimeline/CalendarTimeline.styles.ts \
    2>&1 | grep -c "max-lines"
  ```

  - PASS: 0 violations
  - FAIL: any violations

- [ ] **No hardcoded light-only colors**: Changed files use isDark-aware patterns

  ```bash
  rg -n "colors\.light\.|colors\.dark\." \
    src/components/CalendarTimeline/components/ProgressGreeting.tsx \
    src/components/CalendarTimeline/components/ProgressText.tsx \
    src/components/CalendarTimeline/components/MicroProgressBar.tsx \
    2>/dev/null
  ```

  - PASS: 0 matches (all colors flow through useThemeColors)
  - FAIL: any matches (hardcoded light/dark bypass)

- [ ] **Existing CalendarTimeline tests pass**:
  ```bash
  npx jest --testPathPattern="CalendarTimeline" --passWithNoTests 2>&1 | tail -5
  ```

  - PASS: all tests pass or no tests found
  - FAIL: test failures

---

## Quick Visual Smoke Checklist (Manual — On Device)

After all machine checks pass, verify these on a physical device or simulator:

- [ ] Light mode: Streak greeting displays correctly with badge pill
- [ ] Dark mode: Streak greeting displays correctly with amber colors
- [ ] "All done!" text bounces when completing the last habit
- [ ] Micro-bar fills smoothly as habits are checked off
- [ ] Micro-bar turns fully green on perfect day
- [ ] Today cell has a visible breathing amber glow (light mode)
- [ ] Today cell has a visible breathing amber glow (dark mode)
- [ ] Glow stops when today cell is completed (becomes green)
- [ ] Shelf gradient bleed creates smooth transition to habit cards
- [ ] No visual regression on week navigation (swipe left/right)
- [ ] reduceMotion ON: all animations are disabled
- [ ] Calendar glass chip remains centered
- [ ] "Today →" link still appears when viewing past weeks

## Run Script

To run all machine-checkable verifications at once:

```bash
#!/bin/bash
echo "=== Homepage Improvements Verification ==="
PASS=0; FAIL=0

check() {
  local name="$1"; local cmd="$2"; local expect="$3"
  result=$(eval "$cmd" 2>/dev/null)
  if [ "$result" = "$expect" ]; then
    echo "  ✅ $name"
    ((PASS++))
  else
    echo "  ❌ $name (got: $result, expected: $expect)"
    ((FAIL++))
  fi
}

# V1
echo "--- V1: Streak Greeting ---"
check "File exists" "test -f src/components/CalendarTimeline/hooks/useStreakGreeting.ts && echo yes" "yes"
check "All greeting states" "rg -c 'Good morning\|Good afternoon\|Good evening\|Great start\|day streak\|Perfect day\|Fresh start' src/components/CalendarTimeline/hooks/useStreakGreeting.ts 2>/dev/null || echo 0" "≥6"

# V2
echo "--- V2: Completion Celebration ---"
check "Animation in ProgressText" "rg -c 'ZoomIn\|FadeIn\|BounceIn\|entering=' src/components/CalendarTimeline/components/ProgressText.tsx 2>/dev/null || echo 0" "≥1"

# V3
echo "--- V3: Micro-Bar ---"
check "File exists" "test -f src/components/CalendarTimeline/components/MicroProgressBar.tsx && echo yes" "yes"
check "Integrated" "rg -c 'MicroProgressBar' src/components/CalendarTimeline/CalendarTimeline.tsx 2>/dev/null || echo 0" "≥1"

# V4
echo "--- V4: Today Glow ---"
check "Animation present" "rg -c 'withRepeat\|breathe\|glow' src/components/CalendarTimeline/components/DayCellContent.tsx src/components/CalendarTimeline/hooks/useTodayGlow.ts 2>/dev/null | paste -sd+ | bc || echo 0" "≥1"

# V5
echo "--- V5: Gradient Bleed ---"
check "Gradient element" "rg -c 'LinearGradient\|gradient\|bleed\|shelfFade' src/components/CalendarTimeline/CalendarTimeline.tsx src/components/CalendarTimeline/CalendarTimeline.styles.ts 2>/dev/null | paste -sd+ | bc || echo 0" "≥1"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
```
