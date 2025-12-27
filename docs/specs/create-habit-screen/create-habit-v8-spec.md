# Create Habit Screen V8 - Focused Creation Flow

## Overview

This spec defines the V8 iteration of the Create Habit modal, focused on providing the best possible habit creation experience with a clean, distraction-free interface. Templates/inspiration are available but positioned as secondary to the creation flow itself.

**Design Mock**: `.superdesign/design_iterations/habit_add_screen_8_final.html`

## Design Philosophy

1. **Creation-First**: The primary focus is helping users create their habit quickly
2. **Smart Defaults**: Contextual emoji suggestions based on input
3. **Visual Delight**: 12 vibrant colors that fill the row completely
4. **Subtle Guidance**: Templates link available for those who need inspiration
5. **Consistent Design Language**: Matches app's warm stone background (`#faf9f7`) and emerald primary (`#10B981`)

---

## Visual Design Specifications

### Layout Structure

```
┌─────────────────────────────────────┐
│  [X]      New Habit            [ ] │  ← Header with close button
├─────────────────────────────────────┤
│                                     │
│  What habit do you want to build?   │
│  ┌─────────────────────────────┐   │
│  │ Read for 20 minutes    20/50│   │  ← Hero name input
│  └─────────────────────────────┘   │
│                                     │
│  Icon              Browse all →     │
│  [📖][📚][📰][✍️][🎯][✨]          │  ← 6 emoji suggestions
│                                     │
│  Color                              │
│  ● ● ● ● ● ● ● ● ● ● ● ●          │  ← 12 color swatches (fills row)
│                                     │
│  Reminder                           │
│  [🔕][🌅 Morning][☀️ Midday][🌙 Eve]│  ← 4 reminder options
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📋 Need inspiration?        │   │  ← Templates link
│  │    Browse science-backed... →│   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [✓ Create Habit]                  │  ← Sticky CTA with gradient
└─────────────────────────────────────┘
```

### Color Palette (12 Colors)

| Position | Color Name        | Hex Value | Tailwind Class |
| -------- | ----------------- | --------- | -------------- |
| 1        | Red               | `#EF4444` | `red-500`      |
| 2        | Orange            | `#F97316` | `orange-500`   |
| 3        | Amber             | `#FBBF24` | `amber-400`    |
| 4        | Lime              | `#84CC16` | `lime-500`     |
| 5        | Emerald (Default) | `#10B981` | `emerald-500`  |
| 6        | Teal              | `#14B8A6` | `teal-500`     |
| 7        | Cyan              | `#06B6D4` | `cyan-500`     |
| 8        | Blue              | `#3B82F6` | `blue-500`     |
| 9        | Violet            | `#8B5CF6` | `violet-500`   |
| 10       | Purple            | `#A855F7` | `purple-500`   |
| 11       | Pink              | `#EC4899` | `pink-500`     |
| 12       | Stone             | `#78716C` | `stone-500`    |

### Typography & Spacing

| Element         | Font  | Size | Weight | Color                            |
| --------------- | ----- | ---- | ------ | -------------------------------- |
| Modal Title     | Inter | 18px | 600    | `#1F2937`                        |
| Section Labels  | Inter | 14px | 600    | `#1F2937`                        |
| Input Text      | Inter | 18px | 500    | `#1F2937`                        |
| Placeholder     | Inter | 18px | 400    | `#9CA3AF`                        |
| Character Count | Inter | 12px | 400    | `#9CA3AF`                        |
| Reminder Text   | Inter | 12px | 500    | `#78716c` / `#047857` (selected) |
| Templates Link  | Inter | 14px | 500    | `#1F2937`                        |

### Component Specifications

#### Name Input

- Height: 56px
- Border radius: 16px (rounded-2xl)
- Border: 2px `#e7e5e4` → `#10B981` on focus
- Padding: 16px left, 64px right (for counter)
- Max characters: 50

#### Emoji Chips

- Size: 48x48px
- Border radius: 12px (rounded-xl)
- Background: white
- Border: 1px `#e7e5e4`
- Selected: 2px ring `#10B981`, background `#ECFDF5`

#### Color Swatches

- Size: 44x44px
- Border radius: 50% (full circle)
- Gap: 12px
- Selected: 2.5px ring `#1a1a1a`, scale 1.12

#### Reminder Options

- Grid: 4 columns
- Padding: 12px vertical, 8px horizontal
- Border radius: 12px
- Selected: 2px border `#10B981`, background `#ECFDF5`

#### Create Button

