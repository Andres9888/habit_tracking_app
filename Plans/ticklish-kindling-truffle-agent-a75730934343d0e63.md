# Implementation Plan: Inline Completion Icon Segmented Control

## Summary

Replace the expanding-tray `CompletionIconPicker` with a compact inline segmented control rendered directly inside the SettingsRow. This also provides the opportunity to decompose `SettingsRow.tsx` (188 lines) below the 100-line limit by extracting right-side accessories into dedicated sub-components.

---

## Architecture Decision: `rightAccessory` prop (not a new `type`)

**Recommendation:** Add an optional `rightAccessory?: ReactNode` prop to `SettingsRow` instead of adding a new `type`.

**Rationale:**
- Adding a 5th `type` (e.g. `'segmented'`) would embed the segmented control's rendering logic inside SettingsRow, making it even larger.
- A `rightAccessory` prop lets SettingsRow stay generic: it renders whatever ReactNode is passed on the right side, just like how the `icon` prop works on the left.
- The completion-icon row becomes `type='info'` (non-pressable, no chevron) with `rightAccessory={<CompletionIconSegment ... />}`.
- This pattern is extensible for future inline controls without touching SettingsRow again.
- The row itself does not need to be pressable or have a haptic handler -- the segmented control handles its own press events.

---

## Step-by-Step Plan

### Step 1: Create `CompletionIconSegment.tsx` (new file, ~55 lines)

**Path:** `src/components/SettingsModal/CompletionIconSegment.tsx`

This is the inline segmented control component. It replaces `CompletionIconPicker.tsx`.

**Responsibilities:**
- Render two small Pressable buttons side-by-side in a pill-shaped container
- Show Link2 and Check icons at 14-16px
- Apply accent background + accent icon color to the selected button
- Apply muted background + secondary color to the unselected button
- Fire haptic feedback (selection) on change
- Call `onSelect` callback with the new value

**Key implementation details:**
- Uses `useThemeColors()` for `colors.primary[700]`, `isDark` branching
- Selected button background: `rgba(52,211,153,0.12)` dark / `rgba(5,150,105,0.08)` light (reuses exact values from existing CompletionIconPicker)
- Unselected button background: `rgba(255,255,255,0.05)` dark / `rgba(0,0,0,0.03)` light
- Container: `flexDirection: 'row'`, `borderRadius: 10`, subtle overall background (`rgba(255,255,255,0.04)` dark / `rgba(0,0,0,0.02)` light)
- Each button: ~32x28px, `borderRadius: 8`, `alignItems: 'center'`, `justifyContent: 'center'`
- Selected icon: `strokeWidth: 2.5`, unselected: `strokeWidth: 2`
- Haptics: `Haptics.selectionAsync()` on press (matching existing `hapticStyle='selection'` pattern)
- Accessibility: `accessibilityRole='radiogroup'` on container, `accessibilityRole='radio'` + `accessibilityState={{ selected }}` on each button

**Props interface:**
```typescript
interface CompletionIconSegmentProps {
  selected: 'chain' | 'checkbox';
  onSelect: (value: 'chain' | 'checkbox') => void;
}
```

**Estimated lines:** ~50-55

### Step 2: Add `rightAccessory` prop to `SettingsRow.tsx`

**Path:** `src/components/SettingsModal/SettingsRow.tsx`

**Changes:**
1. Add `rightAccessory?: ReactNode` to `SettingsRowProps` interface
2. Render `{rightAccessory}` after the label/subtitle `<View>` and before the type-specific right-side content
3. When `rightAccessory` is provided, the row should use `type='info'` behavior (non-pressable wrapper)

This is a minimal change -- just add the prop to the interface (1 line) and add one render line:
```tsx
{rightAccessory ?? null}
```

But this alone does not solve the 188-line problem. See Step 3.

### Step 3: Decompose `SettingsRow.tsx` to get under 100 lines

**Current structure (188 lines):**
- Lines 1-17: Imports
- Lines 19-33: Props interface
- Lines 35-83: Component body (hooks, handlers)  
- Lines 84-172: JSX content block with 4 type-specific right-side branches
- Lines 174-188: Pressable wrapper logic

