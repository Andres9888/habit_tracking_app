# Habit Detail — Unify Top Bar With Sticky Tabs Container

## Context

On the habit details screen, the top bar (`ScreenHeader`) is rendered with `variant='transparent'`, so it shows the modal's `LinearGradient` through it. As soon as the user scrolls past the hero, the `DetailViewTabs` becomes a sticky bar directly underneath the header with a **solid** `colors.background`. This creates a visible seam — the transparent header (showing a gradient that has begun transitioning toward the middle stop) sits above a solid-color sticky bar of a slightly different shade. Title text on the transparent header also reads less cleanly against scrolling content.

Goal: the top bar should match the container it sits in / over. Concretely, header background should match the sticky tabs (`colors.background`) so header + tabs form one unified top block. Title remains readable in all scroll states.

## Approach

Make the `ScreenHeader` background solid `colors.background` on this screen — no scroll-driven animation, no fade.

**Why solid (not a fade-in driven by scroll):**

- The `LinearGradient` uses `colors=[background, surface/gray-50, background]` with `locations=[0, 0.5, 1]`. At the top of the screen the gradient is already at `colors.background`, and the header only spans ~75px down from the top — well before the gradient noticeably transitions. So a solid `colors.background` header looks essentially identical to the current transparent state at scroll=0.
- At scroll>0 it now perfectly matches the sticky `DetailViewTabs`, eliminating the seam.
- No scroll listener / interpolation for header background = no flicker, no perf cost, no animation timing to tune. Title fade-in (already implemented via `titleVisible={isTitlePinned}`) keeps the "pin" affordance.

**Scope confined to the habit detail screen.** `ScreenHeader` is shared, so we do **not** modify its existing `transparent` or `default` variants. Instead we pass an explicit `backgroundColor` override (or use the existing default variant with a themed bg) on the habit detail screen only.

## Implementation

**File 1: `src/screens/HabitDetailScreen/HabitDetailScreen.tsx`** (line 90–105)

Change the `ScreenHeader` call so its background is themed `colors.background` instead of `transparent`:

- Drop `variant='transparent'`.
- Pass the screen's themed `colors.background` to the header. Since `ScreenHeader` currently only exposes `variant: 'default' | 'transparent'` and reads colors from `useThemeColors()` internally for text/icons but not for its container background, we have two clean options — pick the one that matches existing convention in this codebase:

  - **Option A (preferred, smaller diff):** Use `variant='default'`. Inspect `ScreenHeader.styles.ts` line 1–37 — `styles.container` currently has no `backgroundColor`, so the default variant inherits whatever is behind it (i.e., the gradient). To make it solid we need a themed background. Add a `containerStyle?: StyleProp<ViewStyle>` prop to `ScreenHeader` (typed-through, optional, additive — does not change any existing call site) and pass `containerStyle={{ backgroundColor: colors.background }}` from `HabitDetailScreen`. `colors` is already pulled in via `useThemeColors()` higher up; we'll just keep `isDark` and add `colors` from that destructure.

  - **Option B:** Wrap `ScreenHeader` in a `<View style={{ backgroundColor: colors.background }}>` inside the LinearGradient. Zero changes to the shared `ScreenHeader`. Slightly less clean (extra wrapper) but truly local.

  Recommend **Option A** — it follows the existing pattern of `titleStyle` being a passthrough style override and keeps the structure flat. If anything else in `ScreenHeader.styles.ts` needs a tweak we'll see it during edit.

**Critical files:**

- `src/screens/HabitDetailScreen/HabitDetailScreen.tsx` — call-site change (1 prop swap + 1 prop add).
- `src/components/ScreenHeader/ScreenHeader.types.ts` — add optional `containerStyle?: StyleProp<ViewStyle>`.
- `src/components/ScreenHeader/ScreenHeader.tsx` — accept `containerStyle`, append to the existing `style` array at line 74–78.

**Out of scope (do not change):**

- `DetailViewTabs` background, `LinearGradient` stops, `useDetailScrollSpy` title-pinning logic. Title fade-in stays as-is — only the bar background changes.
- Other consumers of `ScreenHeader` — the new prop is optional and additive.

## Verification

1. Build typechecks (`npm run typecheck` or equivalent).
2. Open the habit detail screen for any habit in light mode:
   - At scroll=0: header should look ~indistinguishable from current (gradient starts at `colors.background`).
   - Scroll until the tabs pin: header and tabs should be a single visually unified bar with no seam.
3. Repeat in dark mode.
4. Title fade-in on scroll past the hero still works (handled by existing `isTitlePinned`).
5. Edit button (right action) and Close icon (left action) still legible in both themes.
6. Spot-check one other screen using `ScreenHeader` (e.g., a settings screen) — appearance unchanged since we didn't pass `containerStyle`.
