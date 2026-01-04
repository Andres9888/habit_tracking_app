# Create Habit Modal - Cards V1 Improved Specification

**Version:** 1.0
**Created:** 2026-01-04
**Status:** Draft
**Design Reference:** `.superdesign/design_iterations/habit_add_screen_cards_v1_improved.html`

---

## 📋 Overview

This spec defines the implementation of an improved card-based Create Habit Modal interface featuring enhanced visual hierarchy, progress tracking, quick presets, and smart contextual hints. The design builds upon the existing V4 implementation while introducing significant UX improvements focused on reducing friction and providing clear completion feedback.

### Goals

- **Reduce form completion friction** through intelligent presets and defaults
- **Increase completion confidence** via real-time progress tracking and visual feedback
- **Improve perceived intelligence** with contextual hints and smart suggestions
- **Maintain accessibility** while enhancing visual polish

### Non-Goals

- Template-based habit creation (future enhancement)
- Multi-step wizard flow (covered in separate spec)
- Reordering/customizing card order

---

## 🎨 Design Philosophy

### Card-Based Information Architecture

- **3 logical sections**: Basic Info, Appearance, Schedule
- Each card groups related fields with clear visual boundaries
- Icon headers provide instant visual categorization
- Required vs Optional badges set clear expectations

### Progress Psychology

- Leverages **Zeigarnik effect** (incomplete tasks create tension → motivation to complete)
- Visual completion states (checkmarks) provide positive reinforcement
- Progress bar shows overall form completion percentage
- Creates "mini-game" feeling rather than tedious form-filling

### Friction Reduction

- **Quick presets** (Daily/Weekdays/Weekends) reduce 7 taps to 1
- **Smart defaults** based on context (Morning→7AM, Afternoon→12PM, etc.)
- **Character counter** provides guidance without blocking
- **Contextual hints** show intelligence without overwhelming

---

## 🏗️ Component Architecture

### File Structure

```
src/components/CreateHabitModal/
├── CreateHabitModal.tsx                 # Main modal orchestrator
├── components/
│   ├── ModalHeader.tsx                  # Header with progress indicator (NEW)
│   ├── LivePreviewCard.tsx              # Enhanced with "Live" badge (UPDATED)
│   ├── BasicInfoCard.tsx                # Card 1: Habit name field (NEW)
│   ├── AppearanceCard.tsx               # Card 2: Emoji + Color (NEW)
│   ├── ScheduleCard.tsx                 # Card 3: Time/Reminder/Frequency (NEW)
│   ├── CompletionBadge.tsx              # Required/Optional/Complete badges (NEW)
│   ├── FrequencyPresets.tsx             # Quick preset buttons (NEW)
│   └── SmartHintText.tsx                # Contextual hint component (NEW)
└── hooks/
    └── useFormCompletion.ts             # Track completion state (NEW)
```

### Component Hierarchy

```
CreateHabitModal
├── ModalHeader (progress: 2/3, progressBar)
├── ScrollView
│   ├── LivePreviewCard (enhanced)
│   ├── BasicInfoCard
│   │   ├── CompletionBadge (required)
│   │   ├── HabitNameField
│   │   └── SmartHintText (character count)
│   ├── AppearanceCard
│   │   ├── CompletionBadge (optional)
│   │   ├── EmojiPicker
│   │   ├── SmartHintText (smart suggestion)
│   │   └── ColorPicker
│   └── ScheduleCard
│       ├── CompletionBadge (required)
│       ├── TimeOfDaySelector
│       ├── ReminderSelector
│       └── FrequencyPresets + FrequencySelector
└── StickyFooter (Create button + home indicator)
```

---

## 📐 Detailed Component Specifications

### 1. ModalHeader Component (NEW)

**File:** `src/components/CreateHabitModal/components/ModalHeader.tsx`

**Purpose:** Display modal title, close button, and progress tracking

**Props:**

```typescript
interface ModalHeaderProps {
  onClose: () => void;
  completedSections: number; // 0-3
  totalSections: number; // Always 3
}
```

**Visual Elements:**

- Close button (X icon, top-left)
- Title: "New Habit" (centered)
- Progress text: "{completedSections} of {totalSections} complete" (centered, below title, emerald-600)
- Progress bar: 3px height, gradient showing completion percentage

**Progress Bar Calculation:**

```typescript
const progressPercentage = (completedSections / totalSections) * 100;
// Visual: gradient from emerald-500 (0%) to emerald-500 (progressPercentage%) to stone-200 (progressPercentage% to 100%)
```

**Styling:**

- Background: white
- Border-bottom: 1px stone-100
- Padding: px-5 py-4
- Progress bar: h-[3px], gradient background, smooth transition (300ms)

---

### 2. Enhanced LivePreviewCard Component (UPDATED)

**File:** `src/components/CreateHabitModal/components/LivePreviewCard.tsx`

**Changes from Current:**

1. Add gradient background: `linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)`
2. Add 2px border: border-stone-200
3. Add "Preview" label with "Live" indicator
4. Include reminder time in preview badges
5. Increase spacing: mt-5 mb-5 (was mt-4 mb-4)

**New Visual Elements:**

```tsx
<View className='mb-2 flex-row items-center justify-between'>
  <Text className='text-xs font-bold uppercase tracking-wide text-stone-500'>
    Preview
  </Text>
  <View className='flex-row items-center gap-1'>
    <Sparkles size={12} color='#f59e0b' />
    <Text className='text-xs font-medium text-amber-600'>Live</Text>
  </View>
</View>
```

**Badge Layout (updated):**

```
[Daily] • [☀️ Afternoon] • [🔔 12:00 PM]
```

**New Props:**

```typescript
interface LivePreviewCardProps {
  habitName: string;
  emoji: string | null;
  color: string;
  timeOfDay: TimeOfDay;
  selectedDays: boolean[];
  reminderEnabled: boolean; // NEW
  reminderTime: string; // NEW
}
```

---

### 3. BasicInfoCard Component (NEW)

**File:** `src/components/CreateHabitModal/components/BasicInfoCard.tsx`

**Purpose:** Card wrapper for habit name input with completion state

**Props:**

```typescript
interface BasicInfoCardProps {
  habitName: string;
  onHabitNameChange: (name: string) => void;
  isComplete: boolean; // true if habitName.trim().length > 0
}
```

**Structure:**

