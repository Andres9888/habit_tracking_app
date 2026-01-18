# Codebase Cleanup & Type Safety - Technical Specification

**Version:** 1.0
**Date:** December 22, 2024
**Status:** Planning 📋
**Priority:** High 🔴
**Estimated Effort:** 4-6 hours

---

## Executive Summary

Critical codebase health issues identified across TypeScript compilation, duplicate files, test failures, and dependency API mismatches. This specification outlines a systematic cleanup plan to restore type safety, eliminate redundant files, fix broken tests, and upgrade dependencies to stable versions.

**Impact:** 24 TypeScript errors, 59 failed test suites, 319 failed tests, ~100+ duplicate files cluttering the codebase.

---

## 1. Problem Analysis

### 1.1 Issue Categories

```typescript
Critical Issues (Block Production):
  ✗ 24 TypeScript compilation errors
  ✗ Convex alpha dependency (1.21.1-alpha.1)
  ✗ Duplicate file redeclarations
  ✗ Missing type exports from dependencies

High Priority (Block Development):
  ✗ 59 failed test suites (46% failure rate)
  ✗ 319 failed tests
  ✗ Duplicate numbered files (" 2.tsx", " 3.tsx", " 4.tsx")

Medium Priority (Code Quality):
  ✗ Type mismatches (null vs undefined)
  ✗ Variable hoisting errors
  ✗ Missing null guards
```

### 1.2 Root Causes

```typescript
1. File System Pollution
   - Finder/macOS duplicate creation (" 2.tsx")
   - Git not tracking filename changes
   - Copy-paste iterations left in codebase
   - Files: ~100+ across src/ and worktrees/

2. Dependency API Breaking Changes
   - reanimated-color-picker: Changed named exports
   - react-native-reanimated: SharedValue namespace change
   - react-native-draggable-flatlist: runOnUI API change
   - Root: Package updates without code migration

3. Type Safety Gaps
   - null vs undefined inconsistency
   - Missing optional chaining
   - Type assertions without validation
   - Variable declaration order issues

4. Test Infrastructure Fragmentation
   - Mock configuration incomplete
   - Worktree tests not synced with main
   - Jest setup missing for newer APIs
```

---

## 2. Issue Inventory

### 2.1 TypeScript Compilation Errors (24 Total)

#### Category A: Duplicate File Redeclarations (6 errors)

```typescript
Error: TS2451: Cannot redeclare block-scoped variable

Files Affected:
  src/components/CalendarTimeline/CalendarTimelineDebug 2.tsx
  src/components/CalendarTimeline/CalendarTimelineDebug 3.tsx

Root Cause: Same component exported with same name in multiple files

Resolution: Delete numbered duplicates, keep canonical version
```

#### Category B: Dependency API Mismatches (5 errors)

```typescript
Error: TS2614: Module has no exported member

Files Affected:
  src/components/CreateHabitModal/ColorPickerSheet.tsx
    - HueSlider (line 13)
    - SaturationSlider (line 15)

Root Cause: reanimated-color-picker changed exports from named to default
Previous: import { HueSlider } from 'reanimated-color-picker'
Current:   import HueSlider from 'reanimated-color-picker'

Resolution: Update import statements to default imports
```

```typescript
Error: TS2769: No overload matches this call

Files Affected:
  src/components/CreateHabitModal/ColorPickerSheet.tsx (line 329)
    Property 'thumbShape' does not exist

Root Cause: BrightnessSlider API changed, thumbShape removed

Resolution: Remove thumbShape prop or migrate to new API
```

```typescript
Error: TS2694: Namespace has no exported member 'SharedValue'

Files Affected:
  src/components/HabitStrengthSection/HabitStrengthSection.tsx (line 136)

Root Cause: react-native-reanimated changed export structure
Previous: Animated.SharedValue
Current:   SharedValue (direct import)

Resolution: Import SharedValue directly from 'react-native-reanimated'
```

```typescript
Error: Property does not exist on type

Files Affected:
  src/components/MiniTemplateCard.tsx (line 200)
    Property 'delayPressIn' does not exist

Root Cause: AnimatedPressable doesn't support delayPressIn

Resolution: Remove delayPressIn or use regular Pressable wrapper
```

#### Category C: Type Mismatches (7 errors)

