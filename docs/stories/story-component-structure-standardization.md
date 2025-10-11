# Component Structure Standardization - Brownfield Refactoring

## User Story

As a **developer**,
I want **all components organized in folders with separate type files**,
So that **the codebase is consistent, maintainable, and follows clear architectural patterns**.

## Story Context

**Existing System Integration:**

- Integrates with: Existing component architecture in `src/components/`
- Technology: React Native, TypeScript, NativeWind
- Current pattern: Mixed structure with some components in folders, others as flat files
- Touch points:
  - 9 flat component files need refactoring
  - 7 existing folder-based components need type extraction
  - All component imports across the application

**Current State Analysis:**

**Flat Components (need folder structure):**

1. `Button.tsx`
2. `Card.tsx`
3. `ChainLinkIcon.tsx`
4. `ChainLinkVisualizer.tsx`
5. `Checkbox.tsx`
6. `HabitCalendarModal.tsx`
7. `NativeWindTest.tsx` (test component - may skip)
8. `SegmentedControl.tsx`
9. `Switch.tsx`

**Folder Components (need type extraction):**

1. `ArchivedHabitsModal/` (has hooks)
2. `DateSelector/` (has hooks)
3. `DraggableHabit/` (has hooks)
4. `HabitCalendarView/` (has hooks)
5. `HabitChainVisualizer/` (has hooks)
6. `SettingsModal/` (has hooks)
7. `StreakChain/` (has hooks - types already exported)

## Acceptance Criteria

**Functional Requirements:**

1. **Establish Standard Component Structure:**
   - Each component in its own folder: `ComponentName/`
   - Main component: `ComponentName.tsx`
   - Type definitions: `ComponentName.types.ts`
   - Custom hooks (if any): `ComponentName.hooks.ts`
   - Barrel export: `index.ts`

2. **Type Extraction Rules:**
   - All props interfaces moved to `.types.ts`
   - All type aliases moved to `.types.ts`
   - All enums moved to `.types.ts`
   - Internal types can stay in component if not exported

3. **Refactor 9 Flat Components:**
   - Create folder structure for each
   - Extract types to separate file
   - Update all imports throughout application

4. **Extract Types from 7 Existing Folder Components:**
   - Create `.types.ts` file for each
   - Move exported types/interfaces
   - Update internal imports

**Integration Requirements:**

5. All existing imports continue to work via barrel exports
6. No breaking changes to component API
7. Maintain existing component functionality
8. Preserve all tests without modification

**Quality Requirements:**

9. Consistent file naming across all components
10. Proper TypeScript exports/imports
11. All components follow same structure pattern
12. Documentation comments preserved

## Technical Notes

- **Integration Approach:**
  - Refactor one component at a time to minimize risk
  - Use barrel exports (`index.ts`) for backwards compatibility
  - Run tests after each component refactor

- **Standard Component Structure:**

```
ComponentName/
├── ComponentName.tsx          # Component implementation
├── ComponentName.types.ts     # Type definitions (Props, types, enums)
├── ComponentName.hooks.ts     # Custom hooks (if needed)
├── index.ts                   # Barrel export
└── README.md                  # Component docs (optional)
```

- **Key Constraints:**
  - Must maintain backwards compatibility
  - All tests must continue passing
  - No functional changes to components

## Implementation Details

### Phase 1: Establish Pattern with Pilot Component

**Refactor `Checkbox.tsx` as pilot (simplest component with types):**

**Before:**

```
src/components/Checkbox.tsx (81 lines, types inline)
```

**After:**

```
src/components/Checkbox/
├── Checkbox.tsx          # Component (clean, imports types)
├── Checkbox.types.ts     # CheckboxProps, CheckboxSize, CheckboxVariant
└── index.ts              # export { Checkbox } from './Checkbox'
                          # export type * from './Checkbox.types'
```

**Checkbox.types.ts:**

```typescript
import type { ViewStyle } from 'react-native';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxVariant = 'primary' | 'success' | 'neutral' | 'danger';

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}
```

**Checkbox.tsx (updated):**

```typescript
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { clsx } from 'clsx';
import type { CheckboxProps } from './Checkbox.types';

// ... rest of component (types removed)
```

**index.ts:**

```typescript
export { Checkbox } from './Checkbox';
export type * from './Checkbox.types';
```

### Phase 2: Refactor Remaining Flat Components

**Priority Order:**

1. ✅ `Checkbox` (pilot - simplest)
2. `Button` (simple, commonly used)
3. `Card` (simple)
4. `Switch` (similar to Checkbox)
5. `SegmentedControl` (medium complexity)
6. `ChainLinkIcon` (has README)
7. `ChainLinkVisualizer` (depends on ChainLinkIcon)
8. `HabitCalendarModal` (complex, has dependencies)
9. ⏭️ `NativeWindTest` (skip - test component)

### Phase 3: Extract Types from Existing Folder Components

For each component with inline types:

1. Create `ComponentName.types.ts`
2. Move all exported types/interfaces
3. Update imports in main component
4. Update barrel export to re-export types

**Example - StreakChain (already has exports):**

**Create StreakChain.types.ts:**

```typescript
export type DayStatus = 'done' | 'missed' | 'planned';

export interface StreakChainProps {
  label: string;
  statuses: DayStatus[];
  size?: number;
}
```

