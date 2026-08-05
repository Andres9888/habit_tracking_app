# Code Decomposition Patterns

Date: 2026-01-08
Status: Active
Related: [[TECH_SPEC_code-readability-initiative]]

---

## Overview

This document defines the canonical decomposition patterns for achieving the **100-line maximum file size** goal across the codebase. These patterns are based on existing successful implementations within the project.

**Goal:** Every production file should be understandable in a single code review without scrolling through pages of implementation details.

---

## Pattern 1: Component Decomposition

Use this pattern for React/React Native components that exceed 100 lines.

### Folder Structure

```
ComponentName/
├── index.ts              # Barrel export (1-5 lines)
├── ComponentName.tsx     # Main orchestration (≤100 lines)
├── ComponentName.hooks.ts # Custom hooks for business logic (≤100 lines)
├── ComponentName.types.ts # TypeScript interfaces/types (≤100 lines)
├── ComponentName.styles.ts # Styled components or style objects (≤100 lines)
├── ComponentName.constants.ts # Magic values, configuration (≤100 lines)
├── components/           # Sub-components folder (if needed)
│   ├── SubComponentA.tsx
│   └── SubComponentB.tsx
└── __tests__/           # Test files (no line limit)
    └── ComponentName.test.tsx
```

### Example: Barrel Export (index.ts)

```typescript
// index.ts - 2 lines
export { default } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### Example: Main Component File

```typescript
// ComponentName.tsx - orchestration only
import { View } from 'react-native';
import { useComponentNameLogic } from './ComponentName.hooks';
import { ComponentHeader } from './components/ComponentHeader';
import { ComponentBody } from './components/ComponentBody';
import type { ComponentNameProps } from './ComponentName.types';

export default function ComponentName({ title, onSubmit }: ComponentNameProps) {
  const { state, handlers } = useComponentNameLogic({ onSubmit });

  return (
    <View>
      <ComponentHeader title={title} onBack={handlers.handleBack} />
      <ComponentBody data={state.items} onItemPress={handlers.handleItemPress} />
    </View>
  );
}
```

### Example: Hooks File

```typescript
// ComponentName.hooks.ts - business logic
import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface UseComponentNameLogicProps {
  onSubmit: () => void;
}