**Decomposition strategy:** Extract the right-side accessory rendering into a separate file.

**New file: `SettingsRow.accessories.tsx` (~45 lines)**

Path: `src/components/SettingsModal/SettingsRow.accessories.tsx`

This file exports a single component `SettingsRowAccessory` that receives the `type`, `value`, `badge`, `colors`, and `themeColors` and returns the appropriate right-side element (Switch, chevron+text, info text, navigation badge+chevron).

```typescript
// Renders the right-side accessory based on row type
export function SettingsRowAccessory({ type, value, badge, colors, themeColors, label, handleToggle }: AccessoryProps) {
  switch (type) {
    case 'toggle': return <Switch ... />;
    case 'selection': return <View>...chevron+text...</View>;
    case 'info': return typeof value === 'string' ? <Text>...</Text> : null;
    case 'navigation': return <View>...badge+chevron...</View>;
    default: return null;
  }
}
```

**New file: `SettingsRow.types.ts` (~20 lines)**

Path: `src/components/SettingsModal/SettingsRow.types.ts`

Extract the `SettingsRowProps` interface here.

**Resulting `SettingsRow.tsx`:** ~75-85 lines
- Imports (8-10 lines)
- Component function with hooks/handlers (20 lines)  
- JSX: icon, label/subtitle, `{rightAccessory ?? <SettingsRowAccessory ... />}`, pulse overlay (30-35 lines)
- Pressable wrapper (10 lines)

### Step 4: Update `SettingsContent.tsx`

**Path:** `src/components/SettingsModal/SettingsContent.tsx`

**Changes:**

1. **Remove** `import { CompletionIconPicker } from './CompletionIconPicker'`
2. **Add** `import { CompletionIconSegment } from './CompletionIconSegment'`
3. **Remove** the `useState` for `showCompletionIconPicker` (lines 49-51)
4. **Replace** the completion icon SettingsRow block (lines 125-153) with:

```tsx
<SettingsRow
  highContrastMode={hc}
  icon={
    p.habitCompletionIcon === 'checkbox' ? (
      <Check color={settingsIcons.checkbox.icon} size={16} />
    ) : (
      <Link2 color={settingsIcons.checkbox.icon} size={16} />
    )
  }
  iconBackgroundColor={settingsIcons.checkbox.bg}
  label='Completion icon'
  subtitle='Choose between checkmark and chain link styles'
  type='info'
  rightAccessory={
    <CompletionIconSegment
      selected={p.habitCompletionIcon}
      onSelect={(v) => void p.onChangeHabitCompletionIcon(v)}
    />
  }
/>
```

Key changes:
- `type` changes from `'selection'` to `'info'` (no chevron, not pressable)
- `showBorder` prop removed (defaults to `true`, no longer conditional on picker visibility)
- `hapticStyle` prop removed (haptics handled inside `CompletionIconSegment`)
- `value` prop removed (no text value displayed -- the segmented control replaces it)
- `onPress` prop removed (no toggle behavior)
- The `{showCompletionIconPicker ? <CompletionIconPicker ... /> : null}` block is deleted entirely

**Net line impact on SettingsContent.tsx:**
- Remove: ~15 lines (useState, conditional rendering, CompletionIconPicker block)
- Add: ~10 lines (rightAccessory JSX)
- Net: ~5 lines shorter (280 -> 275 approx; still has eslint-disable since it is a layout orchestrator file)

### Step 5: Delete `CompletionIconPicker.tsx`

**Path:** `src/components/SettingsModal/CompletionIconPicker.tsx`

This file is only imported in `SettingsContent.tsx` (confirmed via grep). Delete it entirely.

---

## File Change Summary