```typescript
Error: TS2345: Argument type not assignable

Files Affected:
  src/components/CalendarTimeline/CalendarTimelineDebug 2.tsx (line 44)
  src/components/CalendarTimeline/CalendarTimelineDebug 3.tsx (line 44)
  src/components/CalendarTimeline/CalendarTimelineWithPulse 2.tsx (line 76)

Issue: format(Date | undefined) → expects Date
Code: format(habitCreatedDate, 'MMM d')

Resolution: Add null guard
  habitCreatedDate ? format(habitCreatedDate, 'MMM d') : 'N/A'
```

```typescript
Error: TS2345: Type 'null' not assignable to 'undefined'

Files Affected:
  src/components/PhaseTag/PhaseTag.tsx (line 27)
  src/components/PhaseTag/PhaseTag 2.tsx (line 27)
  src/components/PhaseTag/PhaseTag 3.tsx (line 27)
  src/components/PhaseTag/PhaseTag 4.tsx (line 27)

Issue: Function expects HubermanPhase | undefined, receives null
Code: getPhaseColor(currentPhase)  // currentPhase can be null

Resolution: Normalize null to undefined
  getPhaseColor(currentPhase ?? undefined)
```

```typescript
Error: TS2322: Type not assignable to type 'boolean'

Files Affected:
  src/components/SettingsDialog/SettingsDialog.tsx (line 43)
    Type 'string | boolean' not assignable to 'boolean'

Issue: AsyncStorage returns string | null, not boolean

Resolution: Parse string to boolean
  const value = await AsyncStorage.getItem(key)
  return value === 'true'
```

```typescript
Error: TS2322: Type 'unknown' not assignable to 'boolean'

Files Affected:
  src/components/StreakChainSection/StreakChainSection.tsx (lines 377, 382)

Issue: Type assertion without validation

Resolution: Add type guard or explicit cast
  const isEnabled = value as boolean
  // OR
  if (typeof value === 'boolean') { ... }
```

#### Category D: Variable Declaration Issues (2 errors)

```typescript
Error: TS2448/TS2454: Variable used before declaration/assignment

Files Affected:
  src/screens/HabitDetailScreen.tsx (line 1608)
    Block-scoped variable 'isWhyEditorOpen' used before declaration

Issue: useEffect dependency array references variable declared later
Code:
  }, [isKeyboardVisible, isWhyEditorOpen, ...]);
  // ... many lines later ...
  const [isWhyEditorOpen, setIsWhyEditorOpen] = useState(false);

Resolution: Move useState declaration above useEffect
```

#### Category E: Type Interface Mismatches (4 errors)

```typescript
Error: TS2322: Type not assignable to IntrinsicAttributes

Files Affected:
  src/components/CreateHabitModal/CreateHabitModalV2 2.tsx (line 93)
    Property 'emojis' does not exist on type 'StyleSectionProps'

  src/components/CreateHabitModal/CreateHabitModalV2 2.tsx (line 147)
    Property 'presetColors' does not exist on type 'ColorPickerSheetProps'

Issue: Props interface out of sync with component implementation

Resolution: Update interface definitions or remove invalid props
```

### 2.2 Duplicate Files (100+ files)

```typescript
Pattern Analysis:
  " 2.tsx" / " 2.ts"  →  68 files
  " 3.tsx" / " 3.ts"  →  24 files
  " 4.tsx" / " 4.ts"  →   8 files

Common Locations:
  src/components/CalendarTimeline/
  src/components/CategoryChip/
  src/components/PhaseTag/
  src/components/CreateHabitModal/
  src/constants/
  src/screens/
  worktrees/habit-template/

Cleanup Strategy:
  1. Identify canonical version (newest or most complete)
  2. Verify duplicate is exact copy or has diverged
  3. Delete numbered duplicates
  4. Update imports if needed
  5. Run tests to verify no breakage
```

### 2.3 Test Failures (59 suites, 319 tests)

```typescript
Failure Categories:

1. Missing Mock Configuration (80% of failures)
   Error: "(0, _reactNativeReanimated.runOnUI) is not a function"

   Affected:
     - react-native-reanimated APIs
     - react-native-draggable-flatlist
     - All tests importing gesture/animation components

   Resolution: Update jest.setup.js with proper mocks

2. Module Resolution (15% of failures)
   Error: "Cannot find module '../index'"

   Affected:
     - worktrees/habit-template/tests
     - Path aliases not resolving

   Resolution: Fix tsconfig paths, sync worktree config

3. Worktree Tests Out of Sync (5% of failures)
   Error: Tests reference old component APIs

   Resolution: Remove worktree tests or sync with main
```

