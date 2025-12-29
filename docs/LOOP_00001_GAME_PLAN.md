# Refactoring Game Plan

## Codebase Profile

- **Total Files:** ~565+ source files (TypeScript/React Native)
- **Total Lines of Code:** ~154,500 LOC (140,287 frontend + 14,280 backend)
- **Test Files:** 173 test files (~25,000 LOC)
- **Components:** 57 component directories (~80,000 LOC)

### Largest Files (Primary Refactoring Targets)

| File                                                               | LOC   | Category     | Priority     |
| ------------------------------------------------------------------ | ----- | ------------ | ------------ |
| `src/screens/HabitDetailScreen.tsx`                                | 3,503 | Screen       | **CRITICAL** |
| `convex/templates.ts`                                              | 4,981 | Backend/Data | High         |
| `src/components/CalendarHeatmap/__tests__/utils.test.ts`           | 1,863 | Test         | Medium       |
| `src/components/MotivationSystem/Workshop/LettersSection.tsx`      | 1,466 | Component    | High         |
| `src/components/TemplateScienceModal.tsx`                          | 1,373 | Component    | Medium       |
| `src/components/MotivationSystem/Workshop/AffirmationsSection.tsx` | 1,277 | Component    | High         |
| `src/components/MotivationSystem/Workshop/VoiceNotesSection.tsx`   | 1,112 | Component    | High         |
| `src/components/MotivationSystem/Workshop/VisionBoardSection.tsx`  | 1,084 | Component    | High         |
| `src/screens/HabitEditScreen.tsx`                                  | 1,071 | Screen       | Medium       |
| `src/components/FullsizeTemplatePreview.tsx`                       | 1,046 | Component    | Medium       |
| `src/screens/TemplatesScreen.tsx`                                  | 1,039 | Screen       | Medium       |
| `src/utils/notifications.ts`                                       | 978   | Utility      | High         |
| `convex/habitStrength.ts`                                          | 982   | Backend      | Medium       |
| `convex/habits.ts`                                                 | 927   | Backend      | Medium       |

### Key Directories

```
src/
├── components/          # 57 component directories
├── screens/             # 10+ screens (HabitDetailScreen is 3,503 LOC!)
├── features/habits/     # Feature module (good pattern)
├── hooks/               # 14 custom hooks
├── utils/               # 19+ utilities
├── theme/               # Design system
├── contexts/            # React Context providers
└── types/               # TypeScript definitions

convex/
├── schema.ts            # Database schema (514 LOC)
├── habits.ts            # Core CRUD (927 LOC)
├── habitStrength.ts     # Algorithm (982 LOC)
├── templates.ts         # Template data (4,981 LOC)
└── [30+ service files]
```

### Existing Patterns Already In Use

1. **Co-located Testing**: `Component.tsx` alongside `__tests__/Component.test.tsx`
2. **Feature Modules**: `features/habits/` with components, hooks, tests
3. **Custom Hook Pattern**: Complex logic extracted to hooks (audio, offline, drafts)
4. **Index Re-exports**: Most directories have `index.ts` barrel files
5. **Convex Data Layer**: Type-safe queries/mutations with generated types
6. **NativeWind Styling**: Tailwind CSS for React Native
7. **Design Token System**: `theme/colors.ts`, `theme/typography.ts`, `theme/spacing.ts`

---

## Investigation Tactics

### Tactic 1: Monster File Decomposition

- **Target:** Files over 1,000 LOC that are doing too much
- **Search Pattern:** Find files by size, examine for multiple concerns
- **Files to Check:**
  - `src/screens/HabitDetailScreen.tsx` (3,503 LOC) - **PRIMARY TARGET**
  - `src/screens/HabitEditScreen.tsx` (1,071 LOC)
  - `src/screens/TemplatesScreen.tsx` (1,039 LOC)
  - Workshop components (1,000-1,500 LOC each)
- **Why It Matters:** Large files indicate multiple responsibilities mixed together. They're harder to test, maintain, and reason about. Screen components especially should delegate to sub-components and custom hooks.

### Tactic 2: Workshop Component Pattern Extraction

- **Target:** Duplicate patterns across MotivationSystem/Workshop components
- **Search Pattern:** Compare structure of:
  ```
  LettersSection.tsx (1,466 LOC)
  AffirmationsSection.tsx (1,277 LOC)
  VoiceNotesSection.tsx (1,112 LOC)
  VisionBoardSection.tsx (1,084 LOC)
  ```
- **Files to Check:** `src/components/MotivationSystem/Workshop/*.tsx`
- **Why It Matters:** These four components likely share UI patterns (headers, forms, lists, empty states). Extracting shared components would reduce total code by 30-40% and ensure UI consistency.

### Tactic 3: Notification System Modularization

- **Target:** Monolithic notification utility
- **Search Pattern:** Examine `src/utils/notifications.ts` (978 LOC)
- **Files to Check:**
  - `src/utils/notifications.ts`
  - Components that import from notifications