| File | Action | Before | After (est.) |
|------|--------|--------|-------------|
| `CompletionIconSegment.tsx` | **Create** | -- | ~55 lines |
| `SettingsRow.types.ts` | **Create** | -- | ~20 lines |
| `SettingsRow.accessories.tsx` | **Create** | -- | ~45 lines |
| `SettingsRow.tsx` | **Refactor** | 188 lines | ~80 lines |
| `SettingsContent.tsx` | **Modify** | 285 lines | ~275 lines |
| `CompletionIconPicker.tsx` | **Delete** | 83 lines | -- |
| `SettingsRow.colors.ts` | **No change** | 51 lines | 51 lines |

---

## Design Decisions & Trade-offs

### Why `rightAccessory` over a new `type`?
A new type like `'segmented'` would require SettingsRow to know about completion icons, their options, and selection callbacks. The `rightAccessory` pattern keeps SettingsRow as a generic layout container -- it does not need to understand what the control does, only where to place it.

### Why decompose SettingsRow now?
SettingsRow is already 188 lines with an eslint-disable comment. Adding `rightAccessory` without decomposing would push it further over. The decomposition extracts the right-side rendering branches (which are independent of the layout logic) into `SettingsRow.accessories.tsx`, following the project's established Component Decomposition pattern from `DECOMPOSITION_PATTERNS.md`.

### Why not reuse CompletionIconPicker?
The existing `CompletionIconPicker` is designed as an expanding tray (full-width, with `FadeInDown`/`FadeOutUp` animations, padded to align with the settings row grid). The inline segmented control has fundamentally different layout requirements (~32x28px buttons, no animation, no tray background). Starting fresh in `CompletionIconSegment.tsx` is cleaner than trying to make one component serve both purposes. The color values (accent rgba overlays) are reused directly.

### Why `type='info'` for the row?
Looking at SettingsRow line 175: `if (type === 'toggle' || type === 'info') return content;` -- these types render without the `AnimatedPressable` wrapper. Since the segmented control handles its own touch events, the row itself should not be pressable. `type='info'` is the correct choice; it renders the content without a press wrapper and does not show a chevron.

---

## Potential Challenges

1. **Touch target size**: The 32x28px buttons are small. Ensure `hitSlop` is added to each Pressable inside `CompletionIconSegment` (e.g., `{ top: 6, bottom: 6, left: 4, right: 4 }`) to meet Apple HIG 44pt minimum.

2. **High contrast mode**: The `CompletionIconSegment` should respect `highContrastMode` by using the yellow accent (`#facc15`) instead of the green accent when active. This can be handled by checking `isHighContrastActive` from `useThemeColors()` or by passing a prop.

3. **SettingsRowAccessory coupling**: The extracted `SettingsRowAccessory` component needs `handleToggle` (which uses animated values from the parent). Two approaches:
   - Pass `handleToggle` as a prop (simpler, chosen approach)
   - Move the toggle pulse animation into the accessory (would require the shared value to live there)
   
   Recommendation: Pass `handleToggle` and keep the pulse overlay in `SettingsRow.tsx` since it applies to the entire row background, not just the switch.

4. **`rightAccessory` vs type rendering**: When `rightAccessory` is provided, the type-specific right-side content should NOT also render. The simplest approach: in `SettingsRow`, render `{rightAccessory ?? <SettingsRowAccessory ... />}`. If `rightAccessory` is provided, the default accessory is skipped entirely.

---

## Testing Checklist

- [ ] Tapping Link2 icon selects chain mode, shows accent background on Link2 button
- [ ] Tapping Check icon selects checkbox mode, shows accent background on Check button  
- [ ] Selection fires haptic feedback (selection style)
- [ ] Setting persists after closing and reopening settings
- [ ] Row icon (left side) updates to match selection (Link2 vs Check)
- [ ] Dark mode: correct accent rgba overlays
- [ ] Light mode: correct accent rgba overlays
- [ ] High contrast mode: yellow accent instead of green
- [ ] VoiceOver: radiogroup + radio roles announced correctly
- [ ] No expanding tray appears; interaction is single-tap inline
- [ ] Sort Order row still works as `type='selection'` with chevron
- [ ] All existing SettingsRow types (toggle, navigation, selection, info) still render correctly after decomposition
