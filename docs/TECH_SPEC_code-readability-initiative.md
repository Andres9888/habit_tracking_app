# Technical Specification: Code Readability Initiative

Date: 2026-01-08
Author: Product Manager (BMAD)
Epic ID: READABILITY-001
Status: Draft

---

## Overview

This technical specification defines the standards, patterns, and implementation approach for achieving a **100-line maximum file size** across the habit tracking app codebase. The goal is PR-readable code—every file should be understandable in a single code review without scrolling through pages of implementation details.

### Current State Metrics

| Category               | File Count | Action Required     |
| ---------------------- | ---------- | ------------------- |
| Compliant (≤100 lines) | 189        | None                |
| 101-300 lines          | 168        | Light refactor      |
| 301-500 lines          | 67         | Medium refactor     |
| 501-1000 lines         | 33         | Heavy refactor      |
| 1000+ lines            | 7          | Major decomposition |

**Total non-test files:** 464
**Files requiring work:** 275 (59%)

---

## Objectives and Scope

### Primary Objectives

1. **100-line maximum** for all production source files (excluding tests)
2. **Single responsibility** - each file does one thing well
3. **Self-documenting** - file names and structure reveal intent
4. **PR-readable** - any file can be reviewed without context switching

### In Scope

- All `.ts` and `.tsx` files in `/src`
- Component files, hooks, utilities, screens
- Type definitions and constants

### Out of Scope

- Test files (`*.test.ts`, `__tests__/*`) - may remain larger for comprehensive coverage
- Generated files and configurations
- Third-party code in `node_modules`

---

## System Architecture Alignment

### Decomposition Patterns

The 100-line constraint will be achieved through consistent application of these patterns:

#### 1. Component Decomposition Pattern

```
ComponentName/
├── index.ts              # Re-exports (≤10 lines)
├── ComponentName.tsx     # Main orchestration (≤100 lines)
├── ComponentNameView.tsx # Pure presentation (≤100 lines)
├── useComponentName.ts   # Business logic hook (≤100 lines)
├── types.ts              # Type definitions (≤100 lines)
├── styles.ts             # Styled components (≤100 lines)
└── constants.ts          # Magic values (≤100 lines)
```

#### 2. Hook Decomposition Pattern

```
useFeature/
├── index.ts              # Re-exports
├── useFeature.ts         # Main hook (≤100 lines)
├── useFeatureState.ts    # State management
├── useFeatureEffects.ts  # Side effects
├── useFeatureHandlers.ts # Event handlers
└── types.ts              # Types
```

#### 3. Utility Decomposition Pattern

```
utilityName/
├── index.ts              # Re-exports
├── core.ts               # Core logic
├── helpers.ts            # Helper functions
├── validators.ts         # Validation logic
└── types.ts              # Types
```

---

## Detailed Design

### Services and Modules

#### Priority 1: Critical Path Files (1000+ lines)

| File                          | Lines | Decomposition Strategy                                                                 |
| ----------------------------- | ----- | -------------------------------------------------------------------------------------- |
| `TemplateScienceModal.tsx`    | 1,375 | Split into 14+ files: ScienceSection, CategoryCard, TemplateDetails, animations, hooks |
| `LettersSection.tsx`          | 1,320 | Split into LetterComposer, LetterPreview, LetterList, useLetterDraft                   |
| `AffirmationsSection.tsx`     | 1,133 | Split into AffirmationCard, AffirmationEditor, AffirmationList, useAffirmations        |
| `HabitsEmptyState.tsx`        | 1,094 | Split into OnboardingSteps, TemplateSelector, EmptyStateView, animations               |
| `FullsizeTemplatePreview.tsx` | 1,047 | Split into PreviewHeader, PreviewContent, PreviewActions, usePreviewState              |
| `TemplatesScreen.tsx`         | 1,039 | Split into TemplateGrid, TemplateFilters, TemplateSearch, useTemplates                 |
| `TodaysFocusCard.tsx`         | 991   | Split into FocusHeader, FocusProgress, FocusActions, useFocusState                     |

#### Priority 2: Large Files (501-1000 lines) - 33 files

Key examples:

- `VoiceNotesSection.tsx` (980) → VoiceRecorder, VoicePlayer, VoiceList
- `notifications.ts` (978) → notificationScheduler, notificationHandlers, notificationTypes
- `DraggableHabit.tsx` (970) → DraggableView, DragHandlers, DragAnimations
- `VisionBoardSection.tsx` (937) → VisionCanvas, VisionTools, VisionGallery
- `CelebrationScreen.tsx` (916) → CelebrationAnimation, CelebrationMessage, useCelebration
- `HabitCard.tsx` (894) → HabitCardView, HabitCardActions, useHabitCard
- `HabitsList.tsx` (869) → HabitsListView, HabitsListItem, useHabitsList

