# Hooks Audit & Improvement Report

## Summary
- **Total Custom Hooks Analyzed**: 550+
- **Total Lines of Hook Code**: ~30,500
- **Focus Areas**: Memory leaks, missing dependencies, duplicate logic, consolidation opportunities

## Key Findings

### 1. Duplicate Audio Hook Architecture
**Issue**: `useAudioPlayback` and `useAudioRecording` have parallel structures with similar patterns
- Both use composition pattern with sub-hooks
- Similar state management approach
- Similar error handling patterns
- Opportunity: Extract shared audio hook logic

**Files Affected**:
- `src/hooks/useAudioPlayback/` (19 files)
- `src/hooks/useAudioRecording/` (19 files)

**Impact**: Medium - Improves maintainability

---

### 2. Multiple Rescue/Motivation Hooks
**Issue**: Various rescue/motivation triggers scattered across hooks
- `useRescueTrigger/` (5 sub-hooks)
- `useStreakReminders/` (multiple variants)
- Separate motivation system hooks in components

**Opportunity**: Consolidate into unified trigger system

**Files Affected**:
- `src/hooks/useRescueTrigger/` (4 files)
- `src/hooks/useStreakReminders/` (4 files)
- Various component-level hooks

**Impact**: High - Large consolidation opportunity

---

### 3. Performance Hooks Organization
**Issue**: Performance monitoring split across multiple locations
- `src/hooks/performance/` (5 files for monitoring)
- `usePerformanceMonitor` in contexts

**Opportunity**: Consolidate performance monitoring hooks

**Impact**: Low-Medium - Better organization

---

### 4. Large Hooks (>200 lines)
**Critical**: Some hooks are too large and handle multiple responsibilities

**Top Offenders**:
1. `useOfflineHabitMutations.ts` - 300 lines
   - Handles: create, update, archive, pause, remove operations
   - Opportunity: Split by operation type or use factory pattern

2. `useMilestoneCheck.ts` - 212 lines
   - Handles: multiple milestone detection and celebrations
   - Opportunity: Extract celebration logic

3. `useImageUpload.ts` - 191 lines
   - Handles: upload, validation, cropping
   - Opportunity: Separate concerns

---

### 5. Unused Hook Dependencies
**Issue**: Some useCallback/useMemo have empty dependency arrays where they shouldn't

**Examples**:
- `useOfflineQueue/useQueueQueries.ts`: Multiple functions with `[]` deps
- `useRetryableAction.ts`: clearError with `[]` but doesn't reference hooks

---

### 6. Missing Dependency Array Safety
**Issue**: Several hooks have potential missing dependencies in useEffect

**Pattern Found**: Ref-based dependencies not always properly included

---

## Recommendations

### Priority 1 (High Impact)
1. **Split useOfflineHabitMutations** - Too large (300 lines)
   - Extract into operation-specific hooks
   - Reduce cognitive load

2. **Consolidate Audio Hooks** - Duplicate architectures
   - Create shared audio composition utilities
   - Extract common error handling

3. **Unify Rescue/Motivation System** - Scattered triggers
   - Create central trigger manager
   - Reduce hook proliferation

### Priority 2 (Medium Impact)
4. **Organize Performance Hooks** - Better structure needed
5. **Extract Validation from useFieldValidation** (184 lines)
6. **Review & Fix Empty Dependency Arrays**

### Priority 3 (Low Impact)
7. **Documentation** - Add JSDoc to complex hooks
8. **Testing** - Increase test coverage for custom hooks
9. **Monitoring** - Add performance metrics to large hooks

---

## Detailed Action Items

### Action 1: Split useOfflineHabitMutations
**File**: `src/hooks/useOfflineHabitMutations.ts` (300 lines)

**Current Structure**:
```typescript
export function useOfflineHabitMutations() {
  // contains: createHabit, updateHabit, archiveHabit, pauseHabit, removeHabit
}
```

**Proposed Structure**:
```typescript
// src/hooks/useOfflineMutations/useOfflineHabitCreate.ts
// src/hooks/useOfflineMutations/useOfflineHabitUpdate.ts
// src/hooks/useOfflineMutations/useOfflineHabitArchive.ts
// src/hooks/useOfflineHabitMutations.ts (composer hook)
```

---

### Action 2: Extract Audio Composition Layer
**Files**: `src/hooks/useAudioPlayback/` and `src/hooks/useAudioRecording/`

**Proposed**:
Create `src/hooks/shared/useAudioHookComposition.ts` with:
- Common composition patterns
- Shared error handling
- Shared state management patterns

---

### Action 3: Consolidate Rescue Triggers
**Files**: 
- `src/hooks/useRescueTrigger/`
- `src/hooks/useStreakReminders/`
- Component-level rescue hooks

**Proposed**:
Create unified trigger system with cleaner API