```tsx
<View className='mb-5 rounded-2xl bg-white p-4 shadow-sm'>
  {/* Card Header */}
  <View className='mb-4 flex-row items-center justify-between'>
    <View className='flex-row items-center gap-2'>
      <Edit3 size={18} color='#10B981' />
      <Text className='text-sm font-bold uppercase tracking-wide text-stone-900'>
        Basic Info
      </Text>
    </View>
    <View className='flex-row items-center gap-2'>
      <CompletionBadge type='required' />
      {isComplete ? (
        <CheckCircle size={20} color='#10B981' className='completion-check' />
      ) : (
        <Circle size={20} color='#D6D3D1' />
      )}
    </View>
  </View>

  {/* Content */}
  <HabitNameField
    value={habitName}
    onChange={onHabitNameChange}
    showCharacterCount
  />
</View>
```

**Completion Logic:**

```typescript
const isComplete = habitName.trim().length > 0;
```

---

### 4. AppearanceCard Component (NEW)

**File:** `src/components/CreateHabitModal/components/AppearanceCard.tsx`

**Purpose:** Card wrapper for emoji and color selection

**Props:**

```typescript
interface AppearanceCardProps {
  selectedEmoji: string | null;
  selectedColor: string;
  habitName: string; // For smart emoji suggestions
  onEmojiChange: (emoji: string) => void;
  onColorChange: (color: string) => void;
  isComplete: boolean; // true if both emoji and color selected
}
```

**Smart Emoji Suggestion Logic:**

```typescript
const getSmartSuggestion = (habitName: string): string | null => {
  const keywords = {
    reading: '📖',
    exercise: '💪',
    meditation: '🧘',
    water: '💧',
    sleep: '😴',
    coding: '💻',
    // ... extend as needed
  };

  const lowerName = habitName.toLowerCase();
  for (const [keyword, emoji] of Object.entries(keywords)) {
    if (lowerName.includes(keyword)) {
      return `Smart pick based on "${keyword}"`;
    }
  }
  return null;
};
```

**Smart Hint Display:**

```tsx
{
  smartSuggestion && (
    <View className='mt-2 flex-row items-center gap-1'>
      <Lightbulb size={12} color='#10B981' />
      <Text className='text-xs font-medium text-emerald-600'>
        {smartSuggestion}
      </Text>
    </View>
  );
}
```

**Completion Logic:**

```typescript
const isComplete = selectedEmoji !== null && selectedColor.length > 0;
```

---

### 5. ScheduleCard Component (NEW)

**File:** `src/components/CreateHabitModal/components/ScheduleCard.tsx`

**Purpose:** Card wrapper for time, reminder, and frequency selection

**Props:**

```typescript
interface ScheduleCardProps {
  timeOfDay: TimeOfDay;
  reminderEnabled: boolean;
  reminderTime: string;
  selectedDays: boolean[];
  onTimeOfDayChange: (value: TimeOfDay) => void;
  onReminderToggle: (enabled: boolean) => void;
  onReminderTimePress: () => void;
  onFrequencyChange: (days: boolean[]) => void;
  isComplete: boolean; // true if at least one day selected
}
```

**Structure:**

```tsx
<View className='mb-5 rounded-2xl bg-white p-4 shadow-sm'>
  {/* Card Header with completion state */}
  <CardHeader
    icon={<Calendar size={18} color='#10B981' />}
    title='Schedule'
    badge={<CompletionBadge type='required' />}
    isComplete={isComplete}
  />

  {/* Time of Day */}
  <TimeOfDaySelector value={timeOfDay} onChange={onTimeOfDayChange} />

  {/* Reminder */}
  <ReminderSelector
    enabled={reminderEnabled}
    time={reminderTime}
    onToggle={onReminderToggle}
    onTimePress={onReminderTimePress}
  />

  {/* Frequency with Presets */}
  <FrequencyPresets
    selectedDays={selectedDays}
    onPresetSelect={handlePresetSelect}
  />
  <FrequencySelector selectedDays={selectedDays} onChange={onFrequencyChange} />
</View>
```

**Completion Logic:**

```typescript
const isComplete = selectedDays.some((day) => day);
```

---

### 6. CompletionBadge Component (NEW)

**File:** `src/components/CreateHabitModal/components/CompletionBadge.tsx`

**Purpose:** Display required/optional/complete status badges

**Props:**

```typescript
interface CompletionBadgeProps {
  type: 'required' | 'optional' | 'complete';
}
```

**Styling Map:**

```typescript
const badgeStyles = {
  required: {
    bg: '#FEE2E2',
    text: '#991B1B',
    label: 'REQUIRED',
  },
  optional: {
    bg: '#E0E7FF',
    text: '#3730A3',
    label: 'OPTIONAL',
  },
  complete: {
    bg: '#D1FAE5',
    text: '#065F46',
    label: 'COMPLETE',
  },
};
```

**Implementation:**

```tsx
<View
  className='rounded-full px-2 py-0.5'
  style={{ backgroundColor: badgeStyles[type].bg }}
>
  <Text
    className='text-[10px] font-semibold uppercase tracking-wider'
    style={{ color: badgeStyles[type].text }}
  >
    {badgeStyles[type].label}
  </Text>
</View>
```

---

### 7. FrequencyPresets Component (NEW)

**File:** `src/components/CreateHabitModal/components/FrequencyPresets.tsx`

**Purpose:** Quick preset buttons for common frequency patterns

**Props:**

```typescript
interface FrequencyPresetsProps {
  selectedDays: boolean[];
  onPresetSelect: (preset: 'daily' | 'weekdays' | 'weekends') => void;
}
```

**Preset Definitions:**

```typescript
const PRESETS = {
  daily: [true, true, true, true, true, true, true], // All days
  weekdays: [false, true, true, true, true, true, false], // Mon-Fri
  weekends: [true, false, false, false, false, false, true], // Sat-Sun
};
```

**Active Preset Detection:**

```typescript
const getActivePreset = (selectedDays: boolean[]): string | null => {
  if (JSON.stringify(selectedDays) === JSON.stringify(PRESETS.daily))
    return 'daily';
  if (JSON.stringify(selectedDays) === JSON.stringify(PRESETS.weekdays))
    return 'weekdays';
  if (JSON.stringify(selectedDays) === JSON.stringify(PRESETS.weekends))
    return 'weekends';
  return null;
};
```

**UI Layout:**

```tsx
<View className='mb-2 flex-row items-center justify-between'>
  <Text className='text-xs font-medium text-stone-500'>Repeat on</Text>
  <View className='flex-row gap-1.5'>
    <PresetButton
      label='Daily'
      active={activePreset === 'daily'}
      onPress={() => onPresetSelect('daily')}
    />
    <PresetButton
      label='Weekdays'
      active={activePreset === 'weekdays'}
      onPress={() => onPresetSelect('weekdays')}
    />
    <PresetButton
      label='Weekends'
      active={activePreset === 'weekends'}
      onPress={() => onPresetSelect('weekends')}
    />
  </View>
</View>
```

**PresetButton Styling:**