export const useComponentNameLogic = ({
  onSubmit,
}: UseComponentNameLogicProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const items = useQuery(api.items.list);
  const updateItem = useMutation(api.items.update);

  const handleItemPress = useCallback((id: string) => {
    setSelectedItem(id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    state: { items, selectedItem },
    handlers: { handleBack, handleItemPress },
  };
};
```

### Example: Types File

```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  title: string;
  onSubmit: () => void;
  initialData?: ItemData[];
}

export interface ItemData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export type ComponentView = 'list' | 'detail' | 'edit';
```

---

## Pattern 2: Hook Decomposition

Use this pattern for complex custom hooks that exceed 100 lines.

### Folder Structure

```
useFeature/
├── index.ts                # Re-exports
├── useFeature.ts           # Main hook - orchestrates sub-hooks (≤100 lines)
├── useFeatureState.ts      # State management (≤100 lines)
├── useFeatureEffects.ts    # Side effects, subscriptions (≤100 lines)
├── useFeatureHandlers.ts   # Event handlers, callbacks (≤100 lines)
├── useFeatureQueries.ts    # Data fetching (≤100 lines)
├── useFeatureMutations.ts  # Data mutations (≤100 lines)
└── types.ts                # Types
```

### Example: Main Hook (Orchestration)

```typescript
// useFeature.ts - orchestrates sub-hooks
import { useFeatureState } from './useFeatureState';
import { useFeatureEffects } from './useFeatureEffects';
import { useFeatureHandlers } from './useFeatureHandlers';
import type { UseFeatureReturn } from './types';

export const useFeature = (options: UseFeatureOptions): UseFeatureReturn => {
  const state = useFeatureState(options);
  const handlers = useFeatureHandlers(state);

  useFeatureEffects(state, handlers);

  return {
    ...state,
    ...handlers,
  };
};
```

### Example: State Hook

```typescript
// useFeatureState.ts
import { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const useFeatureState = (options: UseFeatureOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const data = useQuery(api.feature.list);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => item.status === 'active');
  }, [data]);

  return {
    data,
    error,
    filteredData,
    isLoading,
    selectedId,
    setError,
    setIsLoading,
    setSelectedId,
  };
};
```

### Example: Handlers Hook

```typescript
// useFeatureHandlers.ts
import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const useFeatureHandlers = (state: FeatureState) => {
  const updateFeature = useMutation(api.feature.update);

  const handleSelect = useCallback(
    (id: string) => {
      state.setSelectedId(id);
    },
    [state.setSelectedId]
  );

  const handleSubmit = useCallback(
    async (data: FeatureData) => {
      state.setIsLoading(true);
      try {
        await updateFeature(data);
      } catch (e) {
        state.setError('Failed to update');
      } finally {
        state.setIsLoading(false);
      }
    },
    [updateFeature, state]
  );

  return { handleSelect, handleSubmit };
};
```

---

## Pattern 3: Utility Decomposition

Use this pattern for utility modules that exceed 100 lines.

### Folder Structure

```
utilityName/
├── index.ts              # Re-exports all utilities
├── core.ts               # Core logic functions (≤100 lines)
├── helpers.ts            # Helper functions (≤100 lines)
├── validators.ts         # Validation logic (≤100 lines)
├── transformers.ts       # Data transformation (≤100 lines)
├── constants.ts          # Configuration, magic values (≤100 lines)
└── types.ts              # Types
```

### Example: Index with Named Exports

```typescript
// index.ts
export { calculateTotal, formatCurrency } from './core';
export { validateAmount, validateDate } from './validators';
export { transformApiResponse, normalizeData } from './transformers';
export { DEFAULT_OPTIONS, ERROR_MESSAGES } from './constants';
export type { UtilityOptions, TransformResult } from './types';
```

---

## Pattern 4: Screen Decomposition

Use this pattern for screen/page components that exceed 100 lines.

### Folder Structure

```
FeatureScreen/
├── index.ts                    # Barrel export
├── FeatureScreen.tsx           # Main screen (≤100 lines)
├── FeatureScreen.hooks.ts      # Screen-level hooks
├── FeatureScreen.types.ts      # Types
├── components/                 # Screen-specific components
│   ├── FeatureHeader.tsx
│   ├── FeatureContent.tsx
│   ├── FeatureActions.tsx
│   └── FeatureEmptyState.tsx
└── sections/                   # Larger UI sections (if needed)
    ├── FeatureListSection/
    └── FeatureDetailSection/
```

---

## Decomposition Decision Tree

Use this flow to decide how to decompose a file:

```
Is file > 100 lines?
├── No → No action needed
└── Yes → What type of file?
    ├── Component (.tsx)
    │   ├── Has complex state logic? → Extract hooks
    │   ├── Has reusable sub-components? → Create components/ folder
    │   ├── Has many styles? → Extract styles file
    │   └── Has many types? → Extract types file
    ├── Hook (use*.ts)
    │   ├── Has state + effects + handlers? → Split into sub-hooks
    │   └── Has complex data fetching? → Extract queries/mutations
    └── Utility (.ts)
        ├── Has validation? → Extract validators.ts
        ├── Has transformations? → Extract transformers.ts
        └── Has multiple concerns? → Split by concern
