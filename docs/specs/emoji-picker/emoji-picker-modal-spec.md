# Emoji Picker Modal - Technical Specification

## Overview

Redesigned emoji picker modal with habit-focused categories, recently used section, and improved search.

**Mockup:** `.superdesign/design_iterations/emoji_picker_before_after_1.html`

---

## Modal Structure

```
┌─────────────────────────────────────┐
│  Header                             │  56px
├─────────────────────────────────────┤
│  Search Bar                         │  56px
├─────────────────────────────────────┤
│  Recently Used                      │  72px
├─────────────────────────────────────┤
│  Category Chips                     │  48px
├─────────────────────────────────────┤
│                                     │
│  Emoji Grid (scrollable)            │  flex-1
│                                     │
├─────────────────────────────────────┤
│  No Icon Button                     │  64px
└─────────────────────────────────────┘
```

---

## Component Specifications

### 1. Modal Container

```typescript
// Props
interface EmojiPickerProps {
  visible: boolean;
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  onClose: () => void;
}
```

| Property | Value |
|----------|-------|
| Animation | `slide` from bottom |
| Background | `#f8f5f1` |
| Border radius | `24px` (top corners) |
| Height | `85%` of screen |
| Overlay | `rgba(0,0,0,0.5)` |

### 2. Header

| Property | Value |
|----------|-------|
| Height | `56px` |
| Padding | `16px horizontal, 16px vertical` |
| Title | "Choose Icon" |
| Title font | `20px`, `semibold`, `#1a1a1a` |
| Close button | `40x40px`, `rounded-full`, `bg-gray-200` |
| Close icon | `X` from lucide, `20px`, `#1a1a1a` |

### 3. Search Bar

| Property | Value |
|----------|-------|
| Container padding | `16px horizontal, 12px vertical` |
| Input background | `#ffffff` |
| Input height | `48px` |
| Input border radius | `12px` |
| Input padding | `12px` |
| Placeholder | "Search emojis..." |
| Placeholder color | `#9ca3af` |
| Search icon | `Search` from lucide, `20px`, `#9ca3af` |
| Clear button | `X` icon, appears when text present |

**Search Behavior:**
- Debounce: `150ms`
- Searches emoji keywords (see keyword mapping below)
- Hides categories and shows results grid when searching

### 4. Recently Used Section

| Property | Value |
|----------|-------|
| Container padding | `16px horizontal, 8px vertical` |
| Label | "RECENTLY USED" |
| Label font | `12px`, `semibold`, `uppercase`, `#6b7280`, `tracking-wider` |
| Label margin bottom | `8px` |
| Emoji row | horizontal scroll, `gap-8px` |
| Emoji cell | `44x44px`, `rounded-xl`, `bg-white` |
| Selected state | `bg-#dbeafe`, `2px #3b82f6 border` |

**Storage:**
```typescript
// AsyncStorage key
const RECENT_EMOJIS_KEY = '@habit_app:recent_emojis';
const MAX_RECENT_EMOJIS = 10;

// Functions
async function getRecentEmojis(): Promise<string[]>
async function addRecentEmoji(emoji: string): Promise<void>
```

### 5. Category Chips

| Property | Value |
|----------|-------|
| Container padding | `16px horizontal, 12px vertical` |
| Container border | `1px solid #e5e7eb` (bottom) |
| Scroll | horizontal, hide scrollbar |
| Chip gap | `8px` |
| Chip padding | `8px 12px` |
| Chip border radius | `9999px` (full) |
| Chip font | `14px`, `medium` |
| Chip background (inactive) | `#ffffff` |
| Chip background (active) | `#1a1a1a` |
| Chip text (inactive) | `#1a1a1a` |
| Chip text (active) | `#ffffff` |
| Chip icon | emoji, `16px` |

**Categories:**
```typescript
const HABIT_CATEGORIES = [
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'learning', name: 'Learning', icon: '📚' },
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
  { id: 'health', name: 'Health', icon: '🍎' },
  { id: 'work', name: 'Work', icon: '💼' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'social', name: 'Social', icon: '❤️' },
  { id: 'all', name: 'All', icon: '⭐' },
];
```

