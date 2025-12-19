# Story · Emoji Picker Modal Redesign

**Status:** Approved
**Epic:** 2 – Core Habit Management
**Story ID:** 2.8
**Depends On:** None

---

## User Story

**As a** habit tracker user,
**I want** an emoji picker with habit-relevant categories and recently used emojis,
**so that** I can quickly find and select the perfect icon for my habits.

---

## Problem Statement

The current emoji picker modal has overwhelming generic categories (925+ emojis in 11 categories like "Smileys", "Gestures", "People") that aren't contextually relevant to habits. Users struggle to find relevant emojis quickly.

---

## Acceptance Criteria

### AC1 · Recently Used Section

- [x] "Recently Used" section appears at top of picker (below search)
- [x] Displays last 10 selected emojis
- [x] Persists across sessions via AsyncStorage
- [x] Syncs between Create Habit and Edit Habit screens
- [x] Currently selected emoji shows selection indicator (blue border + scale)

### AC2 · Habit-Focused Categories

- [x] Replace generic categories with habit-relevant ones:

| Category | Icon | Example Emojis |
|----------|------|----------------|
| Fitness | 💪 | 🏃🚴💪🧘🏋️🏊🚶🤸 |
| Learning | 📚 | 📖📚✏️🎓💡🧠📝🔬 |
| Wellness | 🧘 | 🧘💆😴💤🌅🌿💚🛁 |
| Health | 🍎 | 🥗🍎💧🥦🍳🥤💊🩺 |
| Work | 💼 | 💼📋✅📅⏰🎯📈💻 |
| Creative | 🎨 | 🎨🎵🎸📷✍️🎭🖌️🎹 |
| Home | 🏠 | 🏠🧹🌱🛏️🧺🍳👕🧼 |
| Finance | 💰 | 💰💵📊🏦💳📉💎🪙 |
| Social | ❤️ | ❤️👨‍👩‍👧📞💬🤝👋😊🎉 |
| All | ⭐ | Full emoji library |

