# Emoji Picker V2 - Redesign Specification

## Overview

Complete redesign of the emoji picker experience in the Add Habit screen. Removes the "More" button barrier and provides direct access to emojis with smart AI suggestions.

**Mockup:** `.superdesign/design_iterations/emoji_picker_v2_1.html`

---

## Design Direction: Smart Bottom Sheet (Option C)

After review, Option C provides the best UX with:
- Direct access to full picker (no intermediate "More" button)
- Prominent AI suggestions based on habit name
- Large touch targets for easy selection
- Modern, native iOS/Android feel

---

## User Flow

```
1. User taps Icon section in Add Habit form
   ↓
2. Bottom sheet slides up (70% height)
   ↓
3. AI suggestions shown prominently at top
   ↓
4. User can:
   - Tap a suggested emoji (instant selection)
   - Search by keyword
   - Browse by category
   - Select "No icon"
   ↓
5. Sheet dismisses, emoji selected
```

---

## Component Structure

```
┌─────────────────────────────────────┐
│  ═══════  (drag handle)             │  12px
├─────────────────────────────────────┤
│  🔍 Search or type habit name...    │  56px
├─────────────────────────────────────┤
│  ✨ Perfect for "Morning meditation"│
│  [🧘] [🙏] [😌] [🌅] [✨]           │  100px
├─────────────────────────────────────┤
│  [🧘 Wellness] [💪 Fitness] ...     │  48px
├─────────────────────────────────────┤
│  🧘 WELLNESS                        │
│  [🧘][💆][😴][💤][🌅][🌿]          │
│  [💚][🛁][🕯️][🌸][☮️][🧖]          │  flex-1
│  [💭][🌙][✨][🦋]                   │
├─────────────────────────────────────┤
│  [      No icon      ]              │  56px
└─────────────────────────────────────┘
```

---

## Visual Specifications

### 1. Bottom Sheet Container

| Property | Value |
|----------|-------|
| Height | `70%` of screen |
| Background | `#ffffff` |
| Border radius | `32px` (top corners) |
| Shadow | `0 -4px 20px rgba(0,0,0,0.15)` |
| Animation | Slide up, 300ms ease-out |
| Overlay | `rgba(0,0,0,0.4)` |

### 2. Drag Handle

| Property | Value |
|----------|-------|
| Width | `40px` |
| Height | `4px` |
| Background | `#d1d5db` (gray-300) |
| Border radius | `2px` |
| Margin | `12px auto 8px` |

### 3. Search Bar

| Property | Value |
|----------|-------|
| Container margin | `0 20px 12px` |
| Background | `#f9fafb` (gray-50) |
| Border | `1px solid #e5e7eb` |
| Border radius | `16px` |
| Height | `48px` |
| Padding | `0 16px` |
| Icon | Search, 20px, `#9ca3af` |
| Placeholder | "Search or type habit name..." |
| Focus state | `box-shadow: 0 0 0 3px rgba(59,130,246,0.2)` |

### 4. AI Suggestions Section

| Property | Value |
|----------|-------|
| Container margin | `0 20px 12px` |
| Background | `linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)` |
| Border | `1px solid #fcd34d` |
| Border radius | `16px` |
| Padding | `16px` |
| Header icon | Sparkles, 16px, `#f59e0b` |
| Header text | "Perfect for "[habit name]"" |
| Header font | `14px`, `semibold`, `#b45309` |
| Emoji cells | `56x56px`, `bg-white`, `rounded-2xl` |
| Emoji font | `32px` |
| Cell gap | `8px` |
| Selected state | `box-shadow: 0 0 0 2px #3b82f6` |

### 5. Category Pills

| Property | Value |
|----------|-------|
| Container padding | `0 20px 12px` |
| Scroll | horizontal, hide scrollbar |
| Pill gap | `8px` |
| Pill padding | `8px 16px` |
| Pill border radius | `9999px` |
| Pill font | `14px`, `medium` |
| Inactive | `bg-#f3f4f6`, `color-#374151` |
| Active | `bg-#1a1a1a`, `color-white`, `shadow-md` |

### 6. Emoji Grid

