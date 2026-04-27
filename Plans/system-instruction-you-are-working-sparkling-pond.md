# Make Templates Header Fit on iPhone 16 Pro Max

## Context

The Templates browse screen renders the header `"What do you want to work on?"` but it truncates to `"What do you want to w..."` on iPhone 16 Pro Max (per attached screenshot). The user wants the existing copy preserved — fix the layout so the full title fits.

## Root cause

- `ScreenHeader` uses `numberOfLines={1}` on the title (`src/components/ScreenHeader/ScreenHeader.tsx:83` and `:93`).
- `MainBrowseView` passes `leftAction={null}` and no `rightAction`, so the no-navigation branch (`:91-99`) renders the title with `titleLeft` style: `typography.heading1` (22px bold) + `paddingRight: 52`.
- `TemplatesModalSection` overlays an absolutely-positioned 44×44 `ModalCloseButton` at `right: 16, top: insets.top + 8` on top of the screen — so the title can't simply expand into the right edge.
- At 22px bold with the right-side reservation, "What do you want to work on?" (28 chars) doesn't fit on one line at 430pt width.

## Fix (surgical)

Allow the title to wrap to 2 lines, scoped to this screen only — no global behavior change.

### 1. `src/components/ScreenHeader/ScreenHeader.types.ts`

Add optional prop:
```ts
titleNumberOfLines?: number;
```

### 2. `src/components/ScreenHeader/ScreenHeader.tsx`

- Destructure `titleNumberOfLines = 1` in the props.
- Replace both hardcoded `numberOfLines={1}` (lines 83 and 93) with `numberOfLines={titleNumberOfLines}`.

### 3. `src/screens/TemplatesScreen/views/MainBrowseView.tsx`

On the `<ScreenHeader>` at line 43, pass:
```tsx
titleNumberOfLines={2}
```

That's it. No copy changes, no style changes to other screens, no overlap with the X close-button overlay (the existing `paddingRight: 52` on `titleLeft` already keeps the wrapped lines clear of the 44×44 X chip).

## Critical files

- `src/components/ScreenHeader/ScreenHeader.tsx` — add prop, replace 2 occurrences of `numberOfLines={1}`
- `src/components/ScreenHeader/ScreenHeader.types.ts` — add `titleNumberOfLines?: number`
- `src/screens/TemplatesScreen/views/MainBrowseView.tsx` — pass `titleNumberOfLines={2}`

## Verification

1. Run app on iPhone 16 Pro Max simulator (or matching device frame): open Habit Library → confirm header reads `"What do you want to work on?"` in full, wrapping to 2 lines if needed, with no `…` truncation. Subtitle and search bar remain visible below.
2. Check a few other screens that use `ScreenHeader` to confirm unchanged single-line behavior (default still `numberOfLines={1}`):
   - `HabitDetailScreen`, `CharacterScreen`, `AnalyticsScreen`, `SeeAllView`, `CategoryHero`, `SettingsHeader`, `AccountPage`, `SortPicker`.
3. Run existing tests: `npm test -- ScreenHeader` and `npm test -- MainBrowseView` (if present) — should still pass.
4. Type check: `npx tsc --noEmit`.