```

---

## Naming Conventions

### File Naming

| Type              | Pattern          | Example                  |
| ----------------- | ---------------- | ------------------------ |
| Component         | `PascalCase.tsx` | `HabitCard.tsx`          |
| Hook              | `camelCase.ts`   | `useHabitCard.ts`        |
| Types             | `*.types.ts`     | `HabitCard.types.ts`     |
| Styles            | `*.styles.ts`    | `HabitCard.styles.ts`    |
| Constants         | `*.constants.ts` | `HabitCard.constants.ts` |
| Hooks (component) | `*.hooks.ts`     | `HabitCard.hooks.ts`     |

### Export Conventions

- **Default exports** for components: `export default function ComponentName`
- **Named exports** for hooks: `export const useFeature = ...`
- **Named exports** for utilities: `export function helperFunction`
- **Type exports** separate from value exports when needed

---

## Exemplar Decompositions

These files were decomposed as reference implementations for the three main patterns.

### trendCalculations (Utility Pattern)

**Before:** 275 lines in a single file
**After:** 5 files, all ≤100 lines

```
src/utils/trendCalculations/
├── index.ts              # 19 lines - re-exports
├── types.ts              # 52 lines - types
├── dateHelpers.ts        # 35 lines - date utilities
├── weeklyTrend.ts        # 93 lines - weekly calculations
└── monthlyTrend.ts       # 116 lines - monthly calculations (64 code lines)
```

### useMilestoneDetection (Hook Pattern)

**Before:** 226 lines with 2 hooks bundled together
**After:** 5 files, all ≤80 lines

```
src/hooks/useMilestoneDetection/
├── index.ts                    # 22 lines - re-exports
├── types.ts                    # 28 lines - types
├── utils.ts                    # 27 lines - helper functions
├── useMilestoneDetection.ts    # 75 lines - single habit hook
└── useMultiMilestoneDetection.ts # 69 lines - multi habit hook
```

### HabitDetailTabs (Component Pattern)

**Before:** 167 lines with embedded sub-component
**After:** 6 files, all ≤90 lines

```
src/components/HabitDetailTabs/
├── index.ts                    # 12 lines - barrel export
├── HabitDetailTabs.tsx         # 77 lines - main component
├── HabitDetailTabs.types.ts    # 39 lines - types
├── HabitDetailTabs.constants.ts # 24 lines - constants
├── TabContent.tsx              # 90 lines - tab content manager
└── components/
    └── TabButton.tsx           # 54 lines - tab button
```

---

## Real Examples from Codebase

### SettingsModal (Well Decomposed)

```
src/components/SettingsModal/
├── index.ts                 # 2 lines - barrel export
├── SettingsModal.tsx        # 217 lines - main component
├── SettingsModal.hooks.ts   # 117 lines - business logic
├── SettingsSection.tsx      # 47 lines - reusable section
└── SettingsRow.tsx          # 124 lines - reusable row
```

**Total: 507 lines across 5 files (avg 101 lines)**

### CreateHabitModal (Highly Decomposed)

```
src/components/CreateHabitModal/
├── index.ts
├── CreateHabitModal.tsx
├── constants.ts
├── types.ts
├── utils.ts
├── components/              # 42 sub-components
│   ├── ColorPickerSheet.tsx
│   ├── FrequencySelector.tsx
│   └── ...
└── hooks/                   # 12 hooks
    ├── useCreateHabitModal.ts
    ├── useHabitForm.ts
    └── ...
```

---

## Migration Checklist

When decomposing a file, ensure:

- [ ] Original file is ≤100 lines after decomposition
- [ ] Each new file is ≤100 lines
- [ ] Barrel export (`index.ts`) maintains public API
- [ ] All imports updated across codebase
- [ ] Types exported where needed by other files
- [ ] Tests still pass (run full test suite)
- [ ] No circular dependencies introduced

---

## Anti-Patterns to Avoid

1. **Over-decomposition**: Don't create a file for 10 lines of code
2. **Premature abstraction**: Don't create helpers for one-time operations
3. **Circular dependencies**: Hooks importing from components that use them
4. **Hidden coupling**: Components that can't work without sibling files
5. **Deep nesting**: More than 2 levels of folders (components/section/subsection/)

---

_Reference this document when decomposing files for the Code Readability Initiative._
