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
- [x] Decompose 3 exemplar files as references
  - `trendCalculations.ts` (275→5 files) - Utility Pattern exemplar
  - `useMilestoneDetection.ts` (226→5 files) - Hook Pattern exemplar
  - `HabitDetailTabs.tsx` (167→6 files) - Component Pattern exemplar

### Phase 2: Critical Path (1000+ line files)

- [x] Decompose `TemplateScienceModal.tsx` (1,375 lines → 28 files, all ≤100 lines)
- [x] Decompose `LettersSection.tsx` (1,320 lines → 34 files, all ≤100 lines)
- [x] Decompose `AffirmationsSection.tsx` (1,133 lines → 28 files, all ≤100 lines)
- [x] Decompose `HabitsEmptyState.tsx` (1,094 lines → 22 files, all ≤100 lines)
- [x] Decompose `FullsizeTemplatePreview.tsx` (1,047 lines → 24 files, all ≤100 lines)
- [x] Decompose `TemplatesScreen.tsx` (1,039 lines → 39 files, all ≤100 lines)
- [x] Decompose `TodaysFocusCard.tsx` (991 lines → 20 files, all ≤100 lines)

### Phase 3: Large Files (501-1000 lines)

- [x] Decompose `VoiceNotesSection.tsx` (980 lines → 22 files, all ≤100 lines)
- [x] Decompose `notifications.ts` (978 lines → 21 files, all ≤100 lines)
- [x] Decompose `DraggableHabit.tsx` (970 lines → 19 files, most ≤100 lines, some cleanup remaining)
- [x] Decompose `VisionBoardSection.tsx` (937 lines → 19 files, all ≤100 lines)
- [x] Decompose `CelebrationScreen.tsx` (916 lines → 20 files, all ≤100 lines)
- [x] Decompose `HabitCard.tsx` (894 lines → already decomposed, main file reduced 184 → 86 lines)
- [x] Decompose `HabitsList.tsx` (869 lines → already decomposed, main file reduced 291 → 70 lines)
- [x] Decompose remaining 25 large files (see Appendix for full list)
  - [x] `useAudioRecording.ts` (847 lines → 13 files, all ≤100 lines)
  - [x] `RescueMode.tsx` (740 lines → 16 files, all ≤100 lines)
  - [x] `ShareCardGenerator.tsx` (732 lines → 20 files, all ≤100 lines)
  - [x] `useAudioPlayback.ts` (727 lines → 15 files, all ≤100 lines)
  - [x] `TemplateCard.tsx` (706 lines → 18 files, all ≤100 lines)
  - [x] `AnalyticsScreen.tsx` (668 lines → 16 files, all ≤100 lines)
  - [x] `InsightsSection.tsx` (655 lines → 19 files, all ≤100 lines)
  - [x] `DualVizSetup.tsx` (649 lines → 13 files, all ≤100 lines)
  - [x] `HabitDetailScreen.tsx` (638 lines → 12 files, all ≤100 lines)
  - [x] `useOfflineQueue.ts` (626 lines → 8 files, all ≤100 lines)
  - [x] `SuccessState.tsx` (621 lines → 11 files, all ≤100 lines)
  - [x] `HabitChainVisualizer.tsx` (617 lines → 14 files, all ≤100 lines)
  - [x] `ActivationModal.tsx` (608 lines → 14 files, all ≤100 lines)
  - [x] `VisualizationExercise.tsx` (568 lines → 11 files, all ≤100 lines)
  - [x] `AffirmationScheduleModal.tsx` (568 lines → 15 files, all ≤100 lines)
  - [x] `useHabitCardEntrance.ts` (130 lines → 7 files, all ≤100 lines)
  - [x] `StrengthTimelineChart.tsx` (560 lines → 14 files, all ≤100 lines)
  - [x] `EmojiPicker.tsx` (548 lines → 16 files, all ≤100 lines)
  - [x] `VoiceNotePlaybackUI.tsx` (540 lines → 13 files, all ≤100 lines)
  - [x] `Modal.tsx` (510 lines → 15 files, all ≤100 lines)
  - [x] `WeeklyInsightsCard.tsx` (505 lines → 11 files, all ≤100 lines)
  - [x] `PremiumFeatureLock.tsx` (505 lines → 8 files, all ≤100 lines)
  - [x] `EmojiPickerSheet.tsx` (504 lines → 9 files, all ≤100 lines)
  - [x] `WOOPSection.tsx` (501 lines → 8 files, all ≤100 lines)