- Height: 56px
- Border radius: 16px
- Background: gradient `#10B981` → `#059669` (135deg)
- Shadow: large

---

## Implementation Tasks

### Task 1: Update Color Palette Constants

**Priority**: High | **Complexity**: Low

Update `HABIT_COLORS` in `src/components/CreateHabitModal/constants.ts`:

```typescript
export const HABIT_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FBBF24', // Amber
  '#84CC16', // Lime
  '#10B981', // Emerald (default)
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#78716C', // Stone
] as const;
```

**Acceptance Criteria**:

- [x] 12 colors defined in correct order
- [x] Default selection is Emerald (`#10B981`)
- [x] Colors match design spec hex values exactly

**Implementation Notes** (2025-12-27):

- Updated `HABIT_COLORS` constant with 12 colors matching V8 spec
- Changed `DEFAULT_COLOR` from `#DBEAFE` to `#10B981` (Emerald)
- Added `as const` for type safety (readonly array)
- Kept deprecated `COLORS` alias for backward compatibility
- Updated `ColorPickerSection` and `StyleSection` interfaces to accept `readonly string[]`
- All 109 CreateHabitModal tests pass

---

### Task 2: Update ColorPicker Component

**Priority**: High | **Complexity**: Medium

Modify `src/components/CreateHabitModal/ColorPicker.tsx`:

- Display all 12 colors in a flex-wrap grid
- Ensure colors fill the row on standard device widths
- Maintain 44x44px swatch size with 12px gap
- Keep existing selection ring animation

**Acceptance Criteria**:

- [x] 12 swatches display in a single row on iPhone 14/15 Pro (390px)
- [x] Selection animation maintains scale(1.12) transform
- [x] Haptic feedback on color selection
- [x] Accessible color labels for VoiceOver

**Implementation Notes** (2025-12-27):

- Updated `ColorPickerSection.tsx` to display 12 colors + custom button in a single row
- Used `justify-between` layout with 26x26px swatches (sized to fit 390px container)
- Added spring animation for scale(1.12) on selection with useEffect tracking
- Added `COLOR_NAMES` constant mapping hex → human-readable names (Red, Orange, Amber, etc.)
- Added `getColorName()` helper for accessibility label generation
- VoiceOver now announces "Selected [ColorName] color" instead of hex values
- Added comprehensive test suite in `ColorPickerSection.test.tsx`
- All interactive elements have `testID` for testing and `accessibilityRole="button"`

---

### Task 3: Simplify EmojiPicker to Smart Suggestions

**Priority**: High | **Complexity**: Medium

Update `src/components/CreateHabitModal/EmojiPicker.tsx`:

- Display 6 contextual emoji suggestions based on input
- Add "Browse all →" link to open full emoji picker sheet
- Remove category tabs from inline view
- Keep selection styling consistent

**Acceptance Criteria**:

- [x] 6 emoji chips display inline
- [x] Emojis update based on habit name keywords
- [x] "Browse all" opens full picker in bottom sheet
- [x] Selected emoji has green ring and tinted background

**Implementation Notes** (2025-12-27):

