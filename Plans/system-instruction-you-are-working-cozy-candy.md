# Add scroll affordance to growth-icon preset chip row

## Context

In **Settings → Appearance → "Default growth icons"**, a horizontally scrollable row of 5 preset chips (Plants, Fitness, Space, Mind, Fire) is rendered by `ProgressEmojiPresetRow`. With the current chip widths only two chips fit on a standard phone viewport; the third peeks just a few pixels past the right edge with no visual treatment, so it's easy to miss that the row scrolls.

User feedback on the screenshot (`.context/attachments/simulator_screenshot_D9831902-0042-429A-80F7-FC910A43CB3B.png`):

> "hard to tell you can scroll right for more"

The iOS native scroll indicator isn't a fix — it only appears mid-scroll, exactly when the user has already discovered the scrollability.

The app already has a proven edge-fade pattern used in the emoji picker's category pill row (`CategoryPills.tsx`) backed by a reusable `useHorizontalScrollFade` hook. Reusing that gives us an instantly familiar, consistent cue.

## Recommended approach

Add a theme-aware right-edge fade (and matching left-edge fade once scrolled) to `ProgressEmojiPresetRow`, using the existing hook.

### Files to modify

- `src/components/ProgressEmojiPicker/ProgressEmojiPresetRow.tsx` — the only file that changes

### Files to reuse (no changes)

- `src/components/EmojiPickerV2/useHorizontalScrollFade.ts` — scroll-position tracker already returning `showLeftFade` / `showRightFade` / `handleScroll`
- `src/components/EmojiPickerV2/CategoryPills.tsx` — reference implementation showing the exact LinearGradient pattern and theme-aware `fadeColors`
- `expo-linear-gradient` — already a project dependency (used by CategoryPills, QuickFilterChips, etc.)

### Change outline

In `ProgressEmojiPresetRow.tsx`:

1. Wrap the existing `ScrollView` in a `View` with `position: 'relative'`.
2. Call `useHorizontalScrollFade()` and pass `onScroll={handleScroll}` + `scrollEventThrottle={16}` to the `ScrollView`.
3. Conditionally render two `LinearGradient` overlays with `pointerEvents="none"` absolutely positioned at the left and right edges of the wrapper.
4. Compute `fadeColors` from `useThemeColors().isDark` matching the warm stone L1 surface:
   - light: `['rgba(237,234,229,1)', 'rgba(237,234,229,0)']`
   - dark:  `['rgba(31,41,55,1)', 'rgba(31,41,55,0)']`
   (Identical to `CategoryPills` — the preset row sits on the same `themeColors.surface` background. The chips themselves use `themeColors.surface` too, so the fade blends cleanly behind inactive chips but still visibly softens the active green chip when it's partially off-screen.)
5. Use a **narrower fade width** than CategoryPills' 48px, since this row's chips are smaller and the expanded panel already has 16px horizontal padding. Target `FADE_WIDTH = 28` — enough to clearly soften a peeking chip without eating half of it.

### Why this approach (vs alternatives briefly considered)

- **Flip `showsHorizontalScrollIndicator` to true** — rejected. On iOS this only shows during active scrolling, which is after the discovery problem is already solved. Doesn't address the static/first-view case.
- **Shrink chips so 3+ fit with a clearer peek** — rejected. Brittle across device widths and chip label lengths; still fails once a 5th preset exists.
- **Chevron arrow indicator** — rejected. Introduces a new visual pattern not used elsewhere; the fade gradient is the established idiom in this codebase.

## Verification

- `npx tsc --noEmit` — no type errors.
- `npx eslint src/components/ProgressEmojiPicker/ProgressEmojiPresetRow.tsx` — clean, file stays ≤100 lines per project rule.
- Simulator check (iOS): open **Settings → Appearance → Default growth icons → Customize**. Confirm:
  - On first render, a right-edge fade is visible; no left fade.
  - Scrolling right reveals Space / Mind / Fire chips; left fade appears once scrolled; right fade disappears at the end.
  - Screenshot before/after and compare against the user's screenshot at `.context/attachments/simulator_screenshot_D9831902-0042-429A-80F7-FC910A43CB3B.png` to confirm the affordance is now obvious.
- Dark mode: toggle dark mode and confirm the fade color matches the surrounding panel (no visible seam).