---

## 3. Resolution Plan

### 3.1 Phase 1: Duplicate File Cleanup (1-2 hours)

**Objective:** Remove all numbered duplicate files, establish canonical versions

```bash
# Step 1: Generate file inventory
find src worktrees -name "* 2.tsx" -o -name "* 2.ts" \
  -o -name "* 3.tsx" -o -name "* 3.ts" \
  -o -name "* 4.tsx" -o -name "* 4.ts" > duplicates.txt

# Step 2: For each duplicate, compare with canonical
for file in $(cat duplicates.txt); do
  canonical="${file% [0-9].tsx}.tsx"  # Remove " 2" suffix
  diff "$file" "$canonical"
done

# Step 3: Delete duplicates (after manual review)
cat duplicates.txt | xargs rm

# Step 4: Update imports (if any references exist)
grep -r "CalendarTimelineDebug 2" src/
grep -r "PhaseTag 2" src/
# ... fix import paths

# Step 5: Verify builds
npm run lint
```

**Safety Checks:**
- Git status before deletion (ensure no uncommitted work)
- Backup duplicates to `/tmp` before permanent deletion
- Search codebase for imports referencing numbered files
- Test suite run after cleanup

**Files to Delete (High Confidence):**
```
src/components/CalendarTimeline/CalendarTimelineDebug 2.tsx
src/components/CalendarTimeline/CalendarTimelineDebug 3.tsx
src/components/CalendarTimeline/CalendarTimelineWithPulse 2.tsx
src/components/CreateHabitModal/CreateHabitModalV2 2.tsx
src/components/PhaseTag/PhaseTag 2.tsx
src/components/PhaseTag/PhaseTag 3.tsx
src/components/PhaseTag/PhaseTag 4.tsx
src/components/CategoryChip/CategoryChip 2.tsx
src/components/CategoryChip/CategoryChip 3.tsx
src/constants/motion 2.ts
src/constants/motion 3.ts
src/constants/motion 4.ts
... (and ~90 more)
```

### 3.2 Phase 2: TypeScript Error Resolution (2-3 hours)

#### Fix 1: Dependency Import Updates

```typescript
// File: src/components/CreateHabitModal/ColorPickerSheet.tsx

// BEFORE (Named Imports - BROKEN)
import {
  BrightnessSlider,
  HueSlider,
  Preview,
  SaturationSlider,
} from 'reanimated-color-picker';

// AFTER (Default Imports)
import ColorPicker, {
  BrightnessSlider,
  Preview,
} from 'reanimated-color-picker';
import HueSlider from 'reanimated-color-picker/HueSlider';
import SaturationSlider from 'reanimated-color-picker/SaturationSlider';

// OR (Check package exports)
import { default as HueSlider } from 'reanimated-color-picker';
import { default as SaturationSlider } from 'reanimated-color-picker';
```

```typescript
// File: src/components/CreateHabitModal/ColorPickerSheet.tsx (line 329)

// BEFORE (Invalid Prop)
<BrightnessSlider
  style={{ borderRadius: 8, height: 40, marginBottom: 12 }}
  thumbShape="circle"  // ← Property removed in new version
/>

// AFTER (Remove Invalid Prop)
<BrightnessSlider
  style={{ borderRadius: 8, height: 40, marginBottom: 12 }}
/>
```

```typescript
// File: src/components/HabitStrengthSection/HabitStrengthSection.tsx

// BEFORE (Namespace Import - BROKEN)
import Animated from 'react-native-reanimated';
const value: Animated.SharedValue<number> = ...;

// AFTER (Direct Import)
import { SharedValue } from 'react-native-reanimated';
const value: SharedValue<number> = ...;
```

```typescript
// File: src/components/MiniTemplateCard.tsx (line 200)

// BEFORE (Unsupported Prop on AnimatedPressable)
<AnimatedPressable
  delayPressIn={0}  // ← Not supported by Animated wrapper
  onPress={handlePress}
  style={animatedStyle}
>

// AFTER (Wrap Regular Pressable)
<Animated.View style={animatedStyle}>
  <Pressable
    delayPressIn={0}
    onPress={handlePress}
  >
    {children}
  </Pressable>
</Animated.View>
```

#### Fix 2: Type Safety Guards

