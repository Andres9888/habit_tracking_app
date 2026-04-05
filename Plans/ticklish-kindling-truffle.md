# Fix Completion Icon Switch — Inline Segmented Control

## Context

The completion icon setting (chain vs checkmark) currently uses a `type='selection'` row that expands an animated tray (`CompletionIconPicker`) below it — a pattern cloned from `SoundPicker`. For a binary choice, this feels visually heavy and unnecessary. The SoundPicker tray is justified (3 options + audio preview); 2 icons don't need a full expanding tray.

**Goal:** Replace the expanding tray with a compact inline segmented control that sits directly in the settings row.

## Design

Two small icon-only buttons (Link2 / Check) side-by-side in a rounded pill container, positioned where the chevron+text currently sits (right side of the row). One tap switches selection — no tray expansion needed.

- Selected: accent bg (`rgba(52,211,153,0.12)` dark / `rgba(5,150,105,0.08)` light), accent icon color, strokeWidth 2.5
- Unselected: muted bg (`rgba(255,255,255,0.05)` dark / `rgba(0,0,0,0.03)` light), secondary text color, strokeWidth 2
- Selection haptic on change
- High contrast mode: yellow (`#facc15`) accent

## Plan

### 1. Repurpose `CompletionIconPicker.tsx` → inline segmented control (~40 lines)

Strip the expanding tray wrapper, keep the icon options logic. New component renders:
- A `View` container with `flex-row`, rounded pill shape, subtle border
- Two `Pressable` icon buttons (~32x28px) with `hitSlop` for 44pt touch targets
- Haptic feedback via `Haptics.selectionAsync()` on change
- Accessibility: `accessibilityRole='radiogroup'` container, individual radio buttons

### 2. Add `rightAccessory` prop to `SettingsRow`

Add `rightAccessory?: ReactNode` to `SettingsRowProps` (line 19 of `SettingsRow.tsx`). When provided, render it instead of the default type-based right-side content (Switch / chevron+text / badge). This is the cleanest approach — keeps SettingsRow generic.

Render logic change at line ~123:
```
{rightAccessory ?? (type === 'toggle' ? <Switch .../> : ...)}
```

### 3. Update `SettingsContent.tsx`

- Remove `showCompletionIconPicker` state (line 49-51)
- Remove `CompletionIconPicker` conditional render block (lines 145-153)
- Change the completion icon row to `type='info'` with `rightAccessory={<CompletionIconPicker .../>}`
- The row icon on the left stays dynamic (Link2 or Check based on selection)

## Files

| File | Action |
|------|--------|
| `src/components/SettingsModal/CompletionIconPicker.tsx` | Rewrite as inline segmented control |
| `src/components/SettingsModal/SettingsRow.tsx` | Add `rightAccessory?: ReactNode` prop |
| `src/components/SettingsModal/SettingsContent.tsx` | Simplify completion icon row |

## Verification

1. `npx tsc --noEmit` — no type errors
2. `npm run lint` — passes (all files ≤100 lines)
3. Visual check: completion icon row shows inline pill with two icons, tapping switches selection with haptic, no expanding tray
4. Both dark and light mode render correct accent/muted colors
5. High contrast mode shows yellow accent
6. Settings test: `npx jest SettingsModal.test` passes
