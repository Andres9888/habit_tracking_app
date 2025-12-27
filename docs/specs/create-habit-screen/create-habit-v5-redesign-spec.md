# Create Habit Screen V5 Redesign

## Overview

A simplified, streamlined habit creation experience that reduces friction and helps users create habits faster through quick templates and smart suggestions.

## Design Reference

- **Mock**: `.superdesign/design_iterations/habit_add_screen_5.html`
- **Previous versions**: V1-V4 in same directory for iteration history

## Goals

1. **Reduce time to create a habit** - One-tap templates for common habits
2. **Remove clutter** - No advanced options, no heavy template browser
3. **Smart defaults** - Auto-suggest emojis and colors based on habit name
4. **Delightful UX** - Smooth animations, live preview, clear feedback

## Current State (Problems)

- `CreateHabitModalV2` has inline emoji input that's confusing
- `CreateHabitModal` has too many sections (TemplateBrowser, PhaseSelector, NameSuggestions)
- CollapsibleAdvancedOptions hides useful features
- No quick template selection for common habits

---

## Proposed Design

### Layout Structure

```
┌─────────────────────────────────────┐
│  ✕              New Habit           │  Header
├─────────────────────────────────────┤
│  Quick picks              Browse →  │
│  [🧘 Meditate] [📖 Read] [💪 Ex...]│  Horizontal scroll
├─────────────────────────────────────┤
│        ─── or create your own ───   │  Divider
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ 📖  Read                    │    │  Live Preview Card
│  │      Daily • ☀️ Afternoon   │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  [Enter habit name...        4/50]  │  Name Input
├─────────────────────────────────────┤
│  Icon                       More →  │
│  [📖] [📚] [📰] [✍️] [🎯] [✨]      │  Smart emoji suggestions
├─────────────────────────────────────┤
│  Color                              │
│  ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ [+]         │  10 colors + custom
├─────────────────────────────────────┤
│  When                               │
│  [🌅 Morning] [☀️ Afternoon] [🌙]  │  Time of day
├─────────────────────────────────────┤
│  🔔 Remind me              [12 PM]  │  Toggle + time
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │  ✓  Create Habit            │    │  Sticky CTA (green gradient)
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Components

#### 1. Quick Picks Row (NEW)
- Horizontal scrolling template cards
- 5 pre-built templates: Meditate, Read, Exercise, Hydrate, Journal
- Each card shows: emoji, name, timing
- Tapping auto-fills all fields
- "Browse all" link opens full templates screen

#### 2. Live Preview Card
- Shows habit as it will appear in the list
- Updates in real-time as user types/selects
- Gradient border matching selected color
- Subtle pulse animation on icon

#### 3. Name Input
- Simple text input with character count (50 max)
- No floating label, just placeholder
- Auto-focus on modal open

#### 4. Smart Emoji Suggestions
- 6 emoji chips based on habit name
- Updates dynamically as user types
- "More →" link opens full emoji picker
- Selected state with green ring

#### 5. Color Picker
- 10 curated colors + custom picker button
- Larger swatches (36px) with good spacing
- Selected state: scale up + border ring

#### 6. Time of Day Selector
- Three options: Morning, Afternoon, Evening
- Each shows emoji + label
- Auto-sets reminder time based on selection

#### 7. Reminder Toggle
- Compact row with bell icon
- Shows selected time
- Toggle switch on right

#### 8. Sticky Create Button
- Green gradient matching selected color
- Check icon + "Create Habit" text
- Disabled state when name is empty

## Removed Features

These are intentionally removed from V5:
- TemplateBrowser (replaced with Quick Picks)
- PhaseSelector (advanced option, not needed)
- NameSuggestions (replaced with Quick Picks)
- HabitPreview week dots (too complex)
- CollapsibleAdvancedOptions wrapper
- Frequency day selector (default to daily)

---

## Technical Implementation

### Files to Modify

1. `src/components/CreateHabitModal/CreateHabitModal.tsx` - Main component rewrite
2. `src/components/CreateHabitModal/index.ts` - Ensure default export is correct
3. New: `src/components/CreateHabitModal/components/QuickPicksRow.tsx`
4. Modify: `src/components/CreateHabitModal/components/ColorPickerSection.tsx` - Simplify
5. Modify: `src/components/CreateHabitModal/components/EmojiPicker.tsx` - Smart suggestions
6. New: `src/components/CreateHabitModal/components/TimeOfDaySelector.tsx`
7. Modify: `src/components/CreateHabitModal/components/ReminderSection.tsx` - Compact version

### State Management

Use existing `useCreateHabitModal` hook with these additions:
- `selectedTemplate: Template | null`
- Auto-populate form when template selected
- Clear template selection when user modifies fields

### Animations

- Fade-in-up for sections on mount
- Scale bounce on color/emoji selection
- Pulse ring on live preview icon
- Smooth scroll for template row

---

## Implementation Tasks

### Phase 1: Foundation

#### Task 1.1: Clean up CreateHabitModal
- [x] Remove TemplateBrowser import and usage
- [x] Remove PhaseSelector import and usage
- [x] Remove NameSuggestions import and usage
- [x] Remove CollapsibleAdvancedOptions wrapper (already done - verified not used)
- [x] Update index.ts to export CreateHabitModal as default (already done - verified)

> **Completed by Maestro Agent**: Removed TemplateBrowser, PhaseSelector, and NameSuggestions components from CreateHabitModal.tsx. The component now has a cleaner structure with only HabitPreview, HabitNameField, EmojiPicker, ColorPickerSection, and ReminderSection.

#### Task 1.2: Simplify Live Preview
- [x] Remove week dots preview
- [x] Add gradient border matching selected color
- [x] Add pulse ring animation on emoji icon
- [x] Compact layout (smaller padding)
- [x] Show time of day instead of frequency label

> **Completed by Maestro Agent**: Simplified HabitPreview component by removing week dots, adding colored border that matches selected color, implementing pulse ring animation behind emoji icon, reducing padding from p-4 to p-3 (and other compact adjustments), and displaying time of day (Phase 1: Push, Phase 2: Pivot, Phase 3: Pull) instead of frequency. Updated CreateHabitModal to pass `dayPhase` as `timeOfDay` prop.

---

### Phase 2: New Components

#### Task 2.1: Create QuickPicksRow component
- [x] Create `src/components/CreateHabitModal/components/QuickPicksRow.tsx`
- [x] Horizontal FlatList with 5 template cards
- [x] Each card: emoji icon (gradient bg), name, timing subtitle
- [x] Selected state with green border
- [x] "Browse all →" link
- [x] onSelect callback to parent
- [x] Haptic feedback on selection

> **Completed by Maestro Agent**: Created QuickPicksRow component with 5 pre-built templates (Meditate, Read, Exercise, Hydrate, Journal). Each template card shows emoji with colored background, name, and timing based on Huberman phases. Implemented selected state with green border, spring scale animations on press, haptic feedback on selection, and optional "Browse all →" link. Integrated into CreateHabitModal with handlers that auto-populate the form fields (name, emoji, color, timeOfDay) when a quick pick is selected, and clear the selection when user manually modifies any field. Added "or create your own" divider between quick picks and the form.

#### Task 2.2: Create TimeOfDaySelector component
- [x] Create `src/components/CreateHabitModal/components/TimeOfDaySelector.tsx`
- [x] Three buttons: Morning (🌅), Afternoon (☀️), Evening (🌙)
- [x] Selected state with green background/border
- [x] Returns time range for reminder auto-set
- [x] Haptic feedback on selection

> **Completed by Maestro Agent**: Created TimeOfDaySelector component using the existing Huberman phase system (Push/Pivot/Pull). Component features three buttons with icons (🌅, ☀️, 🌙) and labels, spring scale animations on press, green background/border when selected, and haptic feedback. Added `getReminderTimeForPhase()` utility that maps phases to default reminder times (7 AM, 12 PM, 8 PM). Integrated into CreateHabitModal with auto-reminder time setting when phase is selected. Also clears quick pick selection when user manually changes time of day.

#### Task 2.3: Update EmojiPicker for smart suggestions
- [x] Show 6 emoji chips inline (no modal trigger by default)
- [x] Dynamic suggestions based on habit name
- [x] "More →" link opens full EmojiPickerSheet
- [x] Selected state with green ring
- [x] Smooth animation when suggestions change

> **Completed by Maestro Agent**: Updated EmojiPicker component to display 6 inline emoji chips with smart suggestions based on habit name using `suggestEmojisForHabitName()` utility. Added debounced suggestion updates (300ms) for smooth transitions when typing. Implemented "More →" link that opens full EmojiPickerSheet. Selected emoji shows green ring (border-[#22C55E] bg-[#DCFCE7]). Added Reanimated FadeIn/FadeOut and LinearTransition animations for smooth chip transitions. Created comprehensive unit tests covering all functionality including accessibility and debounce behavior.

---

### Phase 3: Update Existing Components

#### Task 3.1: Simplify ColorPickerSection
- [x] Reduce to 10 curated colors
- [x] Larger swatches (w-9 h-9 → w-11 h-11)
- [x] Simpler custom color button (dashed border + icon)
- [x] Remove "Custom color" text row

> **Completed by Maestro Agent**: Simplified ColorPickerSection component for V5 redesign. Reduced COLORS array from 24 colors to 10 curated colors (Red, Orange, Yellow, Green, Teal, Blue, Purple, Pink, Stone, Slate). Increased swatch size from h-10 w-10 to h-11 w-11 for better touch targets. Replaced the full-width "Custom color" button row with a minimal dashed-border circular button with a Plus icon, positioned inline with the color swatches. Maintains all existing functionality including haptic feedback and press animations.

#### Task 3.2: Compact ReminderSection
- [x] Single row layout
- [x] Bell icon in colored circle
- [x] "Remind me" label with time below
- [x] Toggle on right side
- [x] Remove quick time buttons (time set by TimeOfDay)

> **Completed by Maestro Agent**: Redesigned ReminderSection as a compact single-row layout. Features a bell emoji (🔔) in a colored circle (green when enabled, gray when disabled), "Remind me" label with formatted time displayed below, and toggle switch positioned on right. Removed quick time buttons (Morning 8:00, Afternoon 1:00, etc.), sound selection row, and reminderSound/onQuickTimeSelect props since time is now set via TimeOfDaySelector. The time text is tappable when reminders are enabled, opening the time picker. Updated CreateHabitModal to pass only the required props. Added accessibility labels and states to all interactive elements.

#### Task 3.3: Update StickyCreateBar
- [x] Green gradient background (matches selected color)
- [x] Check icon before text
- [x] Smooth color transition animation

> **Completed by Maestro Agent**: Updated StickyCreateBar component with green gradient background using LinearGradient from expo-linear-gradient. Added `selectedColor` optional prop to allow the button to match the habit's selected color. Implemented `darkenColor()` utility function to create gradient from lighter to darker shade of the selected color. Added Check icon from lucide-react-native before the button text. Implemented smooth color transition animation using Animated opacity that triggers on color changes. When disabled, shows gray gradient instead. Updated CreateHabitModal to pass `form.selectedColor` to StickyCreateBar.

---

### Phase 4: Integration

#### Task 4.1: Wire up QuickPicksRow
- [x] Add template data (5 default templates)
- [x] On template select: populate name, emoji, color, timeOfDay
- [x] Clear template selection when user modifies any field
- [x] Scroll to form section after selection

> **Completed by Maestro Agent**: All QuickPicksRow wiring was already implemented in earlier work (template data, auto-populate on select, clear selection on manual field changes). Added the final missing feature: scroll to form section after quick pick selection. Implemented using a ScrollView ref with animated scroll to QUICK_PICKS_SECTION_HEIGHT (180px) after a 100ms delay for smoother UX.

#### Task 4.2: Connect TimeOfDaySelector to reminder
- [x] Morning → 7:00 AM
- [x] Afternoon → 12:00 PM
- [x] Evening → 8:00 PM
- [x] Auto-enable reminder when time selected

> **Completed by Maestro Agent**: Connected TimeOfDaySelector to reminders. The time mappings were already implemented in TimeOfDaySelector.tsx (phase1_push→7AM, phase2_pivot→12PM, phase3_pull→8PM). Added auto-enable reminder functionality: when a user selects a time of day (Morning/Afternoon/Evening), reminders are now automatically enabled with the appropriate default time. Also updated handleQuickPickSelect to auto-enable reminders when a quick pick template is selected, ensuring consistent UX.

#### Task 4.3: Assemble final layout
- [x] Order: QuickPicks → Divider → Preview → Input → Emoji → Color → TimeOfDay → Reminder
- [x] Add "or create your own" divider
- [x] Proper spacing between sections
- [x] Fade-in-up animations on mount

> **Completed by Maestro Agent**: Verified and finalized the layout order matching the V5 spec exactly. The "or create your own" divider was already present between QuickPicks and the form. Proper spacing is maintained across all sections with consistent `mb-4`/`mb-6` margins. Added staggered fade-in-up animations using React Native Reanimated's `FadeInUp` with 50ms stagger delay between sections and 300ms duration for smooth cascading entrance animations on mount.

---

### Phase 5: Polish & Testing

#### Task 5.1: Animation polish
- [x] Staggered fade-in for sections
- [x] Scale bounce on selections
- [x] Smooth color transitions
- [x] Native driver for all animations

> **Completed by Maestro Agent**: Verified all animation requirements are already implemented:
> - **Staggered fade-in**: CreateHabitModal.tsx uses FadeInUp with 50ms stagger delay between sections
> - **Scale bounce on selections**: QuickPicksRow (spring 0.95→1), TimeOfDaySelector (spring 0.95→1), ColorPickerSection (timing 0.94→1), EmojiPicker (Reanimated sequence 0.9→1.1→1), StickyCreateBar (timing 0.98→1), HabitPreview (spring bounce on content changes)
> - **Smooth color transitions**: StickyCreateBar has opacity animation sequence (0.85→1) triggered on color change
> - **Native driver**: All RN Animated components use `useNativeDriver: true`; Reanimated animations run on UI thread by default

#### Task 5.2: Accessibility
- [ ] accessibilityLabel on all buttons
- [ ] accessibilityRole on interactive elements
- [ ] Announce selection changes
- [ ] Test with VoiceOver

#### Task 5.3: Testing
- [ ] Unit tests for QuickPicksRow
- [ ] Unit tests for TimeOfDaySelector
- [ ] Integration test for template → form flow
- [ ] Snapshot tests for visual regression

#### Task 5.4: CodeRabbit Review
- [ ] Run through CodeRabbit checklist below
- [ ] Address any linting issues
- [ ] Verify TypeScript types
- [ ] Performance profiling

---

## Acceptance Criteria

- [ ] Quick Picks row displays 5 templates with horizontal scroll
- [ ] Tapping a template auto-fills name, emoji, color, and time
- [ ] Live preview updates in real-time
- [ ] Smart emoji suggestions update based on habit name
- [ ] Color picker shows 10 colors + custom option
- [ ] Time of day selector sets appropriate reminder time
- [ ] Create button disabled when name is empty
- [ ] No CollapsibleAdvancedOptions or PhaseSelector visible
- [ ] Modal opens quickly without jank
- [ ] All existing habit creation functionality still works

---

## CodeRabbit Review Checklist

### Accessibility
- [ ] All interactive elements have proper accessibility labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus order is logical

### Performance
- [ ] No unnecessary re-renders on typing
- [ ] Template row uses FlatList for virtualization
- [ ] Animations use native driver

### Code Quality
- [ ] No unused imports or dead code
- [ ] Consistent naming conventions
- [ ] Proper TypeScript types (no `any`)

### Testing
- [ ] Unit tests for QuickPicksRow component
- [ ] Unit tests for TimeOfDaySelector component
- [ ] Integration test for template selection flow

### UX
- [ ] Haptic feedback on selections
- [ ] Loading states handled gracefully
- [ ] Error states for edge cases

### Design
- [ ] Matches V5 mock exactly
- [ ] Responsive on different screen sizes
- [ ] Dark mode support (if applicable)

---

## Completion Criteria

All tasks marked complete and:
1. Modal matches V5 mock design
2. Quick Picks templates work correctly
3. Smart emoji suggestions update on typing
4. All CodeRabbit review items verified
5. No regression in existing functionality

---

## Out of Scope

- Full templates screen redesign (separate spec)
- Habit editing flow changes
- Backend/API changes
- Analytics tracking
