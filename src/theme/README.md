# Theme System — Chain Day

Warm-minimal design system: earth-toned neutrals, single forest-green accent,
Literata + DM Sans type pairing. Used on native (StyleSheet tokens) and web
(NativeWind/Tailwind classes backed by `/global.css` CSS variables).

## Architecture

```
Components ──► useThemeColors() (ThemeContext.tsx) ──► lightColors / darkColors (darkColors.ts)
         └──► useAppTheme() (index.ts) ──► extendedTheme (Paper MD3 + custom tokens)
         └──► static tokens: colors/core.ts, typography.ts, spacing.ts, airyScale.ts
```

Web tokens live in exactly one file: `/global.css` (`:root` + `.dark`),
mirrored by `tailwind.config.js` via `hsl(var(--…))`. `src/index.css` is dead — do
not reintroduce it.

## Usage

### Theme-aware colors (recommended)

```tsx
import { useThemeColors } from '@/theme';

function MyCard() {
  const { colors, isDark } = useThemeColors();
  return (
    <View style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Text style={{ color: colors.text.primary }}>Adapts to dark mode</Text>
    </View>
  );
}
```

### Static tokens

```tsx
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.card, // #EDEAE5
    padding: spacing.base, // 16
    borderRadius: borderRadius.card, // 24 (airy)
    ...shadows.card, // warm #2D2A26 shadow
  },
  title: { ...typography.heading3, color: colors.gray[800] },
});
```

### React Native Paper

Paper components inherit the MD3-extended theme from `index.ts`
(`theme.custom.*` carries our tokens):

```tsx
import { useAppTheme } from '@/theme';

const theme = useAppTheme();
theme.custom.colors.primary[600]; // '#059669' — CTA fill
theme.custom.borderRadius.button; // 14 (airy)
```

## Color Roles (semantic.ts)

Role separation is deliberate — do not collapse the greens:

- **Primary/CTA**: `primary.600 #059669` buttons, `primary.700 #047857` text on color
- **Success**: `#15793C` — checkmarks, completions (distinct from primary)
- **Streak**: burnished gold `streak.500 #8B6208` (≤10% visible area)
- **Info**: `#3872B8` · **Warning**: `#9A5504` · **Error**: `#B53030`
- `primary.500 #10B981` is for focus rings / lighter accents, **not** success.

### Key surfaces (light)

| Token                            | Value     | Use                  |
| -------------------------------- | --------- | -------------------- |
| `light.background`               | `#F5F1ED` | App canvas (L0)      |
| `light.card` / `surface`         | `#EDEAE5` | Cards, elevated (L1) |
| `light.cardElevated`             | `#FFFFFF` | Hero/section cards   |
| `light.surfaceMuted` / `gray.50` | `#FAF8F5` | Muted surfaces       |
| `border` / `gray.200`            | `#DDD8D2` | Borders, dividers    |

Dark mode mirrors via `darkColors` (`#111827` canvas, `#1F2937` surface,
`#34D399` brighter primary). Web dark uses the `.dark` block in `/global.css`.

## Typography

Font pairing: **Literata** (display + H1, serif) · **DM Sans** (everything else).
Web loads both from Google Fonts in `/global.css`; native via expo-font.

| Style       | Size/Weight         | Use                      |
| ----------- | ------------------- | ------------------------ |
| `display`   | 34 bold Literata    | Onboarding headlines     |
| `heading1`  | 22 bold Literata    | Screen titles            |
| `heading2`  | 22 semibold DM Sans | Section titles           |
| `heading3`  | 20 semibold DM Sans | Card titles, habit names |
| `body`      | 17 regular          | Primary text             |
| `bodySmall` | 14 regular          | Secondary info           |
| `caption`   | 13 medium           | Meta, timestamps         |
| `tabBar`    | 10 medium           | Tab labels               |

Dynamic Type: body text is globally capped (`MAX_FONT_SIZE_MULTIPLIER_BODY` in
`App.tsx`); use `AccessibleText` where chrome needs a stricter cap.

## Spacing, Radius, Shadows

8px grid: `xs 4 · sm 8 · md 12 · base 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64`.

Radii follow **airyScale.ts** (`AIRY_SCALE = true`, mirrored in
`tailwind.config.js`):

| Token          | Value | Use            |
| -------------- | ----- | -------------- |
| `chipRadius`   | 10    | Chips, badges  |
| `buttonRadius` | 14    | Buttons        |
| `cardRadius`   | 24    | Cards          |
| `modalRadius`  | 28    | Modals, sheets |

Shadows are warm-toned (`#2D2A26`): `subtle`, `card`, `floatingActionButton`,
`modal`, `alert`.

## Files

```
src/theme/
├── ThemeContext.tsx    # Dark/light provider, useThemeColors()
├── index.ts            # Paper MD3 theme + extendedTheme + useAppTheme()
├── colors/
│   ├── core.ts         # Raw palette (gray/primary/streak/strength/…)
│   ├── semantic.ts     # warmPalette aliases + role separation docs
│   └── index.ts        # Barrel export
├── darkColors.ts       # lightColors + darkColors + SemanticColors
├── typography.ts       # Type scale (Literata/DM Sans)
├── spacing.ts          # Spacing grid, borderRadius, shadows
├── airyScale.ts        # Airy radii/rows scale (SHIP TARGET: full airy)
├── animations.ts       # Durations, easing tokens, springs
├── iconSizes.ts        # Icon size tokens
├── milestone-colors.ts # Achievement badge colors
└── settingsColors.ts   # Settings-screen colors
```

## Accessibility

All text/background pairs target WCAG 2.1 AA (≥4.5:1 normal, ≥3:1 large).
`primary.500` and `warning` tints are decorative-only — use `primary.700` /
darker variants for text. Pair strength colors with emoji (never color alone).

---

**Version:** 2.0 — reflects warm-minimal system (supersedes v1.0 SF Pro / RN-Paper-only docs)
