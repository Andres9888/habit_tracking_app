# Fix: Emoji appearing in habit name text input on edit screen

## Context

When editing a habit, the emoji icon appears at the beginning of the text input field. The save handler stores the name as `"💪 Running"` (emoji + space + name) in `habit.name` AND separately as `habit.icon`. On load, `parseHabitName` uses regex `/^(\p{Emoji})\s+(.+)$/u` to split them — but `\p{Emoji}` only matches a single Unicode codepoint, so it fails for multi-codepoint emojis (ZWJ sequences, skin tones, variation selectors, flags). When parsing fails, the full emoji-prefixed string ends up in the text input.

## Fix

**File:** `src/screens/HabitEditScreen/useHabitEditScreen.ts` (line 34)

In the `useEffect` that loads habit data, after parsing the name, check if parsing failed to extract the emoji but we have `habit.icon` available — if so, manually strip the icon prefix from the name:

```ts
// Before (line 31-34):
const parsedName = parseHabitName(habit.name ?? '');
const selectedIcon = habit.icon ?? parsedName.emoji;
setHabitName(parsedName.name || habit.name || '');

// After:
const parsedName = parseHabitName(habit.name ?? '');
const selectedIcon = habit.icon ?? parsedName.emoji;

let cleanName = parsedName.name;
if (!parsedName.emoji && habit.icon && cleanName.startsWith(habit.icon)) {
  cleanName = cleanName.slice(habit.icon.length).trim();
}
setHabitName(cleanName);
```

**Why this works:** When `parseHabitName` succeeds (`parsedName.emoji` is set), `parsedName.name` is already clean — no change. When it fails (`parsedName.emoji` is null) but `habit.icon` exists, we use the stored icon to strip the prefix. This handles all emoji types regardless of codepoint count.

## Verification

1. Open a habit with a simple emoji (e.g. 💪) in edit mode — name should show without emoji
2. Open a habit with a compound emoji (ZWJ/skin tone) in edit mode — name should show without emoji
3. Edit the name, save, re-open edit — name should still be clean