```typescript
// File: src/components/CalendarTimeline/CalendarTimelineDebug.tsx (line 44)

// BEFORE (Unsafe Date | undefined)
const createdDateStr = format(habitCreatedDate, 'MMM d');

// AFTER (Null Guard)
const createdDateStr = habitCreatedDate
  ? format(habitCreatedDate, 'MMM d')
  : 'N/A';
```

```typescript
// File: src/components/PhaseTag/PhaseTag.tsx (line 27)

// BEFORE (null not assignable to undefined)
const phaseColor = getPhaseColor(currentPhase);  // currentPhase: Phase | null

// AFTER (Normalize null to undefined)
const phaseColor = getPhaseColor(currentPhase ?? undefined);

// OR (Update function signature)
// In utils file:
function getPhaseColor(phase: HubermanPhase | null | undefined): string {
  if (!phase) return '#gray';
  // ...
}
```

```typescript
// File: src/components/SettingsDialog/SettingsDialog.tsx (line 43)

// BEFORE (String | Boolean mismatch)
const enabled = await AsyncStorage.getItem('setting');
setState(enabled);  // enabled: string | null, expects boolean

// AFTER (Parse String to Boolean)
const value = await AsyncStorage.getItem('setting');
const enabled = value === 'true';
setState(enabled);
```

```typescript
// File: src/components/StreakChainSection/StreakChainSection.tsx (lines 377, 382)

// BEFORE (Unknown type)
const value = someFunction();
setState(value);  // value: unknown, expects boolean

// AFTER (Type Guard)
const value = someFunction();
if (typeof value === 'boolean') {
  setState(value);
} else {
  console.warn('Unexpected value type:', typeof value);
  setState(false);  // Default fallback
}
```

#### Fix 3: Variable Declaration Order

```typescript
// File: src/screens/HabitDetailScreen.tsx

// BEFORE (Variable used before declaration)
useEffect(() => {
  // ...animations...
}, [isKeyboardVisible, isWhyEditorOpen, ...]);  // ← Line 1608

// ... 500+ lines later ...

const [isWhyEditorOpen, setIsWhyEditorOpen] = useState(false);  // ← Line 2100+

// AFTER (Move declaration above useEffect)
const [isWhyEditorOpen, setIsWhyEditorOpen] = useState(false);

useEffect(() => {
  // ...animations...
}, [isKeyboardVisible, isWhyEditorOpen, ...]);
```

#### Fix 4: Props Interface Sync

```typescript
// File: src/components/CreateHabitModal/CreateHabitModalV2 2.tsx
// (Note: This file should be deleted in Phase 1, but documenting fix)

// StyleSectionProps Interface (add missing fields)
interface StyleSectionProps {
  colors: string[];
  emojis: string[];  // ← Add this
  selectedColor: string;
  selectedEmoji: string | null;
  suggestedEmojis: string[];
  onCustomColorPress: () => void;
  onSelectColor: (color: string) => void;
  onSelectEmoji: (emoji: string | null) => void;
}

// ColorPickerSheetProps Interface (add missing fields)
interface ColorPickerSheetProps {
  visible: boolean;
  value: string;
  presetColors: string[];  // ← Add this
  onSelect: (color: string) => void;
  onClose: () => void;
}
```

### 3.3 Phase 3: Test Infrastructure Fixes (1-2 hours)

#### Fix 1: Jest Mock Configuration

```typescript
// File: jest.setup.js (or create if missing)

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Mock runOnUI (missing in current mock)
  Reanimated.runOnUI = (fn) => fn;

  // Mock other missing APIs
  Reanimated.withSpring = (value) => value;
  Reanimated.withTiming = (value) => value;
  Reanimated.withDelay = (delay, value) => value;
  Reanimated.withSequence = (...values) => values[values.length - 1];
  Reanimated.withRepeat = (value) => value;
  Reanimated.cancelAnimation = jest.fn();

  return Reanimated;
});

// Mock react-native-draggable-flatlist
jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');

  return {
    __esModule: true,
    default: (props) => React.createElement(FlatList, props),
  };
});

// Mock @shopify/react-native-skia (if needed)
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Path: 'Path',
  Skia: {
    Path: {
      Make: jest.fn(),
    },
  },
}));
```

#### Fix 2: Worktree Test Cleanup

