# Story: Create Habit V4 Redesign

## Overview
- **ID**: CH-005
- **Priority**: High
- **Effort**: Medium (4-6 hours)
- **Dependencies**: CH-001 (Color Picker Phase 1)

## Summary

Complete redesign of the Create Habit modal focusing on:
1. Removing preview card (inline emoji is sufficient)
2. Keyboard-aware UX with auto-scroll + "Done" button
3. Subtle suggestion chips instead of "Quick Start" section
4. Cleaner, faster single-screen flow

## Design Reference

**Mockups:**
- `.superdesign/design_iterations/create_habit_v4_no_preview_1.html` - No preview card design
- `.superdesign/design_iterations/create_habit_v4_keyboard_solutions_1.html` - Keyboard solutions (use Solution C)

---

## User Stories

### US1: Inline Preview
As a user, I want to see my habit emoji/color update live next to the input, so I don't need a separate preview card.

### US2: Keyboard Dismissal
As a user, I want clear ways to dismiss the keyboard and see the rest of the form, so I'm not stuck on the input field.

### US3: Quick Suggestions
As a user, I want subtle habit suggestions as chips, so I can quickly pick one without a dedicated section.

---

## Acceptance Criteria

- [x] Preview card removed entirely
- [x] Inline emoji (64px) appears left of input, updates with color selection
- [x] "Done" button appears in header when keyboard is open
- [x] Auto-scroll reveals Style section when user types valid name (5+ chars)
- [x] Suggestion chips appear below input (not a separate "Quick Start" section)
- [x] AI suggestions appear when typing (contextual completions)
- [x] Tapping a color dismisses keyboard naturally
- [x] 24-color picker displays in 3 rows
- [x] Form sections (Style, Reminder) are muted/disabled until name entered

**Implementation Notes (2025-12-21):**
- Created `InlineEmojiInput.tsx` with 64px tappable emoji box + input field
- Updated `ModalHeader.tsx` to show "Done" button when keyboard is visible
- Created `SuggestionChips.tsx` for quick habit suggestions (6 chips)
- Created `AISuggestionChips.tsx` for contextual completions (purple-tinted chips)
- Updated `StyleSection.tsx` with 24 colors in 3 rows, keyboard dismissal on tap
- Updated `SimpleReminderSection.tsx` with disabled prop for progressive disclosure
- Added `useDebounce` hook for auto-scroll behavior (300ms debounce)
- Full integration in `CreateHabitModalV2.tsx` with all features

---

## Tasks

### T1: Remove Preview Card Components
**Files to modify:**
- `src/components/CreateHabitModal/CreateHabitModalV2.tsx`
- `src/components/CreateHabitModal/components/LivePreview.tsx` (keep file, stop using)

**Changes:**
1. Remove `<LivePreview />` component from render
2. Remove LivePreview import
3. Keep the component file for potential future use

---

### T2: Create Inline Emoji Input Component
**File:** `src/components/CreateHabitModal/components/InlineEmojiInput.tsx` (new)

```tsx
interface InlineEmojiInputProps {
  emoji: string | null;
  color: string;
  value: string;
  onChange: (text: string) => void;
  onFocus: () => void;
  autoFocus: boolean;
}
```

**Design:**
- 64px emoji box (rounded-2xl) on left
- Input field on right (flex-1)
- Emoji box background = selected color
- Default emoji = ✨ (dimmed) when none selected
- Validation message below input (right-aligned under input, not emoji)

---

### T3: Implement Keyboard-Aware Header
**File:** `src/components/CreateHabitModal/components/ModalHeader.tsx`

**Changes:**
1. Add `isKeyboardVisible` prop
2. When keyboard visible:
   - Show "Done" text button on right side
   - Compact header padding
3. "Done" button calls `Keyboard.dismiss()`

```tsx
interface ModalHeaderProps {
  onClose: () => void;
  isKeyboardVisible: boolean;
  onDismissKeyboard: () => void;
}
```

---