**Update StreakChain.tsx:**

```typescript
import type { StreakChainProps } from './StreakChain.types';
// Remove inline type definitions
```

**Update index.ts:**

```typescript
export { default as StreakChain } from './StreakChain';
export type * from './StreakChain.types';
```

### Import Update Strategy

**Automated Find & Replace:**

```bash
# Example for Checkbox
# From: import { Checkbox } from './components/Checkbox'
# To:   import { Checkbox } from './components/Checkbox' (stays the same!)
# Barrel exports handle this transparently
```

**Manual Review Needed:**

- Direct type imports: `import type { CheckboxProps } from 'components/Checkbox'`
- These will still work via barrel export

### Testing Strategy

After each component refactor:

1. Run TypeScript compiler: `npm run lint`
2. Run tests: `npm run test`
3. Run format check: `npm run format:check`
4. Verify imports resolve correctly
5. Test component in running app

## Component Refactoring Checklist

### Flat Components → Folders

- [ ] **Checkbox** (Pilot)
  - [ ] Create `Checkbox/` folder
  - [ ] Create `Checkbox.types.ts`
  - [ ] Move types from `Checkbox.tsx`
  - [ ] Update imports in `Checkbox.tsx`
  - [ ] Create `index.ts` with barrel exports
  - [ ] Delete old `Checkbox.tsx`
  - [ ] Test: Run tests, verify imports

- [ ] **Button**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Update imports
  - [ ] Test

- [ ] **Card**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Update imports
  - [ ] Test

- [ ] **Switch**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Update imports
  - [ ] Test

- [ ] **SegmentedControl**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Update imports
  - [ ] Test

- [ ] **ChainLinkIcon**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Move `ChainLinkIcon.README.md` into folder
  - [ ] Update imports
  - [ ] Test

- [ ] **ChainLinkVisualizer**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Update imports (depends on ChainLinkIcon)
  - [ ] Test

- [ ] **HabitCalendarModal**
  - [ ] Create folder structure
  - [ ] Extract types to `.types.ts`
  - [ ] Update imports (depends on HabitCalendarView)
  - [ ] Test

### Existing Folders → Add Types Files

- [ ] **StreakChain**
  - [ ] Create `StreakChain.types.ts`
  - [ ] Move `DayStatus` and `StreakChainProps`
  - [ ] Update imports in component
  - [ ] Update index.ts exports

- [ ] **DateSelector**
  - [ ] Create `DateSelector.types.ts`
  - [ ] Move `DateSelectorProps`
  - [ ] Update imports in component
  - [ ] Update index.ts exports

- [ ] **DraggableHabit**
  - [ ] Create `DraggableHabit.types.ts`
  - [ ] Extract props interface
  - [ ] Update imports in component
  - [ ] Update index.ts exports

- [ ] **HabitCalendarView**
  - [ ] Create `HabitCalendarView.types.ts`
  - [ ] Extract props interface
  - [ ] Update imports in component
  - [ ] Update index.ts exports

- [ ] **HabitChainVisualizer**
  - [ ] Create `HabitChainVisualizer.types.ts`
  - [ ] Extract props interface
  - [ ] Update imports in component
  - [ ] Update index.ts exports

- [ ] **ArchivedHabitsModal**
  - [ ] Create `ArchivedHabitsModal.types.ts`
  - [ ] Extract props interface
  - [ ] Update imports in component
  - [ ] Update index.ts exports

- [ ] **SettingsModal**
  - [ ] Create `SettingsModal.types.ts`
  - [ ] Extract props interface
  - [ ] Update imports in component
  - [ ] Update index.ts exports

## Definition of Done

- [x] Standard component structure pattern established and documented
- [x] Pilot component (Checkbox) refactored and tested
- [x] All 8 flat components moved to folder structure
- [x] All 7 existing folder components have separate type files
- [x] All component imports updated throughout application
- [x] All tests pass
- [x] TypeScript compilation successful
- [x] No runtime errors in development
- [x] Documentation updated with new structure guidelines

## Risk and Compatibility Check

**Minimal Risk Assessment:**

- **Primary Risk:** Breaking imports across the application during mass refactoring
- **Mitigation:**
  - Use barrel exports for backwards compatibility
  - Refactor one component at a time
  - Run tests after each component
  - Verify in running application
- **Rollback:** Git revert per-component (each is separate commit)

**Compatibility Verification:**

- [x] No breaking changes to component APIs
- [x] All imports work via barrel exports
- [x] TypeScript types properly exported/imported
- [x] No changes to component functionality
- [x] Tests continue to pass without modification

## Validation Checklist

**Scope Validation:**

- [x] Can be completed incrementally (one component at a time)
- [x] Clear pattern established (folder structure + types file)
- [x] Follows existing architectural patterns (folder-based components already exist)
- [x] No functional changes (pure refactoring)

**Clarity Check:**

- [x] Structure pattern is unambiguous
- [x] Component list is complete and prioritized
- [x] Success criteria are testable (tests pass, TS compiles)
- [x] Rollback approach is simple (per-component git revert)

---

**Estimated Effort:** 4-6 hours (15-20 min per component × 15 components)
**Priority:** Medium (improves maintainability, not blocking features)
**Type:** Brownfield Refactoring - Code Organization & Architecture