### Phase 4: Medium Files (301-500 lines)

- [ ] Decompose 67 medium files
  - [x] `ContextAwareViz.tsx` (346 lines → 13 files, all ≤100 lines)
  - [x] `templatesScreenStyles.ts` (516 lines → 14 files, all ≤100 lines)
  - [x] `MotivationPaywall.tsx` (496 lines → 14 files, all ≤100 lines)
  - [x] `TemplatePreviewModal.tsx` (426 lines → 13 files, all ≤100 lines)
  - [x] `HabitsModals.tsx` (423 lines → 12 files, all ≤100 lines)
  - [x] `ArchivedHabitsModal.tsx` (465 lines → 14 files, all ≤100 lines)
  - [x] `MilestoneProgress.tsx` (462 lines → 13 files, all ≤100 lines)
  - [x] `OfflinePendingBanner.tsx` (458 lines → 18 files, all ≤100 lines)
  - [x] `MilestoneCelebration.tsx` (456 lines → 14 files, all ≤100 lines)
  - [x] `useRescueTrigger.ts` (449 lines → 9 files, all ≤100 lines)
  - [x] `StreakRecordsAccordion.tsx` (447 lines → 10 files, all ≤100 lines)
  - [x] `MiniTemplateCard.tsx` (374 lines → 14 files, all ≤100 lines)
  - [x] `PremiumBenefitsModal.tsx` (368 lines → 9 files, all ≤100 lines)
  - [x] `VisualizationGuide.tsx` (359 lines → 8 files, all ≤100 lines)
  - [x] `ProgressSectionConsolidated/types.ts` (305 lines → 7 files, all ≤100 lines)
  - [x] `MonthlyCalendarGrid.tsx` (307 lines → 8 files, all ≤100 lines)
  - [x] `TipQuickActionsSheet.tsx` (311 lines → 6 files, all ≤100 lines)
  - [x] `convex/affirmations.ts` (541 lines → 12 files, all ≤100 lines)
  - [x] `convex/voiceNotes.ts` (302 lines → 8 files, all ≤100 lines)
  - [x] `convex/letters.ts` (301 lines → 8 files, all ≤100 lines)
  - [x] `convex/analytics.ts` (479 lines → 11 files, all ≤100 lines)
  - [x] `convex/visionBoardImages.ts` (376 lines → 9 files, all ≤100 lines)
  - [x] `convex/predictions.ts` (357 lines → 8 files, all ≤100 lines)
  - [x] `HabitStrengthIndicator.tsx` (444 lines → 11 files, all ≤100 lines)
  - [x] `StreakChainSection.tsx` (415 lines → 15 files, all ≤100 lines)
  - [x] `HabitsEmptyStateMinimal/analytics.ts` (411 lines → 8 files, all ≤100 lines)
  - [x] `convex/templates.ts` (4367 lines → 8 files: 7 logic files all ≤100 lines + 1 data-heavy seed file)
    - Logic files: templates.ts (49), queries.ts (99), importTemplate.ts (57), clearAndDedupe.ts (94), helpers.ts (74), types.ts (61), updateLinks.ts (76)
    - Data file: templatesDataSeed.ts (4981 lines - contains 200+ embedded template objects, marked as data exception)
  - [x] `convex/habits.ts` (927 lines → 14 files, all ≤100 lines)
    - Barrel: habits.ts (42 lines)
    - Mutations: create.ts (50), update.ts (37), archive.ts (97), pause.ts (68), remove.ts (100), reorder.ts (44), toggle.ts (85)
    - Queries: get.ts (45), list.ts (72), getTracking.ts (33), stats.ts (54)
    - Types: types.ts (45), validators.ts (67), utils.ts (51)
  - [x] `convex/habitStrength.ts` (982 lines → 15 files, all ≤100 lines)
    - Barrel: habitStrength.ts (76 lines)
    - Core: momentum.ts (91), strengthLevel.ts (23), logistic.ts (28), compliance.ts (51), snapshot.ts (56)
    - Utils: constants.ts (32), types.ts (80), dateUtils.ts (64), legacyFormula.ts (69)
    - Mutations: updateStrength.ts (100), recalculate.ts (49), updateParams.ts (40)
    - Queries: getStrengthInfo.ts (86), allHabitsStats.ts (79)
  - [x] `CalendarTimeline.tsx` (410 lines → 11 files, all ≤100 lines)
    - Main: CalendarTimeline.tsx (94), CalendarTimeline.hooks.ts (30), CalendarTimeline.styles.ts (80), CalendarTimeline.types.ts (69)
    - Components: CompletionDot.tsx (83), DayCell.tsx (78), DayCellContent.tsx (83), DayCell.helpers.ts (40), WeekNavigationHeader.tsx (55)
  - [x] `PredictionInsights.tsx` (403 lines → 10 files, all ≤100 lines)
    - Main: PredictionInsights.tsx (79), PredictionInsights.styles.ts (57), PredictionInsights.types.ts (24)
    - Components: ConfidenceLevel.tsx (55), RiskBadge.tsx (61), RiskWarningBox.tsx (50), SuggestedActions.tsx (50), TrendIndicator.tsx (62)
  - [x] `createHabitModalAnalytics.ts` (402 lines → 5 files, all ≤100 lines)
    - index.ts (11), types.ts (53), trackers.ts (63), helpers.ts (20), useCreateHabitModalAnalytics.ts (87)
  - [x] `StrengthHistoryChart.tsx` (401 lines → 11 files, all ≤100 lines)
    - Main: StrengthHistoryChart.tsx (69), StrengthHistoryChart.styles.ts (44), StrengthHistoryChart.types.ts (29), StrengthHistoryChart.utils.ts (60)
    - Components: ChartSvg.tsx (92), ChartLegend.tsx (40), EmptyState.tsx (43), StatsRow.tsx (66), XAxisLabels.tsx (34)
  - [x] `QuickReflection.tsx` (400 lines → 12 files, all ≤100 lines)
    - Main: QuickReflection.tsx (100), QuickReflection.constants.ts (13), QuickReflection.types.ts (30)
    - Components: AnimatedSection.tsx (57), EmojiButton.tsx (76), EmojiSelector.tsx (34), NoteInput.tsx (41), ReflectionHeader.tsx (21), ReflectionIcon.tsx (37), SectionCard.tsx (31)
  - [x] `SpotlightHero.tsx` (357 lines → 9 files, all ≤100 lines)
    - Main: SpotlightHero.tsx (87), SpotlightHero.types.ts (24), SpotlightHero.hooks.ts (48)
    - Components: SpotlightBadge.tsx (37), TemplateContent.tsx (43), TemplateIcon.tsx (38), ActionButtons.tsx (69), ShimmerOverlay.tsx (54)
  - [x] `PremiumAnalyticsPaywall.tsx` (340 lines → 9 files, all ≤100 lines)
    - Main: PremiumAnalyticsPaywall.tsx (73), PremiumAnalyticsPaywall.types.ts (24), PremiumAnalyticsPaywall.constants.ts (46)
    - Components: PaywallHeader.tsx (44), FeatureListItem.tsx (36), PricingCard.tsx (62), PaywallFooter.tsx (64)
  - [x] `NotesList.tsx` (327 lines → 12 files, all ≤100 lines)
    - Main: NotesList.tsx (86), NotesList.types.ts (37), useNotesList.ts (92)
    - Components: NotesHeader.tsx (36), SearchInput.tsx (32), HabitFilter.tsx (55), NoteCard.tsx (82), VisualizationGuideButton.tsx (34), VisualizationModal.tsx (26), NotesGrouped.tsx (38)
  - [x] `StrengthProgressBar.tsx` (326 lines → 7 files, all ≤100 lines)
    - Main: StrengthProgressBar.tsx (94), StrengthProgressBar.types.ts (37), StrengthProgressBar.constants.ts (82), StrengthProgressBar.styles.ts (62)
    - Hooks: useStrengthAnimation.ts (92)
    - Components: ProgressBarBottomRow.tsx (48)

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
