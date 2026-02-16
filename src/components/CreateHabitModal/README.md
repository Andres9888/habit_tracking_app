# CreateHabitModal

Full-screen modal for creating and editing habits in Chain Day.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Key Files](#key-files)
- [Hooks](#hooks)
- [Components](#components)
- [Data Flow](#data-flow)
- [Development Guide](#development-guide)

---

## Overview

The `CreateHabitModal` is the primary UI for habit creation and editing. It provides:

- **Simple form**: Name, emoji, color, reminders
- **Template support**: Quick start with pre-configured habits
- **Smart defaults**: Time-aware reminder suggestions
- **Validation**: Real-time feedback with error handling
- **Platform-aware**: Adapts to iOS, Android, and Web

### Design Principles

1. **Identity before behavior**: Focus on what the habit is before scheduling
2. **Progressive disclosure**: Core fields first, optional features later
3. **Immediate feedback**: Validate as user types, show errors clearly
4. **Smart defaults**: Pre-fill sensible values to reduce friction

---

## Quick Start

### Usage

```tsx
import CreateHabitModalCentered from './CreateHabitModal';

// Create mode
<CreateHabitModalCentered
  visible={isOpen}
  onClose={handleClose}
/>

// Edit mode
<CreateHabitModalCentered
  visible={isOpen}
  onClose={handleClose}
  habitToEdit={existingHabit}
/>
```

### Creating a New Habit

1. User opens modal
2. Types habit name (e.g., "Morning workout")
3. Optionally selects emoji (💪) and color (#10B981)
4. Optionally enables reminders
5. Taps "Done" → Validation → API call → Success

### Editing an Existing Habit

1. User opens modal with `habitToEdit` prop
2. Form pre-filled with existing data
3. User makes changes
4. Taps "Done" → Update mutation → Success

---

## Architecture

### Component Hierarchy

```
CreateHabitModalCentered (Presentation layer)
├── ModalHeader (Header with save button)
└── CreateHabitScrollContent (Scrollable form)
    ├── HeroNameInput (Centered name field)
    ├── EmojiPicker (Emoji selection)
    ├── ColorPickerSection (Color selection)
    └── SimpleReminderSection (Reminder toggle + time)
```

### Hook Hierarchy

```
useCreateHabitModal (Main orchestrator)
├── useHabitForm (Form state)
│   ├── useHabitFormState (Raw state)
│   ├── useHabitFormInit (Initialize from habitToEdit)
│   ├── useHabitFormReset (Reset to defaults)
│   └── useFieldValidation (Debounced validation)
├── useCreateHabitHandlers (Create/edit mutations)
├── useCenteredFormCallbacks (Event handlers)
├── useTemplateBrowser (Template selection)
└── useHabitReminders (Reminder scheduling)
```

---

## Key Files

### Core Files

| File | Purpose | Lines |
|------|---------|-------|
| `CreateHabitModalCentered.tsx` | Main modal component | ~90 |
| `constants.ts` | Emojis, colors, defaults | 57 |
| `types.ts` | TypeScript interfaces | 34 |
| `utils.ts` | Validation & parsing | 91 |

### Why Both `utils.ts` and `utils/` Folder?

- **`utils.ts`**: General utilities (validation, parsing, name building)
- **`utils/templateUtils.ts`**: Template-specific logic (extraction)
- **`utils.ts` re-exports** from `utils/` for convenience

This separation keeps related logic together while maintaining a clean import structure:

```typescript
import { validateHabitName, extractTemplateDetails } from './utils';
// Both available from single import
```

---

## Hooks

### Main Hooks

#### `useCreateHabitModal`
**Role**: Main orchestrator  
**Responsibilities**:
- Coordinates all sub-hooks
- Provides `handleCreate` action
- Manages template application
- Handles modal lifecycle

#### `useHabitForm`
**Role**: Form state manager  
**Responsibilities**:
- Manages all form fields
- Validates habit name
- Computes `fullHabitName`
- Provides reset functionality

#### `useCreateHabitHandlers`
**Role**: Mutation handler  
**Responsibilities**:
- Create habit API call
- Edit habit API call
- Reminder scheduling
- Error handling

### Supporting Hooks

| Hook | Purpose |
|------|---------|
| `useHabitFormState` | Raw useState calls for fields |
| `useHabitFormInit` | Initialize from habitToEdit |
| `useHabitFormReset` | Reset to defaults |
| `useCenteredFormCallbacks` | Memoized event handlers |
| `useHabitReminders` | Reminder permissions & scheduling |
| `useReminderOptionSync` | Sync reminder preset with time/phase |
| `useSwipeDismiss` | Swipe-to-dismiss gesture |

---

## Components

### Main Components

#### `CreateHabitModalCentered`
**Type**: Presentation  
**Purpose**: Modal shell with gestures, keyboard handling, layout

#### `CreateHabitScrollContent`
**Type**: Container  
**Purpose**: Scrollable form content with all sections

### Form Sections

| Component | Purpose |
|-----------|---------|
| `ModalHeader` | Header with "Done" button |
| `HeroNameInput` | Centered, prominent name input field |
| `EmojiPicker` | Grid of emoji options |
| `ColorPickerSection` | Color palette selection |
| `SimpleReminderSection` | Reminder toggle + time picker |

### Sub-Components

Each section has its own sub-folder with:
- Main component (e.g., `EmojiPicker.tsx`)
- Types (`types.ts`)
- Constants (`constants.ts`)
- Custom hooks (e.g., `useEmojiPickerAnimations.ts`)
- Tests (`__tests__/`)

Example: `EmojiPicker/`
```
EmojiPicker/
├── EmojiPicker.tsx         # Main component
├── EmojiGrid.tsx           # Grid layout
├── EmojiChip.tsx           # Individual emoji button
├── useSuggestedEmojis.ts   # Smart emoji suggestions
├── constants.ts            # Emoji categories
├── types.ts                # TypeScript interfaces
└── index.ts                # Public exports
```

---

## Data Flow

### Create Flow

```
User Input → Form State → Validation → API Mutation → Success
    ↓           ↓             ↓            ↓            ↓
TextField → useState → debounce → Convex API → Haptics
```

### State Flow

```typescript
// 1. User types name
handleNameChange("Morning run")
  ↓
form.setHabitName("Morning run")  // useHabitFormState
  ↓
habitNameValidation.setValue()     // useFieldValidation (debounced)
  ↓
fullHabitName = "💪 Morning run"   // useMemo (emoji + name)
  ↓
UI updates with validated value
```

### Submission Flow

```typescript
// 1. User taps "Done"
handleSave()
  ↓
// 2. Validate
validateHabitName(fullHabitName)
  ↓
// 3. Check permissions
checkReminderPermissions()
  ↓
// 4. Create habit
createHabit({ name, emoji, color, ... })
  ↓
// 5. Schedule reminder
scheduleReminder({ habitId, time })
  ↓
// 6. Cleanup
cleanup() → haptics → reset → close
```

---

## Development Guide

### Adding a New Form Field

1. **Add state** in `useHabitFormState.ts`
```typescript
const [newField, setNewField] = useState('default');
```

2. **Add to return** in `useHabitForm.ts`
```typescript
return {
  // ...existing fields
  newField,
  setNewField,
}
```

3. **Add to reset** in `useHabitFormReset.ts`
```typescript
setNewField('default');
```

4. **Use in component**
```tsx
<NewFieldInput
  value={form.newField}
  onChange={form.setNewField}
/>
```

### Adding Validation

1. **Create validator** in `utils.ts`
```typescript
export const validateNewField = (value: string): ValidationResult => {
  // validation logic
}
```

2. **Use in form**
```typescript
const newFieldValidation = useFieldValidation({
  validate: validateNewField,
  debounceMs: 500,
});
```

### Adding a Sub-Component

1. **Create folder** in `components/`
```
components/NewSection/
├── NewSection.tsx
├── types.ts
├── constants.ts
└── index.ts
```

2. **Export from index.ts**
```typescript
export { NewSection } from './NewSection';
```

3. **Use in parent**
```tsx
import { NewSection } from './components/NewSection';
```

### Testing

- **Unit tests**: Individual component behavior
- **Integration tests**: Full modal flow
- **Snapshot tests**: UI regression prevention

Run tests:
```bash
npm test CreateHabitModal
```

---

## Common Tasks

### Changing Default Color
Edit `constants.ts`:
```typescript
export const DEFAULT_COLOR = '#10B981'; // Change this
```

### Adding New Emoji
Edit `constants.ts`:
```typescript
export const EMOJIS = [
  '💪', '🏃', '📖', // ... add here
];
```

### Modifying Validation Rules
Edit `utils.ts`:
```typescript
export const HABIT_NAME_MAX_LENGTH = 100; // Change limit
```

### Customizing Reminder Times
Edit `components/ReminderSelector/constants.ts`:
```typescript
export const REMINDER_PRESETS = {
  morning: '09:00',  // Change time
  midday: '13:00',
  evening: '18:00',
};
```

---

## Troubleshooting

### Form Not Resetting
Check `useVisibilityReset` in `useCreateHabitModal.ts`:
```typescript
useVisibilityReset({
  visible,
  isEditMode,
  resetForm: form.resetForm, // Ensure this is called
});
```

### Validation Not Showing
Check `showErrorsAfterBlur` in `useFieldValidation`:
```typescript
useFieldValidation({
  showErrorsAfterBlur: true, // Errors show after blur
});
```

### Reminder Not Scheduling
Check platform:
```typescript
if (Platform.OS === 'web') {
  // Reminders not supported on web
}
```

---

## Further Reading

- [FLOW.md](./FLOW.md) - Detailed habit creation flow
- [Design System](../../design/DESIGN_SYSTEM.md) - Colors, typography, spacing
- [Testing Guide](../../docs/TESTING.md) - Testing patterns

---

## Questions?

For questions or issues:
1. Check [FLOW.md](./FLOW.md) for detailed flow documentation
2. Read JSDoc comments in source files
3. Check tests for usage examples
4. Open an issue on GitHub

---

**Last Updated**: 2026-02-16  
**Maintainer**: Chain Day Team
