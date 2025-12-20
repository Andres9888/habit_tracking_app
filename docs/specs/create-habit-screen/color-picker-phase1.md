# Color Picker Phase 1: Preset Colors Only

## Goal

Remove the freezing custom color picker and expand preset colors to 16 curated options. No modal needed.

---

## Current State

```
┌─────────────────────────────────────┐
│  Color                              │
│  🔴 🟠 🟡 🟢 🔵 🟣 💗 ⚫            │  ← 8 colors
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🎨  Custom color          [●]│  │  ← FREEZES APP
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Problems:**
- Custom color picker freezes the app
- Only 8 preset colors - not enough variety

---

## Target State

```
┌─────────────────────────────────────┐
│  Color                              │
│                                     │
│  🔴 🟠 🟡 🟢 🔵 🟣 💗 ⚫            │  ← Row 1: 8 colors
│                                     │
│  🩵 🩷 🧡 💚 💜 🤎 🖤 🤍            │  ← Row 2: 8 colors
│                                     │
└─────────────────────────────────────┘

   ✅ No modal, no freezing, 16 curated colors
```

---

## Tasks

### T1: Expand Color Palette
**File:** `src/components/CreateHabitModal/constants.ts`

Update `COLORS` array to 16 curated colors:

```typescript
export const COLORS = [
  // Row 1: Core vibrant colors
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#1E293B', // Slate (dark)

  // Row 2: Softer/alternative tones
  '#06B6D4', // Cyan
  '#F472B6', // Light Pink
  '#FB923C', // Light Orange
  '#4ADE80', // Light Green
  '#A78BFA', // Light Purple
  '#78716C', // Stone (neutral)
  '#0EA5E9', // Sky Blue
  '#FBBF24', // Amber
];
```

---

### T2: Update StyleSection Layout
**File:** `src/components/CreateHabitModal/components/StyleSection.tsx`

Changes:
1. Remove "Custom color" button and `onCustomColorPress` prop
2. Display colors in 2 rows (wrap after 8)
3. Keep existing selection animation and haptic feedback

**Before:**
```tsx
{/* Basic Colors */}
<View className="mb-4 flex-row flex-wrap gap-3">
  {colors.map((color) => (
    // ... color buttons
  ))}
</View>

{/* Custom Color Button */}
<Pressable onPress={onCustomColorPress}>
  ...
</Pressable>
```

**After:**
```tsx
{/* All Colors - 2 rows */}
<View className="flex-row flex-wrap gap-3">
  {colors.map((color) => (
    // ... color buttons (unchanged)
  ))}
</View>

{/* No custom color button */}
```

---

### T3: Remove ColorPickerSheet from CreateHabitModal
**File:** `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

Changes:
1. Remove `ColorPickerSheet` import
2. Remove `ColorPickerSheet` component from render
3. Remove `openColorPicker` / `closeColorPicker` from form hook usage (or keep but don't use)

**Before:**
```tsx
import { ColorPickerSheet } from './ColorPickerSheet';

// In render:
<ColorPickerSheet
  presetColors={COLORS}
  value={form.selectedColor}
  visible={form.isColorPickerVisible}
  onClose={form.closeColorPicker}
  onSelect={form.setSelectedColor}
/>
```

**After:**
```tsx
// No ColorPickerSheet import or render
```

---

### T4: Update StyleSection Props
**File:** `src/components/CreateHabitModal/components/StyleSection.tsx`

Remove unused props from interface:

**Before:**
```typescript
interface StyleSectionProps {
  colors: string[];
  emojis: string[];
  onCustomColorPress: () => void;  // Remove
  onSelectColor: (color: string) => void;
  onSelectEmoji: (emoji: string | null) => void;
  selectedColor: string;
  selectedEmoji: string | null;
  suggestedEmojis?: string[];
  habitName?: string;
}
```

**After:**
```typescript
interface StyleSectionProps {
  colors: string[];
  emojis: string[];
  onSelectColor: (color: string) => void;
  onSelectEmoji: (emoji: string | null) => void;
  selectedColor: string;
  selectedEmoji: string | null;
  suggestedEmojis?: string[];
  habitName?: string;
}
```

---

### T5: Update CreateHabitModalV2 StyleSection Usage
**File:** `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

Remove `onCustomColorPress` prop:

**Before:**
```tsx
<StyleSection
  colors={COLORS}
  emojis={EMOJIS}
  habitName={form.habitName}
  selectedColor={form.selectedColor}
  selectedEmoji={form.selectedEmoji}
  suggestedEmojis={suggestedEmojis}
  onCustomColorPress={form.openColorPicker}
  onSelectColor={form.setSelectedColor}
  onSelectEmoji={form.setSelectedEmoji}
/>
```

**After:**
```tsx
<StyleSection
  colors={COLORS}
  emojis={EMOJIS}
  habitName={form.habitName}
  selectedColor={form.selectedColor}
  selectedEmoji={form.selectedEmoji}
  suggestedEmojis={suggestedEmojis}
  onSelectColor={form.setSelectedColor}
  onSelectEmoji={form.setSelectedEmoji}
/>
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/CreateHabitModal/constants.ts` | Expand COLORS to 16 |
| `src/components/CreateHabitModal/components/StyleSection.tsx` | Remove custom color button, update props |
| `src/components/CreateHabitModal/CreateHabitModalV2.tsx` | Remove ColorPickerSheet |

---

## Files to Keep (Not Delete)

- `src/components/CreateHabitModal/ColorPickerSheet.tsx` - Keep for Phase 2 reference
- `src/utils/lastCustomColor.ts` - Keep for Phase 2

---

## Testing Checklist

- [ ] All 16 colors display in 2 rows
- [ ] Color selection works with haptic feedback
- [ ] Selection animation works (scale pop)
- [ ] No freezing when selecting colors
- [ ] Selected color shows checkmark
- [ ] Selected color applies to habit preview
- [ ] No TypeScript errors
- [ ] No console warnings

---

## Success Metrics

- Zero freezing
- All 16 colors selectable
- Smooth selection animation
- Haptic feedback on tap