### T4: Implement Auto-Scroll on Valid Input
**File:** `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

**Logic:**
1. Use `useRef` for ScrollView
2. When `habitName.length >= 5` and keyboard is visible:
   - `scrollViewRef.current.scrollTo({ y: 100, animated: true })`
3. Debounce to avoid scroll spam (300ms)

---

### T5: Replace Quick Start with Suggestion Chips
**File:** `src/components/CreateHabitModal/components/SuggestionChips.tsx` (new)

**Design:**
- Horizontal flex-wrap of pill chips
- Each chip: emoji + short text (e.g., "💧 Drink water")
- Tapping chip = fills form (name, emoji, color)
- Chips hide when input has 3+ characters (show AI suggestions instead)

**Data:**
```typescript
const SUGGESTION_CHIPS = [
  { name: 'Drink water', emoji: '💧', color: '#3B82F6' },
  { name: 'Read 10 min', emoji: '📖', color: '#8B5CF6' },
  { name: 'Meditate', emoji: '🧘', color: '#22C55E' },
  { name: 'Exercise', emoji: '🏃', color: '#F97316' },
];
```

---

### T6: Implement AI Suggestion Chips
**File:** `src/components/CreateHabitModal/components/AISuggestionChips.tsx` (new)

**Design:**
- Appear when user is typing (3+ chars)
- Purple-tinted chips with completions: "+ 5 minutes", "+ morning"
- Tapping appends text to input

**Logic:**
```typescript
const getAISuggestions = (input: string): string[] => {
  const q = input.toLowerCase();
  if (q.includes('meditat')) return ['5 minutes', 'morning', 'before bed'];
  if (q.includes('read')) return ['10 minutes', '20 pages', 'before sleep'];
  if (q.includes('exercise') || q.includes('workout')) return ['30 minutes', 'morning', '3x week'];
  // ... more patterns
  return [];
};
```

---

### T7: Progressive Disclosure for Form Sections
**File:** `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

**Logic:**
1. Style and Reminder sections render with `opacity: 0.4` and `pointerEvents: 'none'` when `habitName.length < 1`
2. Sections become interactive when name is entered
3. Use `Animated.View` for smooth opacity transition

---

### T8: Update StyleSection Layout
**File:** `src/components/CreateHabitModal/components/StyleSection.tsx`

**Changes:**
1. Ensure 24 colors render in 3 rows (from CH-001)
2. Add tappable icon row that opens emoji picker
3. Compact spacing to fit more above keyboard

---

### T9: Wire Up Keyboard Listeners
**File:** `src/components/CreateHabitModal/hooks/useKeyboardState.ts` (exists)

**Ensure:**
- `isKeyboardVisible` is accurate
- `keyboardHeight` is available for positioning
- Export values to parent component

---

### T10: Update Main Modal Integration
**File:** `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

**Final integration:**
1. Replace HeroNameInput with InlineEmojiInput
2. Remove LivePreview
3. Add SuggestionChips (visible when empty)
4. Add AISuggestionChips (visible when typing)
5. Pass keyboard state to ModalHeader
6. Implement auto-scroll logic
7. Apply progressive disclosure to sections

---

## Files Summary

| File | Action |
|------|--------|
| `CreateHabitModalV2.tsx` | Major refactor |
| `components/LivePreview.tsx` | Keep but stop using |
| `components/InlineEmojiInput.tsx` | New |
| `components/ModalHeader.tsx` | Modify |
| `components/SuggestionChips.tsx` | New |
| `components/AISuggestionChips.tsx` | New |
| `components/StyleSection.tsx` | Modify |
| `hooks/useKeyboardState.ts` | Verify/enhance |

---

## Testing Checklist

### Input & Preview
- [x] Emoji box appears left of input
- [x] Emoji updates when selected from picker
- [x] Color updates emoji box background
- [x] Default state shows ✨ dimmed

### Keyboard Behavior
- [x] "Done" appears in header when keyboard open
- [x] Tapping "Done" dismisses keyboard
- [x] Auto-scroll reveals Style section after typing 5+ chars
- [x] Tapping color dismisses keyboard

### Suggestions
- [x] Suggestion chips visible on empty input
- [x] Tapping chip fills form completely
- [x] AI suggestions appear when typing
- [x] Tapping AI suggestion appends to input

### Progressive Disclosure
- [x] Style section muted when no name
- [x] Reminder section muted when no name
- [x] Sections become interactive after typing

### General
- [x] No TypeScript errors (in newly created/modified files)
- [x] Smooth animations (no jank) - uses spring/timing animations throughout
- [x] Haptic feedback on interactions - triggerSelection, triggerLightImpact throughout
- [x] Works in edit mode - isEditMode passed through and handled

---

## Success Metrics

- Reduced vertical scroll needed
- Faster habit creation time
- No user confusion about keyboard dismissal
- Cleaner, more focused UI