```bash
# Option A: Remove worktree tests (if not actively used)
rm -rf worktrees/habit-template/src/hooks/tests
rm -rf worktrees/habit-template/tests

# Option B: Sync worktree tests with main
rsync -av src/__tests__/ worktrees/habit-template/src/__tests__/
rsync -av jest.config.js worktrees/habit-template/
rsync -av jest.setup.js worktrees/habit-template/

# Update worktree tsconfig.json to match main
cp tsconfig.json worktrees/habit-template/tsconfig.json
```

#### Fix 3: Module Resolution

```json
// File: worktrees/habit-template/tsconfig.json (if keeping worktree tests)

{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["../../src/*"]  // Reference main src if needed
    }
  }
}
```

### 3.4 Phase 4: Dependency Upgrade (Optional, 1 hour)

**Risk:** Medium - Could introduce new breaking changes
**Benefit:** Stability, security patches, community support

```bash
# Current (Alpha/Unstable)
"convex": "1.21.1-alpha.1"

# Upgrade to Latest Stable
npm install convex@latest

# Verify no breaking changes
npm run lint
npm test

# Check for deprecation warnings
npm audit
```

**Dependency Audit:**
```json
{
  "reanimated-color-picker": "^4.1.1",  // Check for latest
  "react-native-reanimated": "~4.1.1",  // Check for patch updates
  "react-native-draggable-flatlist": "^4.0.3",  // Check for latest
  "@shopify/react-native-skia": "^2.2.12"  // Check for latest
}
```

---

## 4. Testing Strategy

### 4.1 Pre-Cleanup Baseline

```bash
# Capture current state
npm run lint 2>&1 | tee baseline-lint.log
npm test 2>&1 | tee baseline-test.log

# Count errors
grep "error TS" baseline-lint.log | wc -l  # Should be 24
grep "FAIL" baseline-test.log | wc -l     # Should be 59
```

### 4.2 Post-Phase Verification

```bash
# After Phase 1 (Duplicate Cleanup)
npm run lint  # Should reduce to 18 errors (6 duplicates removed)
npm test      # Should maintain same test count (no new failures)
git status    # Verify only deletions, no unintended changes

# After Phase 2 (TypeScript Fixes)
npm run lint  # Should be 0 errors
tsc -p tsconfig.app.json --noEmit  # Double-check

# After Phase 3 (Test Fixes)
npm test      # Should pass >90% of tests
npm run test:coverage  # Check coverage didn't drop

# After Phase 4 (Dependency Upgrade)
npm run lint  # Should be 0 errors
npm test      # Should maintain test pass rate
npm run dev   # Manual smoke test
```

### 4.3 Integration Testing

```typescript
Manual Test Checklist:
  □ Create new habit (ColorPickerSheet modal)
  □ View habit detail screen (HabitDetailScreen)
  □ Interact with calendar heatmap (scroll, tap cells)
  □ Toggle habit completion (animations work)
  □ View settings dialog (AsyncStorage reads)
  □ Navigate between tabs (no console errors)
  □ Test on iOS simulator
  □ Test on Android emulator
  □ Check web build (expo export -p web)
```

---

## 5. Risk Mitigation

### 5.1 Backup Strategy

```bash
# Create safety branch before starting
git checkout -b backup/pre-cleanup-$(date +%Y%m%d)
git push origin backup/pre-cleanup-$(date +%Y%m%d)

# Create tarball of current state
tar -czf backup-codebase-$(date +%Y%m%d).tar.gz \
  src/ worktrees/ package.json tsconfig.json jest.setup.js

# Move to safe location
mv backup-codebase-*.tar.gz ~/Desktop/backups/
```

### 5.2 Rollback Plan

```bash
# If Phase 1 breaks builds
git checkout HEAD -- src/ worktrees/
git clean -fd  # Remove untracked deleted files

# If Phase 2 introduces runtime errors
git revert <commit-hash>

# If Phase 3 breaks tests worse
git checkout backup/pre-cleanup-<date>

# If Phase 4 dependency upgrade fails
npm install  # Restore package-lock.json
```

### 5.3 Progressive Deployment

```typescript
Recommended Approach:
  1. Complete Phase 1 → Commit → Verify
  2. Complete Phase 2 → Commit → Verify
  3. Complete Phase 3 → Commit → Verify
  4. Complete Phase 4 → Commit → Verify

DO NOT:
  - Complete all phases then commit once
  - Skip verification steps
  - Rush through without testing
```