### 6. Emoji Grid

| Property | Value |
|----------|-------|
| Container | `flex-1`, `bg-white`, `overflow-y-auto` |
| Padding | `16px` |
| Category label | `12px`, `semibold`, `uppercase`, `#6b7280`, `tracking-wider` |
| Category label margin | `0 0 12px 0` |
| Grid columns | `7` |
| Grid gap | `8px` |
| Cell size | `44x44px` |
| Cell border radius | `12px` |
| Cell background | `#f9fafb` |

**Cell States:**
| State | Style |
|-------|-------|
| Default | `bg-#f9fafb` |
| Hover | `scale(1.15)`, `bg-#f1f5f9` |
| Press | `scale(0.9)` |
| Selected | `scale(1.1)`, `bg-#dbeafe`, `2px #3b82f6 border` |

**Emoji font size:** `24px`

### 7. No Icon Button

| Property | Value |
|----------|-------|
| Container padding | `16px` |
| Container background | `#ffffff` |
| Container border | `1px solid #e5e7eb` (top) |
| Button width | `100%` |
| Button height | `48px` |
| Button background (unselected) | `#f3f4f6` |
| Button background (selected) | `#1a1a1a` |
| Button border radius | `12px` |
| Button text | "No Icon" |
| Button font | `16px`, `semibold` |
| Button text color (unselected) | `#1a1a1a` |
| Button text color (selected) | `#ffffff` |

---

## Emoji Data Structure

### Category Emojis

```typescript
// src/constants/habitEmojis.ts

export const HABIT_EMOJI_DATA: Record<string, string[]> = {
  fitness: [
    '💪', '🏃', '🚴', '🏋️', '🏊', '🧘', '🚶', '🤸',
    '⚽', '🏀', '🎾', '🏈', '🥊', '🎯', '🛹', '🏇',
    '🥋', '🏌️', '🤾', '🏄', '🧗', '🏂', '⛷️', '🤿',
  ],
  learning: [
    '📖', '📚', '✏️', '🎓', '💡', '🧠', '📝', '🔬',
    '📐', '🔢', '🌐', '💻', '🎧', '📰', '🔍', '📊',
  ],
  wellness: [
    '🧘', '💆', '😴', '💤', '🌅', '🌿', '💚', '🛁',
    '🕯️', '🌸', '☮️', '🧖', '💭', '🌙', '✨', '🦋',
  ],
  health: [
    '🥗', '🍎', '💧', '🥦', '🍳', '🥤', '💊', '🩺',
    '🏥', '🧬', '🦷', '💉', '🥕', '🍌', '🥑', '🫀',
  ],
  work: [
    '💼', '📋', '✅', '📅', '⏰', '🎯', '📈', '💻',
    '📧', '📞', '🗂️', '📌', '🖊️', '📎', '🗓️', '💵',
  ],
  creative: [
    '🎨', '🎵', '🎸', '📷', '✍️', '🎭', '🖌️', '🎹',
    '🎤', '🎬', '📹', '🎻', '🪡', '🧶', '🎺', '🥁',
  ],
  home: [
    '🏠', '🧹', '🌱', '🛏️', '🧺', '🍳', '👕', '🧼',
    '🪴', '🛋️', '🚿', '🗑️', '🧽', '🪣', '🧴', '🛒',
  ],
  finance: [
    '💰', '💵', '📊', '🏦', '💳', '📉', '💎', '🪙',
    '🧾', '💹', '🏧', '📈', '🤑', '💲', '📑', '🔐',
  ],
  social: [
    '❤️', '👨‍👩‍👧', '📞', '💬', '🤝', '👋', '😊', '🎉',
    '🎂', '💐', '🤗', '💌', '🥳', '👥', '🫂', '💕',
  ],
};
```

### Search Keywords