#### Priority 3: Medium Files (301-500 lines) - 67 files

Apply standard decomposition patterns. Split when natural boundaries exist.

#### Priority 4: Small Overages (101-300 lines) - 168 files

Quick wins—often just extracting types, constants, or a single helper function.

### Data Models and Contracts

No data model changes required. This is a code organization initiative.

### APIs and Interfaces

**New Barrel Export Convention:**

```typescript
// ComponentName/index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
```

All existing public APIs remain unchanged. Internal reorganization only.

### Workflows and Sequencing

#### Phase 1: Foundation (Establish Patterns)

1. Create decomposition templates and examples
2. Set up ESLint rule for max-lines-per-function and max-lines
3. Document patterns in CLAUDE.md for AI assistants
4. Decompose 3 exemplar files as references

#### Phase 2: Critical Path (1000+ line files)

1. Decompose 7 critical files (1000+ lines each)
2. Each file becomes a folder with 10-15 focused files
3. Verify no regressions via existing tests

#### Phase 3: Large Files (501-1000 lines)

1. Decompose 33 large files
2. Apply hook decomposition pattern to complex hooks
3. Apply component decomposition pattern to complex components

#### Phase 4: Medium Files (301-500 lines)

1. Decompose 67 medium files
2. Focus on extracting types, constants, and helpers

#### Phase 5: Final Cleanup (101-300 lines)

1. Address 168 small overages
2. Many will comply after type/constant extraction
3. Final lint enforcement

---

## Non-Functional Requirements

### Performance

- **No runtime impact** - this is compile-time organization only
- **Bundle size** - may slightly improve due to better tree-shaking
- **Code splitting** - smaller files enable better lazy loading opportunities

### Security

No security implications. Code organization only.

### Reliability/Availability

- **Risk mitigation** - each phase includes full test suite runs
- **Rollback** - git history preserves ability to revert any decomposition

### Observability

- **Metrics** - track file count distribution weekly during initiative
- **CI gate** - add max-lines check to prevent regression

---

## Dependencies and Integrations

### Tooling Required

1. **ESLint Rule** - `max-lines: ["error", { max: 100, skipBlankLines: true, skipComments: true }]`
2. **Pre-commit Hook** - Warn on files exceeding limit
3. **CI Check** - Fail PR if new file exceeds 100 lines

### External Dependencies

None. All work is internal code organization.

---

## Acceptance Criteria (Authoritative)

### Definition of Done

- [ ] All 275 non-compliant files decomposed to ≤100 lines
- [ ] ESLint max-lines rule enforced in CI
- [ ] All existing tests pass
- [ ] No new lint warnings introduced
- [ ] Barrel exports maintain public API compatibility
- [ ] Documentation updated with decomposition patterns

### Per-File Acceptance

- [ ] File is ≤100 lines (excluding blank lines and comments)
- [ ] File has single responsibility
- [ ] File name reflects its purpose
- [ ] Imports are organized (types, external, internal)
- [ ] Exports are explicit (no `export *`)

---

## Traceability Mapping

| Requirement                | Source           | Validation        |
| -------------------------- | ---------------- | ----------------- |
| 100-line limit             | User requirement | ESLint rule       |
| PR-readable code           | User requirement | Code review       |
| No runtime impact          | Implicit         | Test suite        |
| Maintain API compatibility | Implicit         | Integration tests |

---

## Risks, Assumptions, Open Questions

### Risks

| Risk                                         | Likelihood | Impact | Mitigation                                   |
| -------------------------------------------- | ---------- | ------ | -------------------------------------------- |
| Breaking changes during decomposition        | Medium     | High   | Comprehensive test coverage, incremental PRs |
| Import path changes break external consumers | Low        | Medium | Barrel exports maintain public API           |
| Increased file count complicates navigation  | Medium     | Low    | Consistent folder structure, good naming     |

### Assumptions

1. Test coverage is sufficient to catch regressions
2. Team will adopt and enforce new patterns going forward
3. 100 lines is achievable for all production code (tests excluded)

### Open Questions

1. **Test files** - Should tests also follow the 100-line rule? (Current recommendation: No, tests benefit from co-location)
2. **Generated files** - How to handle auto-generated code that exceeds limits?
3. **Type-heavy files** - Should large type definition files be exempt?

---

## Implementation Checklist

### Phase 1: Foundation (Establish Patterns)

- [x] Create decomposition templates and examples (`docs/DECOMPOSITION_PATTERNS.md`)
- [x] Set up ESLint rule for max-lines-per-function and max-lines (already exists, enhanced with comments)
- [x] Document patterns in CLAUDE.md for AI assistants
- [ ] Decompose 3 exemplar files as references