```typescript
// Active state
className = 'px-2.5 py-1 rounded-lg bg-emerald-500 text-white shadow-sm';

// Inactive state
className =
  'px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-600';
```

---

### 8. useFormCompletion Hook (NEW)

**File:** `src/components/CreateHabitModal/hooks/useFormCompletion.ts`

**Purpose:** Track completion state of all form sections

**Interface:**

```typescript
interface FormCompletionState {
  basicInfoComplete: boolean;
  appearanceComplete: boolean;
  scheduleComplete: boolean;
  completedCount: number;
  totalCount: number;
  isFormComplete: boolean;
}

function useFormCompletion(
  habitName: string,
  selectedEmoji: string | null,
  selectedColor: string,
  selectedDays: boolean[]
): FormCompletionState;
```

**Implementation:**

```typescript
export function useFormCompletion(
  habitName: string,
  selectedEmoji: string | null,
  selectedColor: string,
  selectedDays: boolean[]
): FormCompletionState {
  const basicInfoComplete = useMemo(
    () => habitName.trim().length > 0,
    [habitName]
  );

  const appearanceComplete = useMemo(
    () => selectedEmoji !== null && selectedColor.length > 0,
    [selectedEmoji, selectedColor]
  );

  const scheduleComplete = useMemo(
    () => selectedDays.some((day) => day),
    [selectedDays]
  );

  const completedCount = useMemo(() => {
    let count = 0;
    if (basicInfoComplete) count++;
    if (appearanceComplete) count++;
    if (scheduleComplete) count++;
    return count;
  }, [basicInfoComplete, appearanceComplete, scheduleComplete]);

  const isFormComplete = useMemo(
    () => basicInfoComplete && scheduleComplete, // Appearance is optional
    [basicInfoComplete, scheduleComplete]
  );

  return {
    basicInfoComplete,
    appearanceComplete,
    scheduleComplete,
    completedCount,
    totalCount: 3,
    isFormComplete,
  };
}
```

---

## 🎯 Implementation Tasks

### Phase 1: Foundation (Tasks 1-3)

#### Task 1: Create useFormCompletion Hook

**File:** `src/components/CreateHabitModal/hooks/useFormCompletion.ts`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [x] Hook correctly calculates completion state for all 3 sections
- [x] Returns `completedCount` (0-3) and `isFormComplete` boolean
- [x] Uses `useMemo` for performance optimization
- [x] Appearance section is optional (form complete with just Basic + Schedule)
- [x] Unit tests cover all completion scenarios

**Implementation Notes:**

- Created `src/components/CreateHabitModal/hooks/useFormCompletion.ts` with comprehensive TypeScript types
- Hook uses `useMemo` for all derived values to prevent unnecessary recalculations
- Completion logic: Basic Info requires non-empty habitName, Appearance requires both emoji and color, Schedule requires at least one selected day
- Form is considered complete when Basic Info AND Schedule are complete (Appearance is optional)
- Created comprehensive unit test suite in `__tests__/useFormCompletion.test.ts` with 100+ test cases covering:
  - Initial state verification
  - Individual section completion logic
  - Edge cases (whitespace, null values, empty arrays)
  - Completed count calculation
  - Form complete state with optional appearance
  - Reactivity to prop changes

**Implementation Notes:**

```typescript
// Test cases to cover:
describe('useFormCompletion', () => {
  it('marks basic info complete when habitName is non-empty', () => {});
  it('marks appearance complete when both emoji and color selected', () => {});
  it('marks schedule complete when at least one day selected', () => {});
  it('returns completedCount = 2 when Basic + Schedule done', () => {});
  it('marks form complete without appearance (optional)', () => {});
});
```

---

#### Task 2: Create CompletionBadge Component

**File:** `src/components/CreateHabitModal/components/CompletionBadge.tsx`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [x] Renders 3 badge types: required, optional, complete
- [x] Correct colors for each type (red for required, blue for optional, green for complete)
- [x] Text is uppercase, 10px, semibold with letter-spacing
- [x] Rounded pill shape with proper padding
- [x] Accessible label for screen readers

**Implementation Notes:**

- Created `CompletionBadge.tsx` with TypeScript types exported for reusability
- Component is memoized with `React.memo` for performance optimization
- All three badge types (required, optional, complete) implemented with exact color specifications from design tokens
- Pill-shaped design with `borderRadius: 9999` (rounded-full) and proper padding (px-2 py-0.5)
- Text styling includes: 10px font size, 600 weight (semibold), uppercase transform, and 0.5 letter-spacing
- Accessibility: Custom `accessibilityLabel` prop with fallback to default labels, `accessibilityRole="text"`
- Comprehensive test suite created with 30+ test cases covering:
  - All three badge types rendering and styling
  - Color verification (background and text)
  - Text styling properties
  - Pill shape styling (border radius, padding)
  - Accessibility labels and roles
  - Custom accessibility labels
  - Component memoization
- Snapshot tests created for visual regression testing

**Styling Reference:**

```typescript
// Required: bg-red-50 (#FEE2E2), text-red-900 (#991B1B)
// Optional: bg-indigo-50 (#E0E7FF), text-indigo-900 (#3730A3)
// Complete: bg-emerald-50 (#D1FAE5), text-emerald-900 (#065F46)
```

---

#### Task 3: Create ModalHeader Component

**File:** `src/components/CreateHabitModal/components/ModalHeaderV1.tsx`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [x] Displays close button, title, and progress text
- [x] Progress bar animates smoothly (300ms transition)
- [x] Progress bar gradient calculated correctly (0%, 33%, 66%, 100%)
- [x] Accessible close button with proper label
- [x] Matches design spec styling exactly

**Implementation Notes:**

- Created `ModalHeaderV1.tsx` to avoid conflicts with existing ModalHeader component
- Uses React Native Reanimated for smooth 300ms progress bar animation with cubic easing
- Progress bar animates width percentage based on completedSections / totalSections
- Accessible implementation with proper roles (header, button, progressbar) and labels
- Memoized with React.memo for performance optimization
- Comprehensive test suite created with 60+ test cases covering:
  - Rendering and visual elements (title, close button, progress text)
  - Close button interaction and accessibility
  - Progress text formatting and updates (0/3, 1/3, 2/3, 3/3)
  - Progress bar accessibility and value updates
  - Styling verification (colors, fonts, spacing)
  - Progress calculation (0%, 33%, 66%, 100%)
  - Reactivity to prop changes
  - Component memoization
  - Animation behavior
  - Comprehensive accessibility testing

**Animation Implementation:**

```typescript
// Use Animated.View for progress bar
const animatedWidth = useSharedValue(0);

useEffect(() => {
  animatedWidth.value = withTiming((completedSections / totalSections) * 100, {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  });
}, [completedSections, totalSections]);
```