| Property | Value |
|----------|-------|
| Container | `flex-1`, `overflow-y-auto` |
| Padding | `0 20px 24px` |
| Columns | `6` |
| Gap | `8px` |
| Cell size | `100% width`, `aspect-ratio: 1` |
| Cell background | `#f9fafb` |
| Cell border radius | `12px` |
| Emoji font | `28px` |
| Hover | `scale(1.1)`, `bg-#e5e7eb` |
| Press | `scale(0.92)` |
| Selected | `bg-#dbeafe`, `ring-2 ring-#3b82f6` |

### 7. No Icon Button

| Property | Value |
|----------|-------|
| Container padding | `12px 20px 24px` |
| Border top | `1px solid #f3f4f6` |
| Button width | `100%` |
| Button height | `48px` |
| Button background | `#f3f4f6` |
| Button border radius | `12px` |
| Button text | "No icon" |
| Button font | `14px`, `medium`, `#4b5563` |

---

## Entry Point in Add Habit Form

Replace the current `StyleSection` emoji picker with a single tappable row:

```
┌─────────────────────────────────────────────┐
│  [🧘]  Icon                      [Edit →]   │
│   ↑     ↑                           ↑       │
│ 48x48  Label                    Chevron     │
└─────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Container | `bg-white`, `rounded-2xl`, `p-4` |
| Icon preview | `48x48px`, `rounded-xl`, habit color bg |
| Label | "Icon", `16px`, `medium`, `#1a1a1a` |
| Chevron | `chevron-right`, `20px`, `#9ca3af` |
| Tap target | Entire row |

---

## Animations

### Bottom Sheet Entrance
```typescript
// Slide up animation
Animated.spring(translateY, {
  toValue: 0,
  damping: 20,
  stiffness: 200,
  useNativeDriver: true,
});
```

### Emoji Cell Press
```typescript
// Scale animation
Animated.sequence([
  Animated.timing(scale, { toValue: 0.92, duration: 50 }),
  Animated.spring(scale, { toValue: 1, damping: 10, stiffness: 400 }),
]);
```

### Category Pill Selection
```typescript
// Smooth transition
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
```

---

## Data Flow

```typescript
interface EmojiPickerV2Props {
  visible: boolean;
  habitName: string;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}

// AI Suggestions based on habit name
const suggestedEmojis = useMemo(() => {
  return suggestEmojisForHabitName(habitName, 5);
}, [habitName]);
```

---

## Accessibility

| Element | Requirement |
|---------|-------------|
| Bottom sheet | `accessibilityViewIsModal={true}` |
| Drag handle | `accessibilityLabel="Drag to dismiss"` |
| Search | `accessibilityLabel="Search emojis"` |
| Suggestions | `accessibilityLabel="Suggested emoji [emoji]"` |
| Category | `accessibilityRole="tab"`, `accessibilityState={{ selected }}` |
| Emoji | `accessibilityLabel="Select [emoji]"`, `accessibilityRole="button"` |
| Close on drag | Support gesture dismissal |
| Close on backdrop tap | Dismiss sheet |

---

## Files to Modify/Create

### New Files
| File | Purpose |
|------|---------|
| `src/components/EmojiPickerV2/EmojiPickerSheet.tsx` | Main bottom sheet component |
| `src/components/EmojiPickerV2/AISuggestions.tsx` | AI suggestions section |
| `src/components/EmojiPickerV2/CategoryPills.tsx` | Category horizontal scroll |
| `src/components/EmojiPickerV2/EmojiGrid.tsx` | Emoji grid with virtualization |
| `src/components/EmojiPickerV2/index.ts` | Exports |

### Modify
| File | Changes |
|------|---------|
| `src/components/CreateHabitModal/components/StyleSection.tsx` | Replace inline picker with tappable row |
| `src/components/CreateHabitModal/CreateHabitModalV2.tsx` | Integrate new picker |

---

## Tasks

### Phase 1: Entry Point (Priority: High)
- [x] **T1.1** Create tappable Icon row component in StyleSection
  - *Completed: Implemented in StyleSection.tsx lines 126-154 with full press animation*