- [x] Category chips display horizontally with scroll
- [x] Active category chip has dark background (#1a1a1a) with white text

### AC3 · Improved Search

- [x] Search input at top of picker modal
- [x] Keyword synonyms support (e.g., "run" → 🏃, "water" → 💧, "sleep" → 😴)
- [x] Results display instantly as user types (debounced 150ms)
- [x] Empty state shows "No emojis found" with search icon
- [x] Clear button appears when search has text

### AC4 · Enhanced Grid Layout

- [x] Emoji tap targets increased to 44x44px minimum
- [x] 7 emojis per row (down from 8)
- [x] Selected emoji shows blue border (#3b82f6) + 1.1x scale
- [x] Press states with scale animation (0.9 on press)
- [x] Smooth scroll with momentum

### AC5 · Accessibility

- [x] All emojis have accessible labels ("Select [emoji] emoji")
- [x] Category chips announce selection state
- [x] Search input has proper placeholder and label
- [x] "No Icon" button clearly labeled
- [x] Focus management returns to trigger on modal close

---

## Design Reference

**Interactive Mockup:**
- `.superdesign/design_iterations/emoji_picker_before_after_1.html`

**Technical Spec:**
- `docs/specs/emoji-picker/emoji-picker-modal-spec.md`

### Modal Structure

```
┌─────────────────────────────────────┐
│  Choose Icon                    ✕   │  56px
├─────────────────────────────────────┤
│  🔍 Search emojis...                │  56px
├─────────────────────────────────────┤
│  RECENTLY USED                      │
│  [💪] [🧘] [📚] [💧] [🏃]           │  72px
├─────────────────────────────────────┤
│  [💪 Fitness] [📚 Learning] ...     │  48px
├─────────────────────────────────────┤
│  💪 FITNESS                         │
│                                     │
│  💪  🏃  🚴  🏋️  🏊  🧘  🚶        │
│  🤸  ⚽  🏀  🎾  🏈  🥊  🎯        │  flex-1
│  🛹  🏇  🥋  🏌️  🤾  🏄  🧗        │
│                                     │
├─────────────────────────────────────┤
│  [        No Icon        ]          │  64px
└─────────────────────────────────────┘
```

### Visual Specs

| Element | Spec |
|---------|------|
| Modal background | `#f8f5f1` |
| Modal border radius | `24px` (top corners) |
| Modal height | `85%` of screen |
| Category chip | px-3 py-2, rounded-full, 14px font-medium |
| Category chip (active) | bg-#1a1a1a, text-white |
| Emoji cell | 44x44px, rounded-xl, bg-#f9fafb |
| Selected state | bg-#dbeafe, 2px #3b82f6 border, scale 1.1 |
| Press state | scale 0.9 |

### Animation Specs

```css
/* Emoji item interactions */
.emoji-item {
  transition: all 0.15s ease;
}
.emoji-item:active { transform: scale(0.9); }
.emoji-item.selected {
  transform: scale(1.1);
  border: 2px solid #3b82f6;
}

/* Category chip */
.category-chip { transition: all 0.2s ease; }
.category-chip.active {
  background: #1a1a1a;
  color: white;
}
```

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/EmojiPicker/EmojiPicker.tsx` | Add Recently Used, habit categories, improved search |
| `src/utils/emojiData.ts` | Restructure to habit-focused categories |

### New Files

| File | Purpose |
|------|---------|
| `src/utils/recentEmojis.ts` | AsyncStorage-based recent emoji tracking |
| `src/constants/habitEmojis.ts` | Habit-focused category definitions |
| `src/utils/emojiKeywords.ts` | Search keyword synonyms mapping |

### Data Structures

```typescript
// src/constants/habitEmojis.ts
export const HABIT_CATEGORIES = [
  { id: 'fitness', name: 'Fitness', icon: '💪', emojis: ['💪', '🏃', '🚴', ...] },
  { id: 'learning', name: 'Learning', icon: '📚', emojis: ['📖', '📚', '✏️', ...] },
  { id: 'wellness', name: 'Wellness', icon: '🧘', emojis: ['🧘', '💆', '😴', ...] },
  { id: 'health', name: 'Health', icon: '🍎', emojis: ['🥗', '🍎', '💧', ...] },
  { id: 'work', name: 'Work', icon: '💼', emojis: ['💼', '📋', '✅', ...] },
  { id: 'creative', name: 'Creative', icon: '🎨', emojis: ['🎨', '🎵', '🎸', ...] },
  { id: 'home', name: 'Home', icon: '🏠', emojis: ['🏠', '🧹', '🌱', ...] },
  { id: 'finance', name: 'Finance', icon: '💰', emojis: ['💰', '💵', '📊', ...] },
  { id: 'social', name: 'Social', icon: '❤️', emojis: ['❤️', '👨‍👩‍👧', '📞', ...] },
  { id: 'all', name: 'All', icon: '⭐', emojis: [] }, // loads full library
];

// src/utils/recentEmojis.ts
const STORAGE_KEY = '@habit_app:recent_emojis';
const MAX_RECENT = 10;

export async function getRecentEmojis(): Promise<string[]>
export async function addRecentEmoji(emoji: string): Promise<void>

// src/utils/emojiKeywords.ts
export const EMOJI_KEYWORDS: Record<string, string[]> = {
  '💪': ['strength', 'muscle', 'workout', 'gym', 'exercise'],
  '🏃': ['run', 'running', 'jog', 'cardio', 'sprint'],
  '💧': ['water', 'hydrate', 'drink', 'hydration'],
  '😴': ['sleep', 'rest', 'nap', 'tired', 'bed'],
  '📚': ['read', 'book', 'study', 'learn', 'reading'],
  '🧘': ['meditate', 'meditation', 'yoga', 'mindful', 'calm'],
  // ... extend for all habit emojis
};

export function searchEmojis(query: string): string[]
```

---

## Tasks

### Task 1: Recently Used Section (Priority: High)

- [x] **T1.1** Create `src/utils/recentEmojis.ts` with AsyncStorage functions
- [x] **T1.2** Add Recently Used section UI to EmojiPicker
- [x] **T1.3** Track selections and update storage on emoji select
- [x] **T1.4** Display selection indicator on current emoji

### Task 2: Habit Categories (Priority: High)

- [x] **T2.1** Create `src/constants/habitEmojis.ts` with category definitions
- [x] **T2.2** Replace category tabs with horizontal chip scroll
- [x] **T2.3** Style active/inactive chip states
- [x] **T2.4** Update grid to show category emojis
- [x] **T2.5** Add "All" category that loads full emoji library

### Task 3: Search Enhancement (Priority: Medium)

- [x] **T3.1** Create `src/utils/emojiKeywords.ts` with synonym mappings
- [x] **T3.2** Implement keyword-based search function
- [x] **T3.3** Add debounced search (150ms) to input
- [x] **T3.4** Create empty state UI ("No emojis found")
- [x] **T3.5** Hide categories when searching, show results grid

### Task 4: Grid & Polish (Priority: Medium)

- [x] **T4.1** Increase tap targets to 44x44px
- [x] **T4.2** Reduce grid to 7 columns
- [x] **T4.3** Add press animation (scale 0.9)
- [x] **T4.4** Add selection state styling
- [x] **T4.5** Ensure accessibility labels complete

### Task 5: Auto-Suggest Emojis (Priority: Low)

- [x] **T5.1** Create emoji suggestion function based on habit name keywords
- [x] **T5.2** Map common habit words to relevant emojis (e.g., "Meditate" → 🧘, "Run" → 🏃, "Read" → 📚)
- [x] **T5.3** Show suggested emojis section when habit name is entered
- [ ] **T5.4** Pre-select best match emoji automatically (optional) - Deferred as truly optional enhancement

---

## Success Metrics

- Time to select emoji reduced by 40%
- Recently Used section used by 50%+ of emoji selections
- Users can find habit-relevant emojis in ≤2 taps

---

## Dependencies

- AsyncStorage (already in project)
- Animated API (already in project)

---

## Open Questions

1. Maximum recently used emojis to store? (Proposed: 10) **Answer: 10**

---

## Implementation Notes (2025-12-19)

### Files Created
- `src/utils/recentEmojis.ts` - AsyncStorage functions for persisting recent emojis
- `src/constants/habitEmojis.ts` - 10 habit-focused categories with curated emojis
- `src/utils/emojiKeywords.ts` - 80+ keyword synonyms for enhanced search
- `__mocks__/@react-native-async-storage/async-storage.js` - Test mock

### Files Modified
- `src/components/EmojiPicker/EmojiPicker.tsx` - Complete redesign with all new features

### Tests Created
- `src/components/EmojiPicker/tests/EmojiPicker.test.tsx` - 36 passing tests
- `src/utils/__tests__/recentEmojis.test.ts` - 13 passing tests
- `src/utils/__tests__/emojiKeywords.test.ts` - 20 passing tests

### Remaining Work
- T5.4 (Pre-select best match emoji automatically) - Optional enhancement, deferred

### Focus Management Implementation (2025-12-19)
- Added optional `triggerRef` prop to EmojiPicker for focus management
- Implemented `returnFocusToTrigger` callback using `AccessibilityInfo.setAccessibilityFocus`
- Updated all modal close handlers to return focus via `handleClose` wrapper
- Added test case for focus management behavior (36 total tests passing)

### Auto-Suggest Emojis Implementation (2025-12-19)
- Added `HABIT_NAME_EMOJI_MAP` with 100+ common habit word → emoji mappings in `src/utils/emojiKeywords.ts`
- Implemented `suggestEmojisForHabitName()` function with scoring algorithm for best matches
- Implemented `getBestEmojiForHabitName()` helper function for single emoji suggestions
- Added `habitName` prop to EmojiPicker component
- Added "Suggested for [habit name]" section that appears above Recently Used when habit name matches keywords
- Updated accessibility labels to distinguish "from suggestions" vs "from recently used"
- Added 24 new tests for suggestion functionality (emojiKeywords: 44 total, EmojiPicker: 46 total)

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-19 | Split from emoji-picker-redesign.story.md | PM |
| 2025-12-19 | Implemented Tasks 1-4, all acceptance criteria complete except focus management | MAESTRO |
| 2025-12-19 | Implemented AC5 focus management - returns focus to trigger on modal close | MAESTRO |
| 2025-12-19 | Implemented Task 5 (T5.1-T5.3): Auto-suggest emojis based on habit name keywords | MAESTRO |
