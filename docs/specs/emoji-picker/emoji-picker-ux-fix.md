# Emoji Picker UX Fix Specification

## Problem Statement

The current emoji picker has two core UX issues:

1. **Poor Clickability Affordance** - Users don't realize the emoji icon is tappable to change it
2. **Subpar Emoji Selector Experience** - The full emoji picker modal is difficult to use

## Current State Analysis

### HabitEditScreen (lines 203-229)
- Large emoji preview (80x80) with colored background
- Separate "Browse Icons" button below to open picker
- **Problem**: The emoji itself doesn't look interactive; users must find the secondary button

### EmojiPicker Modal
- 925+ emojis in 11 categories
- Search functionality exists but keyword matching is limited
- Grid layout with 8 emojis per row
- **Problems**:
  - Categories are overwhelming (too many options)
  - "Popular" emojis aren't contextually relevant to habits
  - No visual hierarchy to guide selection
  - Search requires exact category name matches

### CreateHabitModal StyleSection
- Shows only 8 quick-pick emojis + "More" button
- Better than Edit screen but still has discoverability issues

---

## Proposed Solution

### 1. Improve Emoji Tap Affordance

**Goal**: Make it obvious the emoji is clickable

#### Option A: Visual Cues (Recommended)
```
┌─────────────────────────────┐
│                             │
│      ┌──────────────┐       │
│      │     💪       │       │
│      │    ✏️ Edit   │       │  ← Small edit indicator
│      └──────────────┘       │
│         Tap to change       │  ← Helper text
│                             │
└─────────────────────────────┘
```

**Changes**:
- Add subtle "Tap to change" text below emoji
- Add small edit pencil icon overlay on emoji container
- Make entire emoji container a single tap target (remove separate button)
- Add press animation (scale down on press)

#### Option B: Inline Edit Button
- Keep emoji preview but add visible edit icon in corner
- More explicit but slightly busier design

### 2. Redesign Emoji Selector

**Goal**: Make finding the right emoji fast and intuitive

#### 2.1 Smart Categories for Habits
Replace generic categories with habit-focused ones:

| Category | Emojis | Use Case |
|----------|--------|----------|
| 💪 Fitness | 🏃🚴💪🧘🏋️🏊🚶🤸 | Exercise habits |
| 📚 Learning | 📖📚✏️🎓💡🧠📝🔬 | Reading, studying |
| 🧘 Wellness | 🧘💆😴💤🌅🧘‍♀️🌿💚 | Meditation, sleep |
| 🍎 Health | 🥗🍎💧🥦🍳🥤💊🩺 | Nutrition, hydration |
| 💼 Productivity | 💼📋✅📅⏰🎯📈💻 | Work, planning |
| 🎨 Creative | 🎨🎵🎸📷✍️🎭🖌️🎹 | Art, music, writing |
| 🏠 Home | 🏠🧹🌱🛏️🧺🍳👕🧼 | Chores, gardening |
| 💰 Finance | 💰💵📊🏦💳📉💎🪙 | Saving, budgeting |
| ❤️ Social | ❤️👨‍👩‍👧📞💬🤝👋😊🎉 | Relationships, calls |
| ⭐ All | Full library | Browse everything |

#### 2.2 Improved Search
- Add keyword synonyms (e.g., "run" → 🏃, "water" → 💧)
- Show search results instantly as user types
- Display matching category name under results

#### 2.3 Recent/Frequently Used
- Track user's emoji selections
- Show "Recently Used" as first category
- Persist across sessions

#### 2.4 Visual Improvements
```
┌─────────────────────────────────────┐
│  Choose Icon                    ✕   │
├─────────────────────────────────────┤
│  🔍 Search emojis...                │
├─────────────────────────────────────┤
│  ⭐ Recently Used                   │
│  💪 🧘 📚 💧 🏃                      │
├─────────────────────────────────────┤
│  💪 Fitness  📚 Learning  🧘 Mind   │
│  🍎 Health   💼 Work      🎨 Create │
├─────────────────────────────────────┤
│                                     │
│  💪 🏃 🚴 🧘 🏋️ 🏊 🚶 🤸            │
│  🎾 ⚽ 🏀 🏈 🎯 🥊 🏇 🛹            │
│                                     │
├─────────────────────────────────────┤
│  [ No Icon ]                        │
└─────────────────────────────────────┘
```

**Key Changes**:
- Compact category chips at top (horizontal scroll)
- Larger emoji grid (easier to tap)
- Recently used section prominently displayed
- Clearer visual hierarchy

---

## Implementation Tasks

### Phase 1: Affordance Fix (Quick Win)
1. [ ] Make emoji preview tappable (remove separate button)
2. [ ] Add "Tap to change" helper text
3. [ ] Add press animation to emoji container
4. [ ] Add subtle edit icon overlay

### Phase 2: Emoji Picker Redesign
1. [ ] Create habit-focused category data structure
2. [ ] Implement "Recently Used" tracking (AsyncStorage)
3. [ ] Improve search with keyword synonyms
4. [ ] Redesign picker layout with category chips
5. [ ] Increase emoji tap targets (larger grid cells)
6. [ ] Add haptic feedback on selection

### Phase 3: Polish
1. [ ] Animate category transitions
2. [ ] Add empty state for search
3. [ ] Sync recently used across Create/Edit screens
4. [ ] Test accessibility (VoiceOver, TalkBack)

---

## Success Metrics

- Users can change emoji without needing "Browse" button
- Time to select emoji reduced by 50%
- First-time users understand emoji is tappable

---

## Technical Notes

### Files to Modify
- `src/screens/HabitEditScreen.tsx` - Emoji affordance
- `src/components/EmojiPicker/EmojiPicker.tsx` - Picker redesign
- `src/utils/emojiData.ts` - Category restructure
- `src/components/CreateHabitModal/components/StyleSection.tsx` - Consistency

### New Files
- `src/utils/recentEmojis.ts` - Recently used tracking
- `src/constants/habitEmojis.ts` - Habit-focused categories

### Dependencies
- None (uses existing AsyncStorage, Animated APIs)

---

## Known Bugs

### VirtualizedList Nesting Warning
**Error**: `VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.`

**Cause**: The EmojiPickerSheet uses a FlatList for the emoji grid, but may be nested inside a parent ScrollView (e.g., in CreateHabitModalV2 or HabitEditScreen).

**Impact**:
- Breaks virtualization/windowing optimizations
- Can cause scroll conflicts and janky behavior
- Memory issues with large emoji lists

**Fix Options**:
1. Use `nestedScrollEnabled={true}` on the inner FlatList (partial fix)
2. Remove outer ScrollView when emoji picker is open
3. Use a fixed-height container for the emoji grid
4. Replace FlatList with a non-virtualized grid when emoji count is small
5. Use `scrollEnabled={false}` on parent ScrollView when picker is active

**Priority**: High - affects scroll performance and user experience

---

## Open Questions

1. Should we show suggested emojis based on habit name? (e.g., "Meditate" → 🧘)
2. Max number of recently used to display? (Suggest: 8-10)
3. Should emoji selection auto-assign a matching color?
