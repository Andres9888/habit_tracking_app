# Habit Creation Flow Documentation

This document explains the complete flow of habit creation in Chain Day, from modal opening to successful save.

## Table of Contents

1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Habit Creation Flow](#habit-creation-flow)
4. [Edit Mode Flow](#edit-mode-flow)
5. [Template Application Flow](#template-application-flow)
6. [Validation & Error Handling](#validation--error-handling)
7. [Reminder Scheduling](#reminder-scheduling)

---

## Overview

The `CreateHabitModal` is a full-screen modal that guides users through creating or editing a habit. It follows the "identity before behavior" principle from habit formation psychology, focusing on what the habit is before scheduling reminders.

### Key Principles

- **Progressive disclosure**: Core fields first (name, emoji, color), optional fields later (reminders)
- **Immediate feedback**: Real-time validation, haptic feedback, visual error states
- **Smart defaults**: Pre-filled colors, emojis, reminder times
- **Template support**: Quick start with pre-configured habit templates

---

## Component Architecture

### File Structure

```
CreateHabitModal/
├── CreateHabitModalCentered.tsx          # Main modal component (presentation)
├── components/
│   ├── CreateHabitScrollContent.tsx      # Scrollable form content
│   ├── ModalHeader/                      # Header with save button
│   ├── HeroNameInput/                    # Name input field (centered, prominent)
│   ├── EmojiPicker/                      # Emoji selection UI
│   ├── ColorPickerSection/               # Color selection UI
│   ├── SimpleReminderSection/            # Reminder toggle + time picker
│   └── ...                               # Other sub-components
├── hooks/
│   ├── useCreateHabitModal.ts            # 🧠 Main orchestrator
│   ├── useHabitForm.ts                   # 📝 Form state manager
│   ├── useCreateHabitHandlers.ts         # 💾 Create/edit mutations
│   ├── useCenteredFormCallbacks.ts       # 🎯 Event handlers
│   ├── useHabitFormState.ts              # 🗂️  Raw state (useState)
│   ├── useHabitFormInit.ts               # 🔄 Initialize from habitToEdit
│   ├── useHabitFormReset.ts              # 🧹 Reset to defaults
│   ├── useHabitReminders.ts              # ⏰ Reminder scheduling
│   └── ...                               # Other specialized hooks
├── constants.ts                          # Emojis, colors, defaults
├── types.ts                              # TypeScript interfaces
├── utils.ts                              # Validation, parsing
└── utils/
    └── templateUtils.ts                  # Template extraction
```

### Data Flow

```
┌─────────────────────────────────────────────┐
│  CreateHabitModalCentered (Presentation)    │
│  - Modal shell, gestures, keyboard          │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────▼─────────┐
         │ useCreateHabitModal │  🧠 Main Orchestrator
         │ - Coordinates hooks │
         │ - Template handling │
         │ - handleCreate      │
         └─────────┬───────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼──────┐  ┌───▼──────┐  ┌───▼─────────┐
│useHabitForm│  │useCreate│  │useTemplate  │
│(state)     │  │Handlers │  │Browser      │
│            │  │(mutations)  │(templates)  │
└────┬───────┘  └─────┬───┘  └─────────────┘
     │                │
┌────▼─────┐    ┌────▼────┐
│FormState │    │ Convex  │
│ (fields) │    │ API     │
└──────────┘    └─────────┘
```

---

## Habit Creation Flow

### Step-by-Step Process

#### 1. **Modal Opens**

```typescript
// User taps "Create Habit" button
<CreateHabitModalCentered visible={true} onClose={handleClose} />
```

**What happens:**
- `useCreateHabitModal` initializes
- `useHabitForm` creates form state
- `useVisibilityReset` resets form if not editing
- Modal animates in with slide transition

#### 2. **User Enters Habit Name**

```typescript
// User types in HeroNameInput
handleNameChange("Morning workout")
```

**What happens:**
- `useFieldValidation` debounces input (500ms)
- Validation runs: length check, character check
- Error cleared if user starts typing
- `fullHabitName` computed (emoji + name)

**Validation Rules:**
- Min: 1 character
- Max: 100 characters
- Allowed: letters, numbers, punctuation, emojis
- Sanitization: control characters removed

#### 3. **User Selects Emoji (Optional)**

```typescript
// User taps emoji from EmojiPicker
handleEmojiSelect("💪")
```

**What happens:**
- `form.setSelectedEmoji("💪")` called
- `fullHabitName` recomputed → "💪 Morning workout"
- Emoji shown in preview

#### 4. **User Selects Color (Optional)**

```typescript
// User taps color from ColorPickerSection
handleColorSelect("#10B981") // Emerald green
```

**What happens:**
- `form.setSelectedColor("#10B981")` called
- Color preview updates
- Selected state shown in UI

#### 5. **User Enables Reminder (Optional)**

```typescript
// User toggles reminder switch
handleReminderToggle(true)
```

**What happens:**
- `form.setRemindersEnabled(true)` called
- Auto-scroll to reminder section (100ms delay)
- Time picker shown with default time (9:00 AM)

#### 6. **User Taps Save**

```typescript
// User taps "Done" button in header
handleSave() → handleCreate()
```

**What happens:**

**A. Validation**
```typescript
validateHabitName(fullHabitName)
// → { isValid: true, sanitized: "💪 Morning workout" }
```

**B. Reminder Permission Check**
```typescript
checkReminderPermissions(remindersEnabled)
// → Prompts for permissions if needed
// → Returns { hasReminders: true, shouldProceed: true }
```

**C. Create Mutation**
```typescript
await createHabit({
  name: "💪 Morning workout",
  icon: "💪",
  iconColor: "#10B981",
  remindersEnabled: true,
  reminderTime: "09:00",
  // ...other fields
})
// → Returns habitId
```

**D. Schedule Reminder**
```typescript
await scheduleReminder({
  habitId: "k17abc123",
  habitName: "💪 Morning workout",
  reminderTime: Date("9:00 AM today")
})
// → Schedules local notification
```

**E. Success Cleanup**
```typescript
cleanup()
// → Trigger success haptics
// → Reset form
// → Close modal
```

#### 7. **Modal Closes**

- Success haptic feedback (impact)
- Form reset for next creation
- Modal dismisses with slide animation
- User returns to habits list

---

## Edit Mode Flow

When `habitToEdit` is provided, the modal enters **edit mode**.

### Differences from Create Mode

1. **Initialization**: Form pre-populated from `habitToEdit`
2. **Header**: Shows "Edit Habit" instead of "Create Habit"
3. **Save Action**: Calls `updateHabit` instead of `createHabit`
4. **Reminder Handling**: Updates/cancels existing reminder

### Edit Flow

```typescript
// Open modal in edit mode
<CreateHabitModalCentered
  visible={true}
  onClose={handleClose}
  habitToEdit={existingHabit}
/>
```

**What happens:**

1. `isEditMode = true` detected
2. `useHabitFormInit` populates form from `habitToEdit`
3. User makes changes
4. User saves → `handleEdit` called
5. Existing reminder updated/cancelled
6. `updateHabit` mutation called
7. Success → cleanup → close

---

## Template Application Flow

Users can apply pre-configured habit templates to quickly create habits.

### Template Selection

```typescript
// User taps template from TemplateBrowser
onTemplateSelect(template)
```

**What happens:**

1. **Extract Template Details**
```typescript
extractTemplateDetails(template)
// → { emoji: "🏃", name: "Morning run" }
```

2. **Apply to Form**
```typescript
applyTemplate(template)
// → form.setSelectedEmoji("🏃")
// → form.setHabitName("Morning run")
// → form.setSelectedColor(template.iconColor)
// → form.setFrequency(template.frequency)
```

3. **User Can Customize**
- Name, emoji, color are suggestions
- User can override any field
- Saves with final user choices

---

## Validation & Error Handling

### Habit Name Validation

**Real-time validation** with debouncing (500ms):

```typescript
useFieldValidation({
  validate: validateHabitName,
  debounceMs: 500,
  showErrorsAfterBlur: true
})
```

**Error states:**
- Empty name → "Habit name is required"
- Too long (>100 chars) → "must be 100 characters or less"
- Invalid characters → "contains invalid characters"

**Error UI:**
- Red border on input field
- Error message below field
- Shake animation on save attempt
- Haptic feedback (warning vibration)

### Reminder Permission Errors

**Platform checks:**

```typescript
// Web: Show info alert
"Reminders on Mobile Only"
"Local reminder notifications can only be scheduled from the iOS/Android app."

// Mobile: Check permissions
ensureNotificationPermissions()
// → If denied: "Enable notifications in your device settings"
```

**Graceful degradation:**
- Habit saved even if reminder fails
- User informed via alert
- Can enable reminders later

---

## Reminder Scheduling

### Reminder Flow

1. **Permission Check**
   - Check notification permissions
   - Prompt if not granted
   - Alert if denied

2. **Schedule Notification**
   - Create daily repeating notification
   - Set to user's chosen time
   - Attach habitId for tracking

3. **Cancel on Disable**
   - Remove scheduled notification
   - Update habit record
   - Clear reminder badge

### Platform Differences

| Platform | Behavior |
|----------|----------|
| iOS | Full reminder support with local notifications |
| Android | Full reminder support with local notifications |
| Web | Saves reminder settings, doesn't schedule (not supported) |

### Reminder Time Options

- **Quick presets**: Morning, Afternoon, Evening
- **Custom time**: Time picker for exact time
- **Default**: 9:00 AM if not specified

---

## Summary

The habit creation flow prioritizes:

1. **Simplicity**: Core fields first, optional features later
2. **Validation**: Real-time feedback, clear error messages
3. **Flexibility**: Templates for speed, customization for control
4. **Reliability**: Graceful error handling, platform awareness
5. **Polish**: Haptics, animations, auto-scroll for great UX

The architecture separates concerns:
- **Presentation** (CreateHabitModalCentered)
- **State** (useHabitForm)
- **Actions** (useCreateHabitHandlers)
- **Events** (useCenteredFormCallbacks)

This makes the code maintainable, testable, and easy to extend.
