# Style Conventions

How to style and compose components in the Chain Day codebase. Adopted 2026-04-25 from `architectural_decisions_1.html` (Wave 3.1, 3.3, 3.4, 1.2).

---

## 1 · Button — use the unified primitive

**For all new code**, use `src/components/Button/Button.tsx`. Do not instantiate `Pressable` or `TouchableOpacity` for new tappable elements.

```tsx
// Use this
import Button from '@/components/Button/Button';

<Button variant="primary" size="medium" onPress={...}>Continue</Button>

// Not this (in new code)
<Pressable
  className='px-4 py-3 rounded-lg bg-primary'
  onPress={...}
>
  <Text>Continue</Text>
</Pressable>
```

**Existing inline `Pressable` sites (290) stay** — they migrate when files are touched for unrelated reasons. Don't bulk-migrate.

**Exception list** (allowed to keep custom `Pressable` implementation):
- `src/components/QuickCompleteButton/` — bespoke completion animation
- `src/components/SwipeableActionButton/` — gesture-driven
- `src/components/ForceUpdateButton/` — non-standard layout
- Drag-and-drop interactions inside `src/features/habits/` (gesture handlers)
- Modal backdrops + dismissal regions

---

## 2 · Animation — use Reanimated for new code

For all new animations, use `react-native-reanimated`. Do not write `new Animated.Value(...)` in new code.

```tsx
// Use this
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { springs } from '@/theme/animations';

const scale = useSharedValue(1);
scale.value = withSpring(0.95, springs.standard);

// Not this (in new code)
const scale = useRef(new Animated.Value(1)).current;
Animated.spring(scale, { friction: 8, tension: 200, toValue: 0.95 }).start();
```

**Existing `Animated.Value` sites (31) stay** — migrate organically when files are touched.

**Spring values: use presets first.** The canonical spring is `springs.standard` (`damping: 18, stiffness: 150`). Specialized presets exist for sheets, gestures, exits, celebrations. Avoid raw `damping/stiffness` numbers in new code; if a preset doesn't fit, spread one and override:

```tsx
withSpring(value, { ...springs.gentle, damping: 12 })  // OK — explicitly derived
withSpring(value, { damping: 12, stiffness: 80 })       // Avoid — bare numbers
```

---

## 3 · NativeWind vs StyleSheet — the boundary

This codebase uses both NativeWind (`className=`) and StyleSheet. Both are intentional. The boundary:

| Use NativeWind `className` for | Use StyleSheet + theme tokens for |
|--------------------------------|------------------------------------|
| Layout (flex, grid, gap, position) | Colors (background, text, border) |
| Padding, margin, sizing | Typography (fontSize, fontWeight, fontFamily) |
| Tailwind utilities (rounded-md, shadow-sm) | Component-specific shadows (`shadows.*`) |
| Conditional class composition | Border radius (`borderRadius.*`) |
| | Anything that interacts with dark mode |

**Theme tokens always win** — when in doubt, reach for `useThemeColors()` or import from `@/theme/*`.

```tsx
// Layout via className, colors via theme
<View
  className='flex-row items-center gap-3 px-4 py-3'
  style={{ backgroundColor: colors.surface, borderRadius: borderRadius.medium }}
/>

// Avoid hardcoding theme-relevant values in className
<View className='bg-stone-200 rounded-md px-4'>  // ❌ stone-200 won't adapt to dark mode
```

---

## 4 · Shadows — use tokens in new code

Use `shadows.*` from `@/theme/spacing` for new component shadows:

```tsx
import { shadows } from '@/theme/spacing';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.large,
    ...shadows.card,
  },
});
```

**5-level system** (`@/theme/spacing.ts`):

| Token | Use case |
|-------|----------|
| `shadows.subtle` | Chips, badges, hover surfaces |
| `shadows.card` | Cards at rest |
| `shadows.floatingActionButton` | FAB, pressed cards |
| `shadows.modal` | Modals, bottom sheets |
| `shadows.alert` | Alerts, top-most overlays |

**Existing inline shadows (~447 files)** stay — they often encode bespoke visual hierarchy that the 5 presets can't capture. Don't bulk-normalize. If you touch a file for unrelated reasons and the inline shadow exactly matches a preset, swap to the token.

---

## 5 · EmptyState — canonical primitive needs a `compact` variant first

**Status: deferred** (Wave 3.2 from the architectural decisions doc).

The canonical `src/components/EmptyState/EmptyState.tsx` is sized for full-screen "nothing here" surfaces (icon 64px, `flex: 1`, `paddingVertical: 48`, headline2). Most of the 10 migration candidates (PausedEmptyState, ArchivedHabitsModal, DayHabitsBottomSheet, SmartSuggestions, etc.) live inside modals or sections where 64px icons and full-flex layout are too large.

**Before migrating, the canonical needs a `compact` variant** that:

- Drops `flex: 1` (lets parent control sizing)
- Smaller icon (34–40px)
- Reduced padding (`paddingVertical: 24` instead of 48)
- Uses `typography.heading1` instead of `heading2` (or accepts `headlineVariant` prop)

Once that exists, the 10 in-modal empty states can be safely migrated. Until then, leave them.

The 7 chart-specific empty states stay custom regardless — chart geometry is too coupled.

---

## 6 · When in doubt

- Read the [canonical token showcase](.superdesign/design_iterations/design_system_showcase_1.html) for visual reference.
- Theme tokens live in `src/theme/*` — never duplicate values inline.
- Run `npm run lint:max-lines` before committing if you've touched a file > 100 lines.

---

## Future-work notes

These conventions should eventually become enforced ESLint rules:

- `no-restricted-syntax` for `new Animated.Value(...)` (warning level, eventually error)
- `no-restricted-syntax` for raw `Pressable` in `app/` and `screens/` (with allowlist)
- Custom rule warning on `className` containing `text-stone-*`/`bg-stone-*`/etc. (use theme tokens instead)

Implementation tracked in: TBD (open issue when ready).
