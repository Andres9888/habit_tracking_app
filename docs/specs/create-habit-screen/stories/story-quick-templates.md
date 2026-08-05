# Story: Add Quick Templates Row to V2 Modal

## Overview
- **ID**: CH-002
- **Priority**: High
- **Effort**: Medium (2-4 hours)
- **Dependencies**: None

## User Story
As a new user, I want to quickly start from a template so I don't have to think about what habit to create.

## Acceptance Criteria
- [ ] Compact template row appears below Hero Name Input
- [ ] Shows 4 popular templates: Water, Read, Meditate, Walk
- [ ] Tapping template auto-fills name, emoji, and color
- [ ] "Browse all" link opens full template browser
- [ ] Row collapses/hides once user starts typing

## Tasks

### T1: Create QuickTemplatesRow Component
**File**: `src/components/CreateHabitModal/components/QuickTemplatesRow.tsx`
```tsx
interface QuickTemplatesRowProps {
  onSelectTemplate: (template: QuickTemplate) => void;
  onBrowseAll: () => void;
  visible: boolean; // hide when user is typing
}
```
- Horizontal scroll row with 4 template cards
- Each card: emoji + short name (e.g., "💧 Water")
- "Browse all →" text button at end

### T2: Define Quick Templates Data
**File**: `src/components/CreateHabitModal/constants.ts`
```typescript
export const QUICK_TEMPLATES = [
  { id: 'water', name: 'Drink water', emoji: '💧', color: '#3B82F6' },
  { id: 'read', name: 'Read 10 min', emoji: '📖', color: '#8B5CF6' },
  { id: 'meditate', name: 'Meditate', emoji: '🧘', color: '#22C55E' },
  { id: 'walk', name: 'Walk 15 min', emoji: '🚶', color: '#F97316' },
];
```

### T3: Integrate into CreateHabitModalV2
**File**: `src/components/CreateHabitModal/CreateHabitModalV2.tsx`
- Add `QuickTemplatesRow` after `HeroNameInput`
- Pass visibility based on `!form.habitName.trim()`
- Handle template selection → populate form fields
- Handle "Browse all" → open full TemplateBrowser modal

### T4: Add Auto-Fill Logic to Hook
**File**: `src/components/CreateHabitModal/hooks/useHabitForm.ts`
- Add `applyTemplate(template)` function
- Sets habitName, selectedEmoji, selectedColor in one action

### T5: Style Template Cards
- Size: 80x72px rounded cards
- Background: color at 10% opacity
- Emoji: 24px centered
- Name: 11px semibold, truncated

## Testing Checklist
- [ ] 4 templates visible on fresh modal open
- [ ] Tap template → form auto-fills all 3 fields
- [ ] Templates row hides when typing name
- [ ] Templates row reappears if name cleared
- [ ] "Browse all" opens template browser
- [ ] Haptic feedback on template tap
- [ ] Horizontal scroll works if more templates added

## Design Reference
```
┌─────────────────────────────────────────┐
│ 🚀 Quick Start                          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│ │  💧  │ │  📖  │ │  🧘  │ │  🚶  │    │
│ │Water │ │ Read │ │Medit.│ │ Walk │    │
│ └──────┘ └──────┘ └──────┘ └──────┘    │
│                            Browse all → │
└─────────────────────────────────────────┘
```