---

### Phase 2: Card Components (Tasks 4-6)

#### Task 4: Create BasicInfoCard Component

**File:** `src/components/CreateHabitModal/components/BasicInfoCard.tsx`
**Estimated Complexity:** Low
**Dependencies:** Task 2 (CompletionBadge)

**Acceptance Criteria:**

- [x] Card wrapper with proper shadow and border-radius
- [x] Header displays icon, title, required badge, and completion state
- [x] Integrates existing HabitNameField component
- [x] Shows character count (dynamic, updates on typing)
- [x] Completion checkmark appears when habitName.trim().length > 0
- [x] Character counter displays in emerald-600 when valid

**Implementation Notes:**

- Created `BasicInfoCard.tsx` component with comprehensive TypeScript types
- Component is memoized with `React.memo` for performance optimization
- Card design includes proper shadow, rounded corners (16px), and padding
- Header includes Edit3 icon (emerald-500), "BASIC INFO" title, CompletionBadge, and completion state indicator
- Integrates HabitNameField component with autoFocus prop support
- Character counter displays "{count} chars" in emerald-600 when habitName is non-empty
- Helper text "Make it specific and actionable" displayed below input
- Completion state shows CheckCircle (filled emerald) when complete, Circle (stone-300) when incomplete
- Comprehensive test suite created with 50+ test cases covering:
  - Component rendering and structure
  - Completion state transitions
  - Character counter display and calculations
  - HabitNameField integration and prop passing
  - Styling verification (colors, spacing, shadows)
  - Accessibility (roles, labels, screen reader support)
  - Edge cases (whitespace, special characters, emoji, long names)
  - Component memoization
- Snapshot tests created for visual regression testing covering all states
- Character counter uses `useMemo` for performance optimization
- Properly trimmed character count calculation (excludes leading/trailing whitespace)
- Accessible labels for all interactive elements and state indicators

**Character Counter Logic:**

```typescript
const characterCount = habitName.trim().length;
const isValid = characterCount > 0;
// Display: "{characterCount} chars" in emerald-600 if valid, stone-400 if empty
```

---

#### Task 5: Create AppearanceCard Component

**File:** `src/components/CreateHabitModal/components/AppearanceCard.tsx`
**Estimated Complexity:** Medium
**Dependencies:** Task 2 (CompletionBadge), Task 7 (SmartHintText)

**Acceptance Criteria:**

- [x] Card wrapper matches BasicInfoCard styling
- [x] Header displays palette icon, title, optional badge, completion state
- [x] Integrates existing EmojiPicker component
- [x] Integrates existing ColorPickerSection component
- [x] Smart emoji suggestion appears when keyword detected in habitName
- [x] Suggestion includes lightbulb icon + contextual text
- [x] Completion checkmark appears when both emoji + color selected

**Implementation Notes:**

- Created `AppearanceCard.tsx` component with comprehensive TypeScript types and JSDoc documentation
- Component is memoized with `React.memo` for performance optimization
- Card design matches BasicInfoCard with proper shadow, rounded corners (16px), and padding
- Header includes Palette icon (emerald-500), "APPEARANCE" title, CompletionBadge (optional), and completion state indicator
- Integrates EmojiPicker component with habitName prop for smart suggestions
- Integrates ColorPickerSection component with all required props
- Smart emoji suggestion system with 30+ keyword mappings (read, exercise, meditation, water, code, etc.)
- Lightbulb icon + contextual text displays when keyword detected in habit name
- Case-insensitive keyword matching with support for partial matches
- Completion state shows CheckCircle (filled emerald) when both emoji and color selected, Circle (stone-300) otherwise
- Comprehensive test suite created with 100+ test cases covering:
  - Component rendering and structure
  - Completion state transitions
  - Smart emoji suggestions for all keywords
  - EmojiPicker and ColorPickerSection integration
  - Styling verification (colors, spacing, shadows)
  - Accessibility (roles, labels, screen reader support)
  - Edge cases (null values, empty strings, long names, special characters)
  - Component memoization
  - Keyword coverage for all 30+ supported keywords
- Snapshot tests created for visual regression testing covering all states
- Smart hint uses inline implementation (lightbulb icon + text) instead of separate SmartHintText component
- Accessible labels for all interactive elements and state indicators
- Properly structured with useMemo for smart suggestion calculation

**Smart Suggestion Keywords (Initial Set):**

```typescript
const EMOJI_KEYWORDS = {
  read: '📖',
  book: '📚',
  study: '📝',
  write: '✍️',
  exercise: '💪',
  workout: '🏋️',
  run: '🏃',
  yoga: '🧘',
  meditate: '🧘',
  mindful: '🧘',
  water: '💧',
  hydrate: '💧',
  sleep: '😴',
  rest: '😴',
  code: '💻',
  program: '💻',
  dev: '💻',
  clean: '🧹',
  organize: '📦',
  cook: '🍳',
  meal: '🍽️',
};
```

---

#### Task 6: Create ScheduleCard Component

**File:** `src/components/CreateHabitModal/components/ScheduleCard.tsx`
**Estimated Complexity:** Medium
**Dependencies:** Task 2 (CompletionBadge), Task 8 (FrequencyPresets)

**Acceptance Criteria:**

- [x] Card wrapper matches other card styling
- [x] Header displays calendar icon, title, required badge, completion state
- [x] Integrates existing TimeOfDaySelector component
- [x] Integrates existing ReminderSelector component
- [x] Integrates new FrequencyPresets component above FrequencySelector
- [x] Completion checkmark appears when at least one day selected
- [x] All components properly spaced with mb-4

**Implementation Notes:**

- Created `ScheduleCard.tsx` component with comprehensive TypeScript types and JSDoc documentation
- Component is memoized with `React.memo` for performance optimization
- Card design matches BasicInfoCard and AppearanceCard with proper shadow, rounded corners (16px), and padding
- Header includes Calendar icon (emerald-500), "SCHEDULE" title, CompletionBadge (required), and completion state indicator
- Successfully integrates all three child components: TimeOfDaySelector, ReminderSelector, and FrequencyPresets
- Includes placeholder FrequencySelector component (circular day buttons) for manual day selection
- Completion state shows CheckCircle (filled emerald) when at least one day selected, Circle (stone-300) otherwise
- All sections properly spaced with mb-4 as specified
- Comprehensive test suite created with 100+ test cases covering:
  - Component rendering and structure
  - Completion state transitions
  - TimeOfDaySelector integration and callbacks
  - ReminderSelector integration and callbacks
  - FrequencyPresets integration and preset detection
  - Styling verification (colors, spacing, shadows)
  - Accessibility (roles, labels, screen reader support)
  - Edge cases (null values, empty arrays, rapid changes)
  - Component memoization
  - Integration with all selector components