---

## 6. Success Criteria

### 6.1 Quantitative Metrics

```typescript
TypeScript Errors:
  Before: 24 errors
  Target: 0 errors
  Threshold: Pass if 0

Test Pass Rate:
  Before: 54% (1791/2110 passing)
  Target: 95% (2000+/2110 passing)
  Threshold: Pass if >90%

Duplicate Files:
  Before: ~100 numbered files
  Target: 0 numbered files
  Threshold: Pass if 0

Build Success:
  Before: Fails (TypeScript errors)
  Target: Succeeds (npm run lint exits 0)
  Threshold: Pass if exits 0
```

### 6.2 Qualitative Metrics

```typescript
Code Quality:
  □ No console warnings during development
  □ IntelliSense autocomplete works correctly
  □ No red squiggles in VSCode
  □ Import suggestions are accurate

Developer Experience:
  □ Faster TypeScript compilation (<5s)
  □ Clearer error messages (no duplicate noise)
  □ Easier file navigation (no numbered clutter)
  □ Reliable test suite (predictable results)

Production Readiness:
  □ All production builds succeed
  □ No runtime type errors in logs
  □ Stable dependency versions
  □ Clean git status (no untracked duplicates)
```

---

## 7. Implementation Timeline

### 7.1 Estimated Effort Breakdown

```typescript
Phase 1: Duplicate Cleanup
  - File inventory: 15 min
  - Manual review: 30 min
  - Deletion + verification: 30 min
  - Import fixes: 15 min
  Total: 1.5 hours

Phase 2: TypeScript Fixes
  - Dependency imports: 30 min
  - Type guards: 45 min
  - Variable reordering: 15 min
  - Interface updates: 30 min
  Total: 2 hours

Phase 3: Test Fixes
  - Jest mock updates: 30 min
  - Worktree cleanup: 15 min
  - Module resolution: 15 min
  - Verification: 30 min
  Total: 1.5 hours

Phase 4: Dependency Upgrade (Optional)
  - Research latest versions: 15 min
  - Upgrade + test: 30 min
  - Fix breaking changes: 15 min
  Total: 1 hour

TOTAL: 6 hours (conservative estimate)
```

### 7.2 Recommended Schedule

```typescript
Day 1 (Morning):
  - Phase 1: Duplicate Cleanup (1.5h)
  - Commit + verify
  - Break

Day 1 (Afternoon):
  - Phase 2: TypeScript Fixes (2h)
  - Commit + verify
  - End of day verification

Day 2 (Morning):
  - Phase 3: Test Fixes (1.5h)
  - Commit + verify
  - Run full test suite

Day 2 (Afternoon):
  - Phase 4: Dependency Upgrade (1h, optional)
  - Final integration testing
  - Documentation updates
```

---

## 8. Maintenance Prevention

### 8.1 Git Hooks (Husky)

```bash
# File: .husky/pre-commit (add duplicate detection)

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check for numbered duplicate files
DUPLICATES=$(git diff --cached --name-only | grep -E " [0-9]\.(tsx?|jsx?)$")

if [ -n "$DUPLICATES" ]; then
  echo "❌ ERROR: Attempting to commit numbered duplicate files:"
  echo "$DUPLICATES"
  echo ""
  echo "Please remove duplicates before committing."
  exit 1
fi

# Existing lint-staged
npx lint-staged
```

### 8.2 ESLint Rules

```json
// File: .eslintrc.json (add custom rules)

{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "@typescript-eslint/no-non-null-assertion": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 8.3 CI/CD Checks

```yaml
# File: .github/workflows/ci.yml (add to existing workflow)

name: CI
on: [push, pull_request]

jobs:
  check-duplicates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check for duplicate files
        run: |
          DUPLICATES=$(find src -name "* 2.*" -o -name "* 3.*" -o -name "* 4.*")
          if [ -n "$DUPLICATES" ]; then
            echo "❌ Found duplicate files:"
            echo "$DUPLICATES"
            exit 1
          fi

  typescript:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint

  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
```

### 8.4 Documentation

```markdown
# File: docs/CONTRIBUTING.md (add section)

## Preventing Duplicate Files

**Problem:** macOS Finder creates numbered duplicates (" 2.tsx") when copying files.

**Prevention:**
1. Use Git to duplicate files: `git mv old.tsx new.tsx`
2. Never use Finder's "Duplicate" command
3. Pre-commit hook will block commits with numbered files
4. Run `npm run check:duplicates` before pushing