- **Why It Matters:** A 1,000 LOC utility file typically handles too many notification types. Should be split by notification category (habit reminders, achievements, streaks, rescue alerts).

### Tactic 4: Hook Size Analysis

- **Target:** Custom hooks that have grown too large
- **Search Pattern:** `src/hooks/*.ts` over 500 LOC
- **Files to Check:**
  - `useAudioRecording.ts` (847 LOC)
  - `useAudioPlayback.ts` (727 LOC)
  - `useOfflineQueue.ts` (626 LOC)
  - `useRescueTrigger.ts` (449 LOC)
  - `useDraftStorage.ts` (389 LOC)
- **Why It Matters:** Large hooks often contain mixed concerns. Consider extracting sub-hooks or utility functions.

### Tactic 5: Backend Data File Externalization

- **Target:** Large data/template files in backend code
- **Search Pattern:** `convex/templates.ts` (4,981 LOC)
- **Files to Check:**
  - `convex/templates.ts`
  - Any other files with extensive template/seed data
- **Why It Matters:** Template data isn't code logic - it should be in JSON/external config or database seeds. This makes the backend cleaner and templates easier to modify.

### Tactic 6: Dead Code Detection

- **Target:** Unused exports, commented code, duplicate directories
- **Search Pattern:**
  - Directories with numbers: `auth/` vs `auth 2/`
  - Files ending in `.old`, `.bak`, or containing "test 2"
  - `// TODO`, `// FIXME`, `// deprecated` comments
- **Files to Check:**
  - `src/screens/auth/` and `src/screens/auth 2/`
  - Look for `.old` files throughout
  - Check for unused exports
- **Why It Matters:** Dead code adds cognitive load and maintenance burden. Cleaning it up makes the codebase easier to navigate.

### Tactic 7: Duplicate Config Detection

- **Target:** Redundant configuration files
- **Search Pattern:** Multiple similar config files at root
- **Files to Check:**
  - Root-level `.coderabbit*` variations
  - `.windsurfrules` duplicates
  - Verify all configs are necessary
- **Why It Matters:** Duplicate configs cause confusion about which is active and can lead to divergent settings.

### Tactic 8: Function Complexity Scan

- **Target:** Functions over 50 lines or with deep nesting
- **Search Pattern:** Analyze large files for function boundaries
- **Files to Check:**
  - `HabitDetailScreen.tsx` - likely has render methods > 50 LOC
  - `habitStrength.ts` - complex algorithm functions
  - `notifications.ts` - likely has long scheduling functions
- **Why It Matters:** Long functions are hard to test and understand. Breaking them into smaller, named functions improves readability.

### Tactic 9: Context/Provider Consolidation

- **Target:** Scattered state management that could be unified
- **Search Pattern:** `src/contexts/*.tsx`, `useContext` usage patterns
- **Files to Check:**
  - `src/contexts/NetworkStatusContext.tsx`
  - App.tsx provider hierarchy
  - Look for context candidates (theme, user preferences)
- **Why It Matters:** Proper context usage reduces prop drilling and centralizes state. Under-utilizing context leads to prop chains.

### Tactic 10: Feature Module Pattern Expansion

- **Target:** Components outside `features/` that could be feature modules
- **Search Pattern:** Related components in `src/components/` that form a cohesive feature
- **Files to Check:**
  - `MotivationSystem/` - 5 subsystems that could be a feature
  - Calendar-related components
  - Analytics/stats components
- **Why It Matters:** The `features/habits/` structure is good but not consistently applied. Feature modules improve code organization and make dependencies explicit.

---

## Priority Order

### Phase 1: High-Impact Screen Refactoring

1. **HabitDetailScreen decomposition** - Biggest single file, affects daily use
2. **Workshop component pattern extraction** - 4 similar components
3. **Notification utility modularization** - High coupling

### Phase 2: Architecture Improvements

4. **Feature module expansion** - Apply patterns consistently
5. **Dead code cleanup** - Remove duplicates and abandoned files
6. **Hook decomposition** - Break up large hooks

### Phase 3: Cleanup and Optimization

7. **Config deduplication** - Clean root directory
8. **Backend data externalization** - Move templates to config
9. **Function complexity reduction** - Break up large functions
10. **Context pattern improvements** - Better state management

---

## Risk Assessment

| Risk                    | Impact | Mitigation                                               |
| ----------------------- | ------ | -------------------------------------------------------- |
| Breaking existing tests | High   | Run test suite after each refactoring step               |
| UI regressions          | Medium | Visual regression testing, manual QA                     |
| Data flow changes       | High   | Keep Convex API unchanged during refactoring             |
| Import path changes     | Low    | Use IDE refactoring tools, update imports systematically |

---

## Success Metrics

- [ ] No file over 1,000 LOC (excluding pure data/test files)
- [ ] All screen components under 500 LOC
- [ ] All custom hooks under 400 LOC
- [ ] Zero duplicate directories/files
- [ ] Feature module pattern applied to 3+ features
- [ ] Test coverage maintained or improved