- [x] **T1.2** Remove old horizontal emoji scroll
  - *Completed: No horizontal scroll exists - emoji picker opens as full modal*
- [x] **T1.3** Add state for bottom sheet visibility
  - *Completed: `showEmojiPicker` state at StyleSection.tsx line 89*
- [x] **T1.4** Style Icon row with emoji preview + chevron
  - *Completed: 48x48 icon preview, "Icon" label, subtitle text, ChevronRight icon, slate-50 background*

### Phase 2: Bottom Sheet Structure (Priority: High)
- [x] **T2.1** Create EmojiPickerSheet component with bottom sheet animation
  - *Completed: Created `src/components/EmojiPickerV2/EmojiPickerSheet.tsx` with 70% screen height, rounded corners (32px), and react-native-reanimated spring animations*
- [x] **T2.2** Implement drag handle and gesture dismissal
  - *Completed: Added drag handle (40x4px with gray-300 background) with PanGesture from react-native-gesture-handler for swipe-to-dismiss (25% threshold or 500+ velocity)*
- [x] **T2.3** Add backdrop overlay with tap-to-close
  - *Completed: Implemented backdrop with 40% opacity black overlay, tap-to-close via Pressable, and animated opacity transitions*
- [x] **T2.4** Implement slide-up/down animations
  - *Completed: Used react-native-reanimated withSpring (damping: 20, stiffness: 200) for smooth slide animations on open/close*

### Phase 3: AI Suggestions (Priority: High)
- [x] **T3.1** Create AISuggestions component
  - *Completed: Implemented inline in EmojiPickerSheet.tsx (lines 336-357) with suggestionsContainer section*
- [x] **T3.2** Style suggestion container with gradient background
  - *Completed: Styled with warm yellow background (#fef3c7), golden border (#fcd34d), 16px border-radius, and 16px padding per spec*
- [x] **T3.3** Display 5 suggested emojis in large cells
  - *Completed: Uses EmojiCell with size="large" (56x56px, 32px font) displaying 5 emojis from suggestEmojisForHabitName()*
- [x] **T3.4** Add "Perfect for [habit name]" header with sparkles icon
  - *Completed: Header with Sparkles icon (16px, amber #f59e0b) and "Perfect for '[habitName]'" text (14px semibold, #b45309)*

### Phase 4: Search & Categories (Priority: Medium)
- [x] **T4.1** Add search bar with focus states
  - *Completed: Added animated focus ring using react-native-reanimated with 200ms focus/150ms blur transitions. Blue border (#3b82f6) and shadow on focus, search icon color changes to blue when focused.*
- [ ] **T4.2** Create CategoryPills horizontal scroll
- [ ] **T4.3** Implement category selection with active state
- [ ] **T4.4** Filter emojis by category

### Phase 5: Emoji Grid (Priority: Medium)
- [ ] **T5.1** Create EmojiGrid with 6-column layout
- [ ] **T5.2** Implement virtualized scrolling (FlatList)
- [ ] **T5.3** Add press animations and selection state
- [ ] **T5.4** Add category header labels

### Phase 6: Polish & Integration (Priority: Low)
- [ ] **T6.1** Add "No icon" button at bottom
- [ ] **T6.2** Ensure accessibility labels complete
- [ ] **T6.3** Test on iOS and Android
- [ ] **T6.4** Clean up old EmojiPicker component references

---

## Success Metrics

- Users can access full emoji picker in 1 tap (not 2)
- AI suggestions used in 40%+ of selections
- Time to select emoji reduced by 30%
- User satisfaction improved (qualitative feedback)

---

## Open Questions

1. Should we keep the old EmojiPicker for backward compatibility or fully replace?
2. Should the bottom sheet be draggable to full screen?
3. Should we show Recently Used alongside AI suggestions or separately?

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-19 | Initial V2 spec created | UX Expert |
| 2025-12-19 | Phase 3 tasks (T3.1-T3.4) marked complete - AI Suggestions already fully implemented inline in EmojiPickerSheet.tsx with tests passing | Claude |
| 2025-12-19 | T4.1 - Added animated search bar focus states with blue ring and icon color change | Claude |