### Phase 2: Critical Path (1000+ line files)

- [x] Decompose `TemplateScienceModal.tsx` (1,375 lines)
- [x] Decompose `LettersSection.tsx` (1,320 lines)
- [x] Decompose `AffirmationsSection.tsx` (1,133 lines)
- [x] Decompose `HabitsEmptyState.tsx` (1,094 lines)
- [x] Decompose `FullsizeTemplatePreview.tsx` (1,047 lines)
- [x] Decompose `TemplatesScreen.tsx` (1,039 lines)
- [ ] Decompose `TodaysFocusCard.tsx` (991 lines)

### Phase 3: Large Files (501-1000 lines)

- [ ] Decompose remaining 28 large files (see Appendix for full list)
- [x] `VoiceNotesSection.tsx` (980 → 22 files, all ≤100 lines)
- [x] `notifications.ts` (978 → 11 files, all ≤100 lines)
- [x] `DraggableHabit.tsx` (970 → 14 files, all ≤100 lines)
- [x] `VisionBoardSection.tsx` (937 → 19 files, all ≤100 lines)
- [x] `CelebrationScreen.tsx` (916 → 20 files, all ≤100 lines)
- [x] `HabitCard.tsx` (894 → 34 files, all ≤100 lines)
- [x] `HabitsList.tsx` (869 → 16 files, all ≤100 lines)

### Phase 4: Medium Files (301-500 lines)

- [ ] Decompose 67 medium files
  - [x] `convex/affirmations.ts` (541 lines → 12 files, all ≤100 lines)
  - [x] `convex/voiceNotes.ts` (302 lines → 8 files, all ≤100 lines)
  - [x] `convex/letters.ts` (301 lines → 8 files, all ≤100 lines)

### Phase 5: Final Cleanup (101-300 lines)

- [ ] Address 168 small overages
- [ ] Convert ESLint `max-lines` from "warn" to "error"
- [ ] Final lint enforcement

---

## Test Strategy Summary

### Validation Approach

1. **Unit Tests** - All existing unit tests must pass after decomposition
2. **Integration Tests** - Verify component behavior unchanged
3. **Snapshot Tests** - May need updates if component structure changes
4. **Visual Regression** - If available, run before/after comparison

### CI Integration

```yaml
# Example CI check
lint:
  script:
    - npm run lint
    - npm run lint:max-lines # New check for 100-line limit
```

---

## Appendix: File Inventory

### 1000+ Line Files (7)

1. `src/components/TemplateScienceModal.tsx` - 1,375 lines
2. `src/components/MotivationSystem/Workshop/LettersSection.tsx` - 1,320 lines
3. `src/components/MotivationSystem/Workshop/AffirmationsSection.tsx` - 1,133 lines
4. `src/features/habits/components/HabitsEmptyState.tsx` - 1,094 lines
5. `src/components/FullsizeTemplatePreview.tsx` - 1,047 lines
6. `src/screens/TemplatesScreen.tsx` - 1,039 lines
7. `src/components/ProgressSectionConsolidated/TodaysFocusCard.tsx` - 991 lines

### 501-1000 Line Files (33)

1. `VoiceNotesSection.tsx` - 980
2. `notifications.ts` - 978
3. `DraggableHabit.tsx` - 970
4. `VisionBoardSection.tsx` - 937
5. `CelebrationScreen.tsx` - 916
6. `HabitCard.tsx` - 894
7. `HabitsList.tsx` - 869
8. `useAudioRecording.ts` - 847
9. `RescueMode.tsx` - 740
10. `ShareCardGenerator.tsx` - 732
11. `useAudioPlayback.ts` - 727
12. `TemplateCard.tsx` - 706
13. `AnalyticsScreen.tsx` - 668
14. `InsightsSection.tsx` - 655
15. `DualVizSetup.tsx` - 649
16. `HabitDetailScreen.tsx` - 638
17. `useOfflineQueue.ts` - 626
18. `SuccessState.tsx` - 621
19. `HabitChainVisualizer.tsx` - 617
20. `ActivationModal.tsx` - 608
21. `useHabitCardEntrance.ts` - 587
22. `VisualizationExercise.tsx` - 568
23. `AffirmationScheduleModal.tsx` - 568
24. `StrengthTimelineChart.tsx` - 560
25. `EmojiPicker.tsx` - 548
26. `VoiceNotePlaybackUI.tsx` - 540
27. `templatesScreenStyles.ts` - 533
28. `Modal.tsx` - 510
29. `WeeklyInsightsCard.tsx` - 505
30. `PremiumFeatureLock.tsx` - 505
31. `EmojiPickerSheet.tsx` - 504
32. `WOOPSection.tsx` - 501
33. (Additional files 501-509 lines)

---

_Generated by BMAD Product Manager Agent_