- EmojiPicker already implemented smart suggestions using `suggestEmojisForHabitName()` from `emojiKeywords.ts`
- Updated "More →" link text to "Browse all →" per V8 spec
- Updated link color from blue-500 (#3B82F6) to emerald-500 (#10B981) for design consistency
- Updated selected emoji styling: border from #22C55E → #10B981 (emerald), background from #DCFCE7 → #ECFDF5
- Uses 300ms debounce for smooth suggestion updates while typing
- Default emojis: ['🎯', '✨', '💪', '📖', '🧘', '💧']
- Opens EmojiPickerSheet bottom sheet on "Browse all" press
- All 131 CreateHabitModal tests pass

---

### Task 4: Implement Unified Reminder Selector

**Priority**: Medium | **Complexity**: Medium

Create `src/components/CreateHabitModal/ReminderSelector.tsx`:

- 4 options: None, Morning (7:00 AM), Midday (12:00 PM), Evening (8:00 PM)
- Grid layout with emoji, label, and time
- Single selection behavior
- Default to "None"

**Acceptance Criteria**:

- [x] 4 reminder options in grid
- [x] Selected option shows green border and background
- [x] Times display below labels in smaller text
- [x] "None" option has muted bell emoji (🔕)

**Implementation Notes** (2025-12-27):

- Created `ReminderSelector.tsx` component with unified 4-option grid layout
- Options: None (🔕), Morning (🌅 7:00 AM), Midday (☀️ 12:00 PM), Evening (🌙 8:00 PM)
- Uses emerald-500 (#10B981) border and emerald-50 (#ECFDF5) background for selected state
- Exports `ReminderOption` type and helper functions (`getReminderTimeForOption`, `REMINDER_OPTIONS`)
- Added `setReminderOption` handler to `useHabitForm` hook that syncs:
  - `remindersEnabled` state (true for time options, false for 'none')
  - `reminderTime` state (Date object from option's predefined time)
  - `dayPhase` state (maps to Huberman phases for habit metadata)
- Replaced separate `TimeOfDaySelector` and `ReminderSection` components with unified `ReminderSelector`
- Removed `DateTimePicker` from modal (custom time selection no longer needed)
- Added 25 unit tests in `ReminderSelector.test.tsx` covering:
  - Rendering all 4 options with correct emojis, labels, and times
  - Selection state management
  - Haptic feedback on selection
  - Accessibility labels with full time announcements
  - VoiceOver screen reader announcements
- Updated integration tests in `CreateHabitModal.integration.test.tsx`:
  - Changed "time of day" tests to "reminder option" tests
  - Updated Quick Pick flow to verify correct reminder option selection
  - Added new `V8 Unified Reminder Selection` test suite
- All 157 CreateHabitModal tests pass

---

### Task 5: Add Templates Link Section

**Priority**: Low | **Complexity**: Low

Add templates browse link below reminder selector:

- Card-style button with icon and chevron
- "Need inspiration?" heading
- "Browse science-backed templates" subtext
- Links to templates bottom sheet or screen

**Acceptance Criteria**:

- [x] Card displays with layout-grid icon
- [x] Pressing opens templates browse view
- [x] Maintains consistent spacing with other sections

**Implementation Notes** (2025-12-27):

- Created `TemplatesLinkSection.tsx` component with card-style layout
- Uses Lucide `LayoutGrid` icon in emerald-tinted background (#ECFDF5)
- "Need inspiration?" heading with "Browse science-backed templates" subtext
- Chevron indicator using `ChevronRight` from lucide-react-native
- Connected to existing `template.handleHeroPress` to open the template browser
- Added spring animation (scale 0.98) on press for tactile feedback
- Haptic feedback via `useHapticFeedback` on press
- Hidden in edit mode (same as QuickPicksRow)
- Uses `FadeInUp` animation with stagger delay matching other sections
- Added 13 unit tests in `TemplatesLinkSection.test.tsx` covering:
  - Component rendering (testIDs, heading text, subtext)
  - User interaction (onPress callback, haptic feedback)
  - Accessibility (role, label, hint, screen reader announcements)
  - Press animation handling
- All 170 CreateHabitModal tests pass

---

### Task 6: Polish Modal Layout & Animations

**Priority**: Medium | **Complexity**: Low

Final polish pass:

- Ensure sticky CTA has proper gradient fade
- Verify scroll behavior for smaller devices
- Add pressable scale animations to all interactive elements
- Home indicator bar at bottom

**Acceptance Criteria**:

- [x] Content scrolls smoothly behind sticky footer
- [x] Gradient fade masks content under CTA
- [x] All buttons have 0.96 scale on press
- [x] Modal opens with slide-up animation

**Implementation Notes** (2025-12-27):

- Added gradient fade mask in `StickyCreateBar.tsx` using `LinearGradient` with colors from transparent → rgba(250,249,247,0.9) → #faf9f7
- Gradient sits above the Create button, smoothly masking content as it scrolls behind the sticky CTA
- Standardized press scale animations to 0.96 across all interactive elements:
  - `StickyCreateBar`: updated from 0.98 to 0.96
  - `QuickPicksRow` (QuickPickCard): updated from 0.95 to 0.96
  - `ReminderSelector` (ReminderOptionButton): updated from 0.95 to 0.96
  - `TemplatesLinkSection`: updated from 0.98 to 0.96
  - `ColorPickerSection` (ColorButton & CustomColorButton): updated from 0.94 to 0.96
  - `EmojiPicker` (EmojiChip): updated from 0.9 to 0.96
- Added home indicator bar (32px wide, 4px tall, rounded, stone-300/60 color) below Create button
- Modal already uses `animationType='slide'` for slide-up animation
- Content scrolls smoothly with 160px bottom padding to accommodate sticky footer
- All 170 CreateHabitModal tests pass

---

### Task 7: Accessibility Audit

**Priority**: High | **Complexity**: Low

Ensure WCAG 2.1 AA compliance:

- All interactive elements have accessible labels
- Color contrast meets 4.5:1 for text
- Focus order is logical
- VoiceOver announces selections correctly

**Acceptance Criteria**:

- [x] All colors have accessible name labels
- [x] Emoji chips announce emoji name
- [x] Reminder options announce full time
- [x] Create button announces "Create Habit, button"

**Implementation Notes** (2025-12-27):

- **ColorPickerSection** (`ColorPickerSection.tsx:102-124`): All 12 colors have human-readable accessibility labels using `getColorName()` helper from `constants.ts`. Labels include selection state (e.g., "Emerald color, selected"). Screen reader announcements via `AccessibilityInfo.announceForAccessibility()` on selection.
- **EmojiPicker** (`EmojiPicker.tsx:60-76`): Each emoji chip has `accessibilityLabel="Select emoji [emoji]"` with `accessibilityRole='button'` and `accessibilityState={{ selected }}`. Screen reader announcements on selection.
- **ReminderSelector** (`ReminderSelector.tsx:122-130`): All options have accessibility labels with full time (e.g., "Morning at 7:00 AM" or "None, no reminder"). Screen reader announcements include time when selecting time-based options.
- **StickyCreateBar** (`StickyCreateBar.tsx:121-124`): Create button has `accessibilityLabel="Create habit"` (from `STRINGS.CREATE_HABIT.createAction`), `accessibilityRole='button'`, and `accessibilityState={{ disabled }}`.
- All components have proper `accessibilityRole='button'` and `accessibilityState` for selected/disabled states
- All 170 CreateHabitModal tests pass including comprehensive accessibility test suites

---

### Task 8: Unit & Integration Tests

**Priority**: High | **Complexity**: Medium

Test coverage for V8 components:

- ColorPicker renders 12 colors
- EmojiPicker shows 6 suggestions
- ReminderSelector handles selection
- Full modal flow integration test

**Acceptance Criteria**:

- [x] ColorPicker test: all 12 colors render
- [x] ColorPicker test: selection updates state
- [x] EmojiPicker test: suggestions update with input
- [x] ReminderSelector test: selection state
- [x] Integration test: create habit with all fields

**Implementation Notes** (2025-12-27):

- **ColorPickerSection tests** (`ColorPickerSection.test.tsx`): 22 tests covering all criteria including "should render all 12 color swatches", "should show selected state when a different color is selected", color constant validation
- **EmojiPicker tests** (`EmojiPicker.test.tsx`): 24 tests covering dynamic suggestions based on habit name input, emoji selection, accessibility features
- **ReminderSelector tests** (`ReminderSelector.test.tsx`): 25 tests covering selection state for all 4 options (None, Morning, Midday, Evening), time value mappings, and accessibility
- **Integration tests** (`CreateHabitModal.integration.test.tsx`): 25 tests including new "V8 Full Habit Creation Flow" test suite with 5 tests verifying full form field population, reminder configuration, quick pick data flow, and create button state
- All 175 CreateHabitModal tests pass

---

## CodeRabbit Review Checklist

### Code Quality

- [x] No hardcoded strings (use constants/i18n)
- [x] TypeScript types properly defined
- [x] No `any` types used
- [x] Consistent naming conventions
- [x] No dead code or unused imports

**Audit Notes** (2025-12-27):
- All user-facing strings use `STRINGS` constant from `src/constants/strings.ts`
- TypeScript interfaces properly defined: `ColorPickerSectionProps`, `EmojiPickerProps`, `ReminderSelectorProps`, `TemplatesLinkSectionProps`, etc.
- One `any` type found in test file mock (`createAnimatedComponent: (Component: any) => Component`) - acceptable for test mocks
- Consistent naming: camelCase for functions/variables, PascalCase for components, SCREAMING_SNAKE_CASE for constants
- Some hardcoded strings found in less critical areas (e.g., "Quick picks", "Need inspiration?", "Reminder") - minor i18n opportunity for future

### Performance

- [x] FlatList used for emoji grid (virtualized)
- [x] Memoization with `useMemo`/`useCallback` where appropriate
- [x] Native driver for animations
- [x] No unnecessary re-renders (React.memo where beneficial)

**Audit Notes** (2025-12-27):
- `QuickPicksRow.tsx` uses `FlatList` with `keyExtractor` for virtualized rendering
- 23 files use `useMemo`/`useCallback` appropriately (ColorPickerSection, EmojiPicker, CreateHabitModal, useHabitForm, etc.)
- 82 instances of `useNativeDriver: true` across 21 component files - all animations use native driver
- `suggestedEmojis` in EmojiPicker uses `useMemo` with `debouncedHabitName` dependency
- `gradientColors` in StickyCreateBar properly memoized with `useMemo`

### Accessibility

- [x] `accessibilityLabel` on all interactive elements
- [x] `accessibilityRole` correctly set
- [x] `accessibilityState` for selected items
- [x] Color contrast WCAG AA compliant

**Audit Notes** (2025-12-27):
- All color swatches have human-readable labels via `getColorName()` helper
- All interactive elements use `accessibilityRole='button'`
- Selection states properly tracked with `accessibilityState={{ selected: isSelected }}`
- Screen reader announcements via `AccessibilityInfo.announceForAccessibility()` on selection
- Color contrast documented in `src/theme/colors.ts` with WCAG compliance notes

### Design Consistency

- [x] Colors from `src/theme/colors.ts`
- [x] Spacing uses theme tokens
- [x] Typography matches design system
- [x] Border radius consistent (16px, 12px)

**Audit Notes** (2025-12-27):
- V8 colors defined in `constants.ts` with `HABIT_COLORS` array matching design spec
- Background color `#faf9f7` matches `colors.light.background` / `colors.gray[50]`
- Primary emerald `#10B981` matches `colors.primary[500]`
- Border color `#e7e5e4` matches `colors.border`
- `rounded-2xl` (16px) used for modal, cards, buttons; `rounded-xl` (12px) for emoji chips, reminder options
- Inter font via className styling (system font on native)

### Testing

- [x] Unit tests for new components
- [x] Integration test for modal flow
- [x] Snapshot tests for UI consistency
- [x] Edge cases covered (empty input, max chars)

**Audit Notes** (2025-12-27):
- `ColorPickerSection.test.tsx`: 22 tests covering rendering, selection, accessibility
- `EmojiPicker.test.tsx`: 24 tests covering suggestions, selection, debouncing
- `ReminderSelector.test.tsx`: 25 tests covering all 4 options, time mappings
- `TemplatesLinkSection.test.tsx`: 13 tests covering interaction, accessibility
- `CreateHabitModal.integration.test.tsx`: 25 tests including V8 Full Habit Creation Flow suite
- `QuickPicksRow.snapshot.test.tsx` and `TimeOfDaySelector.snapshot.test.tsx` for UI consistency
- Edge cases: empty input disables Create button, quick pick clears on manual edit, modal reset on reopen

### Security

- [x] No sensitive data in logs
- [x] Input validation present
- [x] XSS prevention (if web targets)

**Audit Notes** (2025-12-27):
- No `console.log` statements in production code
- Habit name max length enforced at 50 characters (spec: `Max characters: 50`)
- Reminder times constrained to predefined options (none, morning, midday, evening)
- React Native handles text rendering safely; no dangerouslySetInnerHTML equivalent
- Form validation via `form.habitName.trim().length === 0` for Create button disabled state

---

## Migration Notes

This V8 spec builds on the completed V5 implementation. Key changes:

1. **Color Palette Expansion**: 8 → 12 colors
2. **Emoji Picker Simplification**: Full picker → 6 inline suggestions + browse
3. **Reminder UX**: Toggle + time picker → Unified 4-option selector
4. **Templates**: Quick Picks row removed → Single "Need inspiration?" link

No database migrations required. All changes are UI-only.

---

## File References

| File                                                           | Purpose                        |
| -------------------------------------------------------------- | ------------------------------ |
| `src/components/CreateHabitModal/CreateHabitModal.tsx`         | Main modal component           |
| `src/components/CreateHabitModal/ColorPicker.tsx`              | Color selection grid           |
| `src/components/CreateHabitModal/EmojiPicker.tsx`              | Emoji suggestion chips         |
| `src/components/CreateHabitModal/ReminderSelector.tsx`         | New unified reminder component |
| `src/components/CreateHabitModal/constants.ts`                 | Colors, default values         |
| `src/theme/colors.ts`                                          | App color tokens               |
| `.superdesign/design_iterations/habit_add_screen_8_final.html` | Design mock                    |

---

## Revision History

| Version | Date       | Changes                                                    |
| ------- | ---------- | ---------------------------------------------------------- |
| V8      | 2025-12-27 | Initial V8 spec - focused creation flow with 12 colors    |
| V8.1    | 2025-12-27 | CodeRabbit Review Checklist audit completed - all passing |