```typescript
// src/utils/emojiKeywords.ts

export const EMOJI_KEYWORDS: Record<string, string[]> = {
  '💪': ['strength', 'muscle', 'workout', 'gym', 'exercise', 'strong'],
  '🏃': ['run', 'running', 'jog', 'jogging', 'cardio', 'sprint'],
  '🚴': ['bike', 'bicycle', 'cycling', 'ride'],
  '💧': ['water', 'hydrate', 'drink', 'hydration'],
  '😴': ['sleep', 'rest', 'nap', 'tired', 'bed'],
  '📚': ['read', 'book', 'study', 'learn', 'reading'],
  '🧘': ['meditate', 'meditation', 'yoga', 'mindful', 'calm', 'zen'],
  '🍎': ['fruit', 'healthy', 'apple', 'diet', 'nutrition'],
  '✅': ['done', 'check', 'complete', 'task', 'finish'],
  '⏰': ['time', 'alarm', 'wake', 'morning', 'schedule'],
  // ... extend for all emojis
};

export function searchEmojis(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const results: string[] = [];

  for (const [emoji, keywords] of Object.entries(EMOJI_KEYWORDS)) {
    if (keywords.some(kw => kw.includes(normalizedQuery))) {
      results.push(emoji);
    }
  }

  return results;
}
```

---

## Animations

### Press Animation (Emoji Cell)

```typescript
const scale = useRef(new Animated.Value(1)).current;

const handlePressIn = () => {
  Animated.timing(scale, {
    toValue: 0.9,
    duration: 100,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.timing(scale, {
    toValue: 1,
    duration: 150,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  }).start();
};
```

### Category Chip Transition

```typescript
// Active state transition
const chipStyle = {
  backgroundColor: isActive ? '#1a1a1a' : '#ffffff',
  // Transition handled by React Native's built-in animation
};
```

---

## Accessibility

| Element | Accessibility |
|---------|---------------|
| Modal | `accessibilityViewIsModal={true}` |
| Close button | `accessibilityLabel="Close emoji picker"` |
| Search input | `accessibilityLabel="Search emojis"` |
| Category chip | `accessibilityRole="button"`, `accessibilityState={{ selected }}` |
| Emoji cell | `accessibilityLabel="Select [emoji] emoji"`, `accessibilityRole="button"` |
| No Icon button | `accessibilityLabel="Select no icon"` |

---

## Performance Optimizations

1. **Virtualized Grid**: Use `FlatList` with `getItemLayout` for emoji grid
2. **Memoized Cells**: Wrap emoji cells in `React.memo`
3. **Debounced Search**: 150ms debounce on search input
4. **Lazy Load Categories**: Only render visible category emojis
5. **useCallback**: Wrap all handlers in `useCallback`

```typescript
const renderEmojiItem = useCallback(({ item }: { item: string }) => (
  <EmojiCell
    emoji={item}
    isSelected={selectedEmoji === item}
    onPress={() => handleSelect(item)}
  />
), [selectedEmoji, handleSelect]);
```

---

## File Structure

```
src/
├── components/
│   └── EmojiPicker/
│       ├── EmojiPicker.tsx        # Main modal component
│       ├── EmojiCell.tsx          # Memoized emoji button
│       ├── CategoryChips.tsx      # Horizontal category scroll
│       ├── RecentlyUsed.tsx       # Recent emojis section
│       ├── SearchBar.tsx          # Search input
│       └── index.ts               # Exports
├── constants/
│   └── habitEmojis.ts             # Category definitions & emoji data
└── utils/
    ├── emojiKeywords.ts           # Search keyword mappings
    └── recentEmojis.ts            # AsyncStorage recent tracking
```

---

## State Management

```typescript
// EmojiPicker.tsx

const [selectedCategory, setSelectedCategory] = useState('fitness');
const [searchQuery, setSearchQuery] = useState('');
const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

// Load recent on mount
useEffect(() => {
  getRecentEmojis().then(setRecentEmojis);
}, []);

// Handle selection
const handleSelect = useCallback(async (emoji: string | null) => {
  if (emoji) {
    await addRecentEmoji(emoji);
  }
  onSelect(emoji);
  onClose();
}, [onSelect, onClose]);
```