**Detection:**
```bash
# Find all duplicates
find src -name "* [0-9].*"

# Remove all duplicates (DANGEROUS - review first!)
find src -name "* [0-9].*" -delete
```
```

---

## 9. Dependencies Reference

### 9.1 Current Versions

```json
{
  "react-native": "0.81.5",
  "react-native-reanimated": "~4.1.1",
  "reanimated-color-picker": "^4.1.1",
  "react-native-draggable-flatlist": "^4.0.3",
  "@shopify/react-native-skia": "^2.2.12",
  "convex": "1.21.1-alpha.1",
  "date-fns": "^4.1.0"
}
```

### 9.2 API Documentation Links

- [react-native-reanimated v4.1 Breaking Changes](https://docs.swmansion.com/react-native-reanimated/docs/migration/)
- [reanimated-color-picker v4.1 Exports](https://github.com/alabsi91/reanimated-color-picker#usage)
- [Convex Stable Releases](https://docs.convex.dev/changelog)

---

## 10. Monitoring & Alerts

### 10.1 Health Metrics Dashboard

```typescript
Weekly Health Check (Run in CI):
  - TypeScript error count: 0
  - Test pass rate: >95%
  - Duplicate file count: 0
  - npm audit vulnerabilities: 0 high/critical
  - Bundle size: <5MB (track growth)

Alert Thresholds:
  - TypeScript errors > 5 → Slack notification
  - Test pass rate < 90% → Block deployment
  - Duplicate files detected → Block merge
  - New dependency alerts → Review required
```

---

## Appendix A: Complete File Deletion List

```bash
# Generated with: find src worktrees -name "* [0-9].*" | sort

src/components/CalendarTimeline/CalendarTimelineDebug 2.tsx
src/components/CalendarTimeline/CalendarTimelineDebug 3.tsx
src/components/CalendarTimeline/CalendarTimelineWithPulse 2.tsx
src/components/CategoryChip/CategoryChip 2.tsx
src/components/CategoryChip/CategoryChip 3.tsx
src/components/CategoryChip/index 2.ts
src/components/CategoryChip/index 3.ts
src/components/CreateHabitModal/CreateHabitModalV2 2.tsx
src/components/PhaseTag/PhaseTag 2.tsx
src/components/PhaseTag/PhaseTag 3.tsx
src/components/PhaseTag/PhaseTag 4.tsx
src/constants/hubermanPhases 2.ts
src/constants/hubermanPhases 3.ts
src/constants/hubermanPhases 4.ts
src/constants/index 2.ts
src/constants/index 3.ts
src/constants/index 4.ts
src/constants/motion 2.ts
src/constants/motion 3.ts
src/constants/motion 4.ts
src/constants/strings 2.ts
src/constants/strings 3.ts
src/constants/strings 4.ts
src/screens/examples/CalendarTimelineComparison 2.tsx
src/screens/templates/TemplatePreviewModal 2.tsx
src/screens/templates/constants 2.ts
src/utils/emojiData 2.ts
worktrees/habit-template/src/components/CalendarTimeline/CalendarTimelineDebug 2.tsx
worktrees/habit-template/src/components/CalendarTimeline/CalendarTimelineDebug 3.tsx
worktrees/habit-template/src/components/CalendarTimeline/CalendarTimelineWithPulse 2.tsx
worktrees/habit-template/src/components/CreateHabitModal/CreateHabitModalV2 2.tsx
# ... (~70 more files)
```

---

## Appendix B: TypeScript Error Priority Matrix

```typescript
Priority 1 (Blocks Build):
  ✗ TS2451: Duplicate declarations (6 errors)
  ✗ TS2448/TS2454: Variable hoisting (2 errors)

Priority 2 (Runtime Risk):
  ✗ TS2345: Type mismatches (7 errors)
  ✗ TS2322: Assignment errors (4 errors)

Priority 3 (API Changes):
  ✗ TS2614: Missing exports (2 errors)
  ✗ TS2694: Namespace changes (1 error)
  ✗ TS2769: Overload mismatches (2 errors)

Total: 24 errors
```

---

**Document Version:** 1.0
**Last Updated:** December 22, 2024
**Author:** Technical Expert Advisor (TEA) Persona
**Status:** Ready for Implementation 📋