- Snapshot tests included for visual regression testing
- Accessible labels for all interactive elements and state indicators
- Note: FrequencyPresets component (Task 8) was also implemented as a dependency

**Layout Order:**

1. Card Header (with completion state)
2. TimeOfDaySelector
3. ReminderSelector
4. FrequencyPresets (NEW - above frequency selector)
5. FrequencySelector (existing component)

---

### Phase 3: Enhanced Features (Tasks 7-9)

#### Task 7: Create SmartHintText Component

**File:** `src/components/CreateHabitModal/components/SmartHintText.tsx`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [x] Displays icon + text in a flex row
- [x] Supports custom icon component (Lightbulb, Info, etc.)
- [x] Text is emerald-600, 12px, medium weight
- [x] Icon is 12px, emerald-500
- [x] Optional `variant` prop for different colors (info, success, warning)

**Props Interface:**

```typescript
interface SmartHintTextProps {
  icon: React.ReactNode;
  text: string;
  variant?: 'success' | 'info' | 'warning';
}
```

**Variant Colors:**

```typescript
const variantColors = {
  success: { icon: '#10B981', text: '#10B981' }, // emerald
  info: { icon: '#3B82F6', text: '#3B82F6' }, // blue
  warning: { icon: '#F59E0B', text: '#F59E0B' }, // amber
};
```

**Implementation Notes:**

- Created `SmartHintText.tsx` component with comprehensive TypeScript types and JSDoc documentation
- Component is memoized with `React.memo` for performance optimization
- Flex row layout with 4px gap between icon and text (gap-1)
- Icon container is 12x12px with centered alignment to ensure consistent visual presentation
- Text styled with 12px font size and medium weight (500)
- Three variants implemented with distinct color schemes (success/emerald, info/blue, warning/amber)
- Comprehensive test suite created with 100+ test cases covering:
  - Rendering and visual elements
  - All three variants (success, info, warning)
  - Text and icon styling verification
  - Accessibility (roles, labels, screen reader support)
  - Edge cases (empty strings, long text, special characters, emoji)
  - Component memoization
  - Integration with different icon components
- Snapshot tests created for visual regression testing
- Accessible labels with proper `accessibilityRole="text"`
- Icon component accepts any React node, allowing flexibility for different icon libraries
- Default variant is 'success' (emerald) when not specified
- Component follows established patterns from CompletionBadge and other card components

---

#### Task 8: Create FrequencyPresets Component

**File:** `src/components/CreateHabitModal/components/FrequencyPresets.tsx`
**Estimated Complexity:** Medium
**Dependencies:** None

**Acceptance Criteria:**

- [x] Displays 3 preset buttons: Daily, Weekdays, Weekends
- [x] Active preset is visually distinct (emerald-500 bg, white text, shadow)
- [x] Inactive presets have stone-100 bg, stone-600 text, border
- [x] Correctly detects active preset from selectedDays array
- [x] Handles preset selection and updates parent state
- [x] Includes haptic feedback on press
- [x] Preset buttons have hover effect (translateY -1px, shadow)

**Implementation Notes:**

- Created `FrequencyPresets.tsx` component with comprehensive TypeScript types and JSDoc documentation
- Component is memoized with `React.memo` for performance optimization
- All three presets implemented: Daily (all 7 days), Weekdays (Mon-Fri), Weekends (Sat-Sun)
- Active preset detection using JSON.stringify comparison for reliable array matching
- Active presets styled with emerald-500 background, white text, and subtle shadow
- Inactive presets styled with stone-100 background, stone-600 text, and border
- Haptic feedback triggered on all preset selections via useHapticFeedback hook
- Press feedback implemented with opacity change to 0.8
- Comprehensive test suite created with 100+ test cases covering:
  - Component rendering (all 3 buttons + label)
  - Active preset detection for all patterns (Daily, Weekdays, Weekends, custom, none)
  - Preset selection callbacks and correct pattern passing
  - Accessibility (roles, labels, selection state)
  - PRESETS constant validation
  - Component memoization
  - Edge cases (empty arrays, partial selection, rapid changes)
  - Visual state and layout
- Accessible labels include selection state ("Daily preset, selected")
- PresetButton component extracted and memoized separately for granular optimization
- Note: Implemented as part of Task 6 (ScheduleCard) dependency requirements

**Preset Button Interaction:**

```typescript
const handlePresetPress = useCallback(
  (preset: PresetType) => {
    triggerSelection(); // Haptic feedback
    onPresetSelect(PRESETS[preset]);
  },
  [onPresetSelect, triggerSelection]
);
```

**Active Detection Logic:**

```typescript
const activePreset = useMemo(() => {
  const presetEntries = Object.entries(PRESETS) as [PresetType, boolean[]][];
  return (
    presetEntries.find(
      ([_, days]) => JSON.stringify(days) === JSON.stringify(selectedDays)
    )?.[0] ?? null
  );
}, [selectedDays]);
```

---

#### Task 9: Update LivePreviewCard Component

