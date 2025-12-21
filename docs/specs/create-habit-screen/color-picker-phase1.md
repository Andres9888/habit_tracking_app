# Color Picker Phase 1: Preset Colors Only

## Goal

Remove the freezing custom color picker and expand preset colors to 24 curated options in 3 rows. No modal needed.

---

## Design Mockup

**High-fidelity mockup**: `.superdesign/design_iterations/color_picker_phase1_1.html`

Open in browser: `open .superdesign/design_iterations/color_picker_phase1_1.html`

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
│  🔴 🟠 🟡 🟢 🔵 🟣 💗 ⚫            │  ← Row 1: Vibrant
│                                     │
│  🩵 🧡 💚 💜 🩷 🤎 🖤 🌊            │  ← Row 2: Alternative
│                                     │
│  🌸 🍑 🌿 💎 🪻 🩶 🤍 🌻            │  ← Row 3: Soft/Pastel
│                                     │
└─────────────────────────────────────┘

   ✅ No modal, no freezing, 24 curated colors in 3 rows
```

---

## Tasks

### T1: Expand Color Palette
**File:** `src/components/CreateHabitModal/constants.ts`

Update `COLORS` array to 24 curated colors (3 rows of 8):

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

  // Row 2: Alternative vibrant tones
  '#06B6D4', // Cyan
  '#FB923C', // Light Orange
  '#4ADE80', // Light Green
  '#A78BFA', // Light Purple
  '#F472B6', // Light Pink
  '#78716C', // Stone (neutral)
  '#0F172A', // Dark Navy
  '#0EA5E9', // Sky Blue

  // Row 3: Soft/Pastel tones
  '#FCA5A5', // Soft Red
  '#FDBA74', // Soft Orange / Peach
  '#86EFAC', // Soft Green / Mint
  '#7DD3FC', // Soft Blue
  '#C4B5FD', // Soft Purple / Lavender
  '#A8A29E', // Warm Gray
  '#FFFFFF', // White
  '#FBBF24', // Amber / Gold
];
```

---

### T2: Update StyleSection Layout
**File:** `src/components/CreateHabitModal/components/StyleSection.tsx`

Changes:
1. Remove "Custom color" button and `onCustomColorPress` prop
2. Display colors in 3 rows (8 per row, flex-wrap)
3. Keep existing circle style, selection animation, and haptic feedback
4. Add border for white color visibility

---

### T3: Remove ColorPickerSheet from CreateHabitModal
**File:** `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

Changes:
1. Remove `ColorPickerSheet` import
2. Remove `ColorPickerSheet` component from render
3. Remove `openColorPicker` / `closeColorPicker` usage

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
| `src/components/CreateHabitModal/constants.ts` | Expand COLORS to 24 |
| `src/components/CreateHabitModal/components/StyleSection.tsx` | Remove custom color button, update props, 3-row layout |
| `src/components/CreateHabitModal/CreateHabitModalV2.tsx` | Remove ColorPickerSheet |

---

## Files to Keep (Not Delete)

- `src/components/CreateHabitModal/ColorPickerSheet.tsx` - Keep for Phase 2 reference
- `src/utils/lastCustomColor.ts` - Keep for Phase 2

---

## Testing Checklist

- [ ] All 24 colors display in 3 rows
- [ ] Color selection works with haptic feedback
- [ ] Selection animation works (scale pop)
- [ ] No freezing when selecting colors
- [ ] Selected color shows checkmark
- [ ] Selected color applies to habit preview
- [ ] White color has visible border
- [ ] No TypeScript errors
- [ ] No console warnings

---

## Success Metrics

- Zero freezing
- All 24 colors selectable
- Smooth selection animation
- Haptic feedback on tap
