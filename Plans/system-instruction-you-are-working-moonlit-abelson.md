# Plan: Center Settings Row Icons Vertically

## Context

On the Settings page, each row has a colored icon badge (40×40) on the left, a title + optional subtitle in the middle, and a control on the right. Currently the icon badge is top-aligned with the title line whenever a subtitle exists, which looks unbalanced in the screenshot the user shared (e.g., "Compact habit cards / Fit more on screen", "Gradient streak fill / Color fills active streak cells"). The user wants the icon badge visually centered against the full text block (title + subtitle).

## Change

**File:** `src/components/SettingsModal/SettingsRow.tsx:94`

The row container currently switches alignment based on whether a subtitle exists:

```tsx
className={`flex-row ${subtitle ? 'items-start' : 'items-center'} px-4 py-4 ${showBorder ? 'border-b' : ''}`}
```

Replace with unconditional center alignment:

```tsx
className={`flex-row items-center px-4 py-4 ${showBorder ? 'border-b' : ''}`}
```

That's the only change. The icon tile itself (`SettingsRow.tsx:102-111`) keeps its internal `items-center justify-center`; the text column (`flex-1`, `SettingsRow.tsx:112`) keeps its stacked title/subtitle. Because the row is a flex-row, `items-center` on the parent will center the icon tile against the combined height of the text column.

## Why This Works

- The text column (`<View className='flex-1'>`) naturally sizes to `title height + 4px margin-top + subtitle height`.
- The icon tile is fixed at 40×40 (`h-10 w-10`).
- With `items-center`, flexbox centers both children on the row's cross axis — for two-line text rows (~44–52px tall) the 40px tile sits with ~2–6px of space top and bottom, which is the centered look the user wants.
- For single-line rows (no subtitle) behavior is unchanged — `items-center` already matched the existing branch.

## Risks / Considerations

- Rows with unusually tall right-side accessories (segmented controls, the "Completion sound" Ding/Pop/Rise picker) already use `rightAccessory`, which is rendered as a sibling and will also center. Spot-check that this still looks fine.
- The `navigation` type with a multi-line label (`numberOfLines={2}`) could in rare cases make the text column taller than the icon; centering is still the desired behavior there.

## Verification

1. Start the app (`npm run ios` or the project's standard dev command).
2. Open Settings modal.
3. Confirm icons are visually centered against the title+subtitle block for:
   - Compact habit cards (toggle + subtitle)
   - Gradient streak fill (toggle + subtitle)
   - Default growth icons (navigation + subtitle + emoji row accessory)
   - Sort order (selection, no subtitle — should be unchanged)
   - Completion sound (toggle + subtitle + segmented accessory below)
4. Compare against the screenshot at `.context/attachments/simulator_screenshot_94E048CB-29B4-4A98-A853-EE7DF46C1E05.png` — icons should now appear mid-text, not top-aligned.
5. Run `npm run lint` to confirm no ESLint regressions on the edited file.

## Critical Files

- `src/components/SettingsModal/SettingsRow.tsx` — single line change at line 94.