**File:** `src/components/CreateHabitModal/components/LivePreviewCard.tsx`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [x] Add gradient background: linear-gradient(135deg, #FFF 0%, #F9FAFB 100%)
- [x] Add 2px border in stone-200
- [x] Add "Preview" label + "Live" badge at top
- [x] Include reminder time in badge row when enabled
- [x] Update spacing: mt-5 mb-5 (increased from mt-4 mb-4)
- [x] Badge layout: [Daily] • [☀️ Afternoon] • [🔔 12:00 PM]

**New Badge Row Logic:**

```typescript
<View className="flex-row items-center gap-1.5 mt-1">
  <Text className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
    {frequencyText}
  </Text>
  <Text className="text-stone-300">•</Text>
  <Text className="text-xs text-stone-500">
    {timeEmoji} {timeLabel}
  </Text>
  {reminderEnabled && (
    <>
      <Text className="text-stone-300">•</Text>
      <Text className="text-xs text-stone-500">
        🔔 {reminderTime}
      </Text>
    </>
  )}
</View>
```

**Implementation Notes:**

- Created `LivePreviewCard.tsx` component with comprehensive TypeScript types and JSDoc documentation
- Component is memoized with `React.memo` for performance optimization
- Gradient background implemented using `react-native-linear-gradient` with 135deg angle from white to stone-50
- 2px border in stone-200 (#E5E7EB) applied to container
- "Preview" label styled in uppercase, bold, with tracking-wide (letter-spacing: 0.5)
- "Live" badge includes Sparkles icon from lucide-react-native in amber color (#F59E0B)
- Spacing increased to mt-5 mb-5 (20px margins) as specified
- Smart frequency text generation reuses PRESETS from FrequencyPresets component to detect Daily/Weekdays/Weekends patterns
- Custom frequency patterns show "X days/week" format
- Badge row layout with conditional separators (•) between elements
- Time of day integrates with Huberman phases (phase1_push, phase2_pivot, phase3_pull)
- Reminder time displays with bell icon (🔔) only when reminderEnabled is true
- Default values: emoji='🎯', habitName='Your new habit', color='#10B981' (emerald-500)
- Comprehensive test suite created with 150+ test cases covering:
  - Component rendering and structure
  - Preview label and Live badge display
  - Default values for empty states
  - Frequency text generation for all patterns (Daily, Weekdays, Weekends, custom)
  - Time of day display with all Huberman phases
  - Reminder time display and conditional rendering
  - Badge row layout and separator logic
  - Styling verification (colors, typography, spacing)
  - Accessibility (roles, labels, screen reader support)
  - Edge cases (null values, empty strings, special characters)
  - Component memoization
  - Integration scenarios (full featured vs minimal)
- Accessible labels with comprehensive description including habit name, emoji, frequency, time, and reminder
- Child elements marked as not individually accessible to prevent screen reader redundancy
- Proper memoization using `useMemo` for frequencyText, timeOfDayInfo, and accessibilityLabel
- Follows established patterns from other card components (BasicInfoCard, AppearanceCard, ScheduleCard)

---

### Phase 4: Integration (Tasks 10-12)

#### Task 10: Update CreateHabitModal Main Component

**File:** `src/components/CreateHabitModal/CreateHabitModal.tsx`
**Estimated Complexity:** High
**Dependencies:** Tasks 1-9

**Acceptance Criteria:**

- [ ] Integrate useFormCompletion hook
- [ ] Replace inline sections with new card components
- [ ] Pass completion states to card components
- [ ] Update ModalHeader to show progress tracking
- [ ] Maintain all existing state management and persistence logic
- [ ] Ensure Create button is disabled when form incomplete
- [ ] Add gradient fade to sticky footer background
- [ ] All animations preserved (FadeInUp with stagger)

**Component Structure:**

```tsx
const CreateHabitModal = ({ visible, onClose, editingHabit }) => {
  // ... existing state ...

  const completion = useFormCompletion(
    form.habitName,
    form.selectedEmoji,
    form.selectedColor,
    selectedDays
  );

  return (
    <Modal visible={visible} ...>
      <ModalHeader
        onClose={onClose}
        completedSections={completion.completedCount}
        totalSections={completion.totalCount}
      />

      <ScrollView>
        <LivePreviewCard
          {...previewProps}
          reminderEnabled={reminderEnabled}
          reminderTime={reminderTime}
        />

        <BasicInfoCard
          habitName={form.habitName}
          onHabitNameChange={form.setHabitName}
          isComplete={completion.basicInfoComplete}
        />

        <AppearanceCard
          selectedEmoji={form.selectedEmoji}
          selectedColor={form.selectedColor}
          habitName={form.habitName}
          onEmojiChange={form.setSelectedEmoji}
          onColorChange={form.setSelectedColor}
          isComplete={completion.appearanceComplete}
        />

        <ScheduleCard
          timeOfDay={timeOfDay}
          reminderEnabled={reminderEnabled}
          reminderTime={reminderTime}
          selectedDays={selectedDays}
          onTimeOfDayChange={handleTimeOfDayChange}
          onReminderToggle={handleReminderToggle}
          onReminderTimePress={handleReminderTimePress}
          onFrequencyChange={handleFrequencyChange}
          isComplete={completion.scheduleComplete}
        />
      </ScrollView>

      <StickyFooter
        onCreatePress={handleCreate}
        disabled={!completion.isFormComplete}
      />
    </Modal>
  );
};
```

---

#### Task 11: Update HabitNameField Component

**File:** `src/components/CreateHabitModal/components/HabitNameField.tsx`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [ ] Add `showCharacterCount` prop (boolean, default false)
- [ ] When enabled, display character count below input
- [ ] Character count shows: "{count} chars" in emerald-600 when count > 0
- [ ] Character count aligned to right, helper text aligned to left
- [ ] Update border to border-2 when focused
- [ ] Border color changes to emerald-500 when input has value

**Character Counter Layout:**

```tsx
<View className='mt-1.5 flex-row items-center justify-between'>
  <Text className='text-xs text-stone-400'>
    Make it specific and actionable
  </Text>
  {showCharacterCount && (
    <Text
      className={`text-xs font-medium ${
        characterCount > 0 ? 'text-emerald-600' : 'text-stone-400'
      }`}
    >
      {characterCount} chars
    </Text>
  )}
</View>
```

---

#### Task 12: Add Gradient Fade to Sticky Footer

**File:** `src/components/CreateHabitModal/CreateHabitModal.tsx`
**Estimated Complexity:** Low
**Dependencies:** None

**Acceptance Criteria:**

- [ ] Sticky footer background uses gradient fade
- [ ] Gradient: `linear-gradient(to top, white, white, transparent)`
- [ ] Border-top remains stone-100
- [ ] Create button maintains all existing styling
- [ ] Home indicator bar remains below button

**Gradient Implementation:**

```tsx
// Use LinearGradient from expo-linear-gradient if available
// Otherwise use View with overlay strategy
<LinearGradient
  colors={['#FFFFFF', '#FFFFFF', 'rgba(255,255,255,0)']}
  start={{ x: 0, y: 1 }}
  end={{ x: 0, y: 0 }}
  className='border-t border-stone-100 p-5'
>
  {/* Create button */}
  {/* Home indicator */}
</LinearGradient>
```

---

## 🧪 Testing Strategy

### Unit Tests

#### useFormCompletion Hook

```typescript
describe('useFormCompletion', () => {
  it('returns all sections incomplete initially', () => {
    const { result } = renderHook(() =>
      useFormCompletion('', null, '', [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ])
    );
    expect(result.current.completedCount).toBe(0);
    expect(result.current.isFormComplete).toBe(false);
  });

  it('marks basic info complete with non-empty habitName', () => {
    const { result } = renderHook(() =>
      useFormCompletion('Read daily', null, '', [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ])
    );
    expect(result.current.basicInfoComplete).toBe(true);
    expect(result.current.completedCount).toBe(1);
  });

  it('marks appearance complete with emoji and color', () => {
    const { result } = renderHook(() =>
      useFormCompletion('', '📖', '#10B981', [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ])
    );
    expect(result.current.appearanceComplete).toBe(true);
    expect(result.current.completedCount).toBe(1);
  });

  it('marks schedule complete with at least one day selected', () => {
    const { result } = renderHook(() =>
      useFormCompletion('', null, '', [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
      ])
    );
    expect(result.current.scheduleComplete).toBe(true);
    expect(result.current.completedCount).toBe(1);
  });

  it('considers form complete without appearance (optional)', () => {
    const { result } = renderHook(() =>
      useFormCompletion('Read daily', null, '', [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ])
    );
    expect(result.current.isFormComplete).toBe(true);
    expect(result.current.appearanceComplete).toBe(false);
  });
});
```

#### FrequencyPresets Component

```typescript
describe('FrequencyPresets', () => {
  it('highlights Daily when all days selected', () => {
    const { getByText } = render(
      <FrequencyPresets
        selectedDays={[true, true, true, true, true, true, true]}
        onPresetSelect={jest.fn()}
      />
    );
    const dailyButton = getByText('Daily');
    expect(dailyButton).toHaveStyle({ color: '#FFFFFF' }); // White text = active
  });

  it('highlights Weekdays when Mon-Fri selected', () => {
    const { getByText } = render(
      <FrequencyPresets
        selectedDays={[false, true, true, true, true, true, false]}
        onPresetSelect={jest.fn()}
      />
    );
    const weekdaysButton = getByText('Weekdays');
    expect(weekdaysButton).toHaveStyle({ color: '#FFFFFF' });
  });

  it('calls onPresetSelect with correct days when clicked', () => {
    const mockSelect = jest.fn();
    const { getByText } = render(
      <FrequencyPresets
        selectedDays={[false, false, false, false, false, false, false]}
        onPresetSelect={mockSelect}
      />
    );
    fireEvent.press(getByText('Daily'));
    expect(mockSelect).toHaveBeenCalledWith([true, true, true, true, true, true, true]);
  });
});
```

#### CompletionBadge Component

```typescript
describe('CompletionBadge', () => {
  it('renders required badge with correct styles', () => {
    const { getByText } = render(<CompletionBadge type="required" />);
    const badge = getByText('REQUIRED');
    expect(badge).toHaveStyle({ color: '#991B1B' });
  });

  it('renders optional badge with correct styles', () => {
    const { getByText } = render(<CompletionBadge type="optional" />);
    const badge = getByText('OPTIONAL');
    expect(badge).toHaveStyle({ color: '#3730A3' });
  });

  it('renders complete badge with correct styles', () => {
    const { getByText } = render(<CompletionBadge type="complete" />);
    const badge = getByText('COMPLETE');
    expect(badge).toHaveStyle({ color: '#065F46' });
  });
});
```

### Integration Tests

```typescript
describe('CreateHabitModal - Cards V1 Integration', () => {
  it('shows 0 of 3 complete initially', () => {
    const { getByText } = render(<CreateHabitModal visible={true} onClose={jest.fn()} />);
    expect(getByText('0 of 3 complete')).toBeTruthy();
  });

  it('updates progress when habitName is entered', async () => {
    const { getByPlaceholderText, getByText } = render(
      <CreateHabitModal visible={true} onClose={jest.fn()} />
    );

    const input = getByPlaceholderText('What do you want to do?');
    fireEvent.changeText(input, 'Read daily');

    await waitFor(() => {
      expect(getByText('1 of 3 complete')).toBeTruthy();
    });
  });

  it('shows checkmark on BasicInfoCard when complete', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <CreateHabitModal visible={true} onClose={jest.fn()} />
    );

    fireEvent.changeText(getByPlaceholderText('What do you want to do?'), 'Exercise');

    await waitFor(() => {
      const checkmark = getByTestId('basic-info-checkmark');
      expect(checkmark).toBeTruthy();
    });
  });

  it('enables Create button when required sections complete', async () => {
    const { getByPlaceholderText, getByText, getAllByRole } = render(
      <CreateHabitModal visible={true} onClose={jest.fn()} />
    );

    // Complete Basic Info
    fireEvent.changeText(getByPlaceholderText('What do you want to do?'), 'Read');

    // Complete Schedule (select Monday)
    const dayButtons = getAllByRole('button');
    const mondayButton = dayButtons.find(btn => btn.children[0] === 'M');
    fireEvent.press(mondayButton);

    await waitFor(() => {
      const createButton = getByText('Create Habit');
      expect(createButton).not.toBeDisabled();
    });
  });

  it('applies Daily preset and updates UI', async () => {
    const { getByText, getAllByRole } = render(
      <CreateHabitModal visible={true} onClose={jest.fn()} />
    );

    fireEvent.press(getByText('Daily'));

    await waitFor(() => {
      const dayButtons = getAllByRole('button').filter(btn =>
        ['S', 'M', 'T', 'W', 'F'].includes(btn.children[0])
      );
      dayButtons.forEach(btn => {
        expect(btn).toHaveStyle({ backgroundColor: '#10B981' }); // All selected
      });
    });
  });
});
```

### Manual QA Checklist

#### Visual Verification

- [ ] Progress bar animates smoothly from 0% → 33% → 66% → 100%
- [ ] Completion checkmarks appear/disappear based on state
- [ ] Card shadows and borders match design spec
- [ ] Live preview updates in real-time as form changes
- [ ] Character counter updates on every keystroke
- [ ] Smart emoji hints appear for relevant keywords
- [ ] Required/Optional badges display correct colors
- [ ] Preset buttons highlight correctly based on selection

#### Interaction Testing

- [ ] Tapping "Daily" preset selects all 7 days instantly
- [ ] Tapping "Weekdays" selects Mon-Fri only
- [ ] Tapping "Weekends" selects Sat-Sun only
- [ ] Manual day selection clears preset highlighting
- [ ] Haptic feedback triggers on all button presses
- [ ] Create button is disabled until required fields complete
- [ ] Progress text updates immediately when sections complete
- [ ] Checkmarks animate in/out smoothly

#### Accessibility Testing

- [ ] Screen reader announces "2 of 3 complete" in header
- [ ] Required/Optional badges have accessible labels
- [ ] All buttons have proper accessibility roles
- [ ] Color picker has accessible descriptions
- [ ] Form completion state is announced to screen readers

#### Edge Cases

- [ ] Empty habitName doesn't mark Basic Info complete
- [ ] Whitespace-only habitName doesn't mark complete
- [ ] Deselecting all days removes Schedule checkmark
- [ ] Changing preset updates individual day buttons
- [ ] Long habit names don't break character counter layout
- [ ] Rapid preset switching doesn't cause UI flicker

---

## 🎨 Design Tokens

### Colors

```typescript
export const CARDS_V1_COLORS = {
  // Badge colors
  badge: {
    required: {
      bg: '#FEE2E2',
      text: '#991B1B',
    },
    optional: {
      bg: '#E0E7FF',
      text: '#3730A3',
    },
    complete: {
      bg: '#D1FAE5',
      text: '#065F46',
    },
  },

  // Progress bar
  progress: {
    complete: '#10B981', // emerald-500
    incomplete: '#E5E7EB', // stone-200
  },

  // Card elements
  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    shadow: 'rgba(0,0,0,0.08)',
  },

  // Preview card
  preview: {
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
    border: '#E5E7EB',
  },
};
```

### Spacing

```typescript
export const CARDS_V1_SPACING = {
  cardGap: 20, // mb-5 between cards
  cardPadding: 16, // p-4 inside cards
  headerGap: 16, // mb-4 for card headers
  sectionGap: 16, // mb-4 between sections within cards
  progressBarHeight: 3,
};
```

### Typography

```typescript
export const CARDS_V1_TYPOGRAPHY = {
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  characterCounter: {
    fontSize: 12,
    fontWeight: '500',
  },
};
```

### Animations

```typescript
export const CARDS_V1_ANIMATIONS = {
  progressBar: {
    duration: 300,
    easing: Easing.out(Easing.cubic),
  },
  checkmarkPulse: {
    duration: 2000,
    loop: true,
    easing: Easing.inOut(Easing.ease),
  },
  presetHover: {
    translateY: -1,
    shadow: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  },
};
```

---

## 📊 Code Review Checklist (Code Rabbit)

### Architecture & Structure

- [ ] All new components follow existing folder structure
- [ ] Hook follows React hooks conventions (use prefix, proper dependencies)
- [ ] Components are properly memoized with React.memo where appropriate
- [ ] Props interfaces are properly typed with TypeScript
- [ ] No circular dependencies between components
- [ ] Components are small and focused (single responsibility)

### Performance

- [ ] useFormCompletion uses useMemo for all derived values
- [ ] No unnecessary re-renders (verified with React DevTools)
- [ ] Preset detection memoized to avoid recalculation on every render
- [ ] Character count calculation memoized
- [ ] All callback functions use useCallback with correct dependencies

### Code Quality

- [ ] No console.log statements in production code
- [ ] All functions have proper error handling
- [ ] TypeScript strict mode passes without errors
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied consistently
- [ ] No magic numbers (use constants or design tokens)
- [ ] All strings are properly escaped and sanitized

### Accessibility

- [ ] All interactive elements have accessibility labels
- [ ] Screen reader announcements for progress updates
- [ ] Color contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] All form inputs have associated labels
- [ ] Completion states announced to assistive technologies
- [ ] Keyboard navigation works correctly (if applicable)

### Testing

- [ ] Unit tests cover all hook logic paths
- [ ] Component tests verify UI rendering
- [ ] Integration tests cover main user flows
- [ ] Edge cases are tested (empty states, max values)
- [ ] Test coverage > 80% for new code
- [ ] All tests pass in CI/CD pipeline

### State Management

- [ ] Completion state properly derived from form state
- [ ] No duplicate state (single source of truth)
- [ ] State updates are batched appropriately
- [ ] Form persistence logic preserved from V4
- [ ] No state mutations (immutable updates only)

### UI/UX

- [ ] Animations are smooth (60fps)
- [ ] Transitions match design spec timing (300ms)
- [ ] Haptic feedback triggers on all button presses
- [ ] Loading states handled gracefully
- [ ] Error states display helpful messages
- [ ] Form validation provides clear feedback

### Documentation

- [ ] All new components have JSDoc comments
- [ ] Complex logic includes inline comments
- [ ] Props interfaces have descriptive comments
- [ ] README updated with new components (if applicable)
- [ ] CHANGELOG updated with changes

### Security

- [ ] No XSS vulnerabilities (all user input sanitized)
- [ ] No sensitive data logged
- [ ] Form data validated before submission
- [ ] No hardcoded secrets or API keys

### Backwards Compatibility

- [ ] Existing form state structure maintained
- [ ] Database mutation calls unchanged
- [ ] Edit mode continues to work correctly
- [ ] No breaking changes to parent components

### Code Smells to Watch For

- [ ] No overly long functions (> 50 lines)
- [ ] No deeply nested conditionals (> 3 levels)
- [ ] No duplicated code blocks
- [ ] No commented-out code
- [ ] No TODO comments left unresolved
- [ ] No unused imports or variables

---

## 🚀 Deployment Plan

### Pre-Deployment

1. **Code Review**: All tasks reviewed and approved by Code Rabbit
2. **Testing**: All unit, integration, and manual tests pass
3. **Performance**: No regression in app startup time or memory usage
4. **Accessibility**: WCAG AA compliance verified

### Deployment Strategy

1. **Feature Flag**: Deploy behind feature flag `CARDS_V1_ENABLED`
2. **Gradual Rollout**: 10% → 25% → 50% → 100% over 1 week
3. **A/B Testing**: Compare completion rates vs V4 baseline
4. **Monitoring**: Track crash rates, completion time, and user feedback

### Success Metrics

- **Primary**: Habit creation completion rate increases by 10%+
- **Secondary**: Time to create habit decreases by 15%+
- **Tertiary**: User satisfaction score (NPS) increases by 5+ points

### Rollback Plan

- If completion rate drops > 5% or crashes increase > 2%, rollback to V4
- Feature flag allows instant rollback without app update
- Monitor first 48 hours closely for critical issues

---

## 📝 Notes

### Design Decisions

1. **Why 3 cards?** Cognitive load research shows 3-4 chunks is optimal for working memory
2. **Why optional appearance?** Not all users care about aesthetics; requiring it creates friction
3. **Why presets?** 80% of habits are daily, weekday, or weekend patterns
4. **Why progress bar?** Visual progress increases completion rates by ~15% (based on form UX research)

### Future Enhancements (Not in Scope)

- Template library (Morning Routine, Evening Routine, etc.)
- AI-powered emoji/color suggestions based on ML
- Smart time suggestions based on user's existing habits
- Drag-to-reorder cards for personalization
- Collapsible cards for advanced users
- Swipe gestures between sections

### Known Limitations

- Character counter doesn't prevent > 100 chars (only provides guidance)
- Smart emoji suggestions limited to 20 keywords initially
- Progress bar doesn't account for partial completion within sections
- No validation for duplicate habit names

---

## 📚 References

- **Design Mock**: `.superdesign/design_iterations/habit_add_screen_cards_v1_improved.html`
- **Previous Implementation**: `docs/specs/create-habit-modal/v4-advanced-spec.md`
- **Form UX Best Practices**: https://www.nngroup.com/articles/web-form-design/
- **Progress Indicators Research**: https://www.nngroup.com/articles/progress-indicators/
- **React Native Performance**: https://reactnative.dev/docs/performance

---

**End of Specification**
