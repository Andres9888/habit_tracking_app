# Design System

This document details the design tokens used throughout Chain Day, including colors, typography, spacing, shadows, and animations.

## Overview

Chain Day uses a warm, minimal aesthetic with earth-toned colors and a single saturated accent color (forest green). The design system is built on an 8px grid and follows WCAG 2.1 Level AA accessibility guidelines.

## Color Palette

### Primary Colors (Forest Green)

The primary color is used for buttons, CTAs, success indicators, and focus rings:

| Token | Value | Usage |
|-------|-------|-------|
| `primary.100` | `#D4F0E2` | Light tinted backgrounds |
| `primary.300` | `#6FCF9A` | Decorative, confetti |
| `primary.400` | `#3FBD7E` | Lighter, hover states |
| `primary.500` | `#2A9D6E` | Success indicators, focus rings |
| `primary.600` | `#22805A` | Buttons, CTA fills |
| `primary.700` | `#1B6B4A` | High-contrast text on colored surfaces |

### Secondary Colors (Trust & Calm)

| Token | Value | Usage |
|-------|-------|-------|
| `secondary.100` | `#dbeafe` | Light backgrounds |
| `secondary.400` | `#60A5FA` | Accents |
| `secondary.500` | `#3B82F6` | Links, interactive elements |
| `secondary.600` | `#2563EB` | Buttons |

### Grays (Warm Stone)

| Token | Value | Usage |
|-------|-------|-------|
| `gray.50` | `#FAF8F5` | Muted surfaces |
| `gray.100` | `#F5F1ED` | Background |
| `gray.200` | `#DDD8D2` | Borders, dividers |
| `gray.300` | `#C4BFB7` | Disabled elements |
| `gray.400` | `#9C958D` | Placeholder text, tertiary |
| `gray.500` | `#6B6560` | Secondary text |
| `gray.600` | `#524D47` | Body text |
| `gray.700` | `#3D3833` | Headings |
| `gray.800` | `#2D2A26` | Primary text |
| `gray.900` | `#1A1816` | Pure black alternative |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `error` | `#C93B3B` | Error states |
| `success` | `#22c55e` | Success states |
| `warning` | `#D97706` | Warning states |
| `warningLight` | `#FEF3CD` | Warning backgrounds |
| `info` | `#3872B8` | Informational states |

### Streak Colors (Burnished Gold)

Used for streak indicators (visible area ≤10%):

| Token | Value | Usage |
|-------|-------|-------|
| `streak.100` | `#FEF3CD` | Streak background tint |
| `streak.300` | `#E8B94D` | Light gold accents |
| `streak.500` | `#C4890A` | Primary streak color |
| `streak.600` | `#B47D0A` | Streak badges, flames |
| `streak.700` | `#946508` | Dark gold, high-contrast text |

### Premium Colors

| Token | Value | Usage |
|-------|-------|-------|
| `premium.400` | `#9B7AD8` | Premium features |
| `premium.500` | `#8563C7` | Premium buttons |
| `premium.600` | `#6D3AC7` | Premium active |
| `premium.700` | `#5A2DA8` | Premium text |

### Habit Strength Colors

| Level | Color | Light Variant |
|-------|-------|---------------|
| Automatic (80-100%) | `#22805A` | `#D4F0E2` |
| Building (60-79%) | `#16a34a` | `#dcfce7` |
| Developing (40-59%) | `#0d9488` | `#ccfbf1` |
| Starting (20-39%) | `#65a30d` | `#ecfccb` |
| Strong (>100 days) | `#0891b2` | `#cffafe` |

### Backgrounds & Surfaces

| Token | Value | Description |
|-------|-------|--------------|
| `light.background` | `#F5F1ED` | Canvas (L0) — warm parchment |
| `light.card` | `#EDEAE5` | Surface (L1) — subtle lift |
| `light.gradientMid` | `#F0EDE8` | Depth gradient midpoint |
| `light.surface` | `#EDEAE5` | Elevated elements (L1) |
| `light.surfaceMuted` | `#FAF8F5` | Subtle section differentiation |

### Color Usage Guidelines

- **Text**: Use `gray.700` (headings), `gray.600` (body), `gray.500` (secondary)
- **Interactive**: Use `primary.600` for buttons, `primary.500` for focus states
- **Success**: Use `primary.500` or `success` for positive feedback
- **Error**: Use `error` for errors, `error` on light backgrounds
- **Streaks**: Use `streak.500` sparingly (≤10% of visible area)

## Typography

### Font Families

| Family | Usage | Fallbacks |
|--------|-------|-----------|
| `Literata` (serif) | Display/H1 headings | SF Pro Display (iOS), Roboto (Android) |
| `DMSans` (sans-serif) | Body, UI, H2/H3 | SF Pro Text (iOS), Roboto (Android) |
| `JetBrainsMono` | Numbers, percentages, data | System monospace |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Captions, labels |
| Semibold | 600 | Headings, buttons |
| Bold | 700 | Display text, emphasis |

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|--------------|----------------|
| `displayLarge` | 38px | Bold | 45px | -0.95 |
| `heading1` | 30px | Bold | 36px | -0.6 |
| `heading2` | 24px | Semibold | 30px | -0.36 |
| `heading3` | 20px | Semibold | 26px | -0.2 |
| `body` | 16px | Regular | 24px | 0 |
| `bodySmall` | 14px | Regular | 21px | 0 |
| `button` | 16px | Semibold | 24px | 0.08 |
| `caption` | 12px | Medium | 18px | 0.12 |
| `tabBar` | 10px | Medium | 12px | 0.1 |
| `monospace` | 16px | Regular | 24px | 0 |

### Usage Example

```typescript
import { typography, textStyle } from '@/theme';

// Using the typography object
<Text style={typography.heading2}>Section Title</Text>

// Using textStyle helper with color
<Text style={textStyle('body', colors.gray[600])}>Body text</Text>

// In components using React Native Paper
<Text variant="titleLarge">Title</Text>
```

## Spacing System

### Base Scale (8px Grid)

All spacing values are multiples of 4px:

| Token | Value | Usage |
|-------|-------|-------|
| `spacing.xs` | 4px | Tight spacing, icon gaps |
| `spacing.sm` | 8px | Component internal spacing |
| `spacing.md` | 12px | Between related elements |
| `spacing.base` | 16px | Standard spacing |
| `spacing.lg` | 24px | Section spacing |
| `spacing.xl` | 32px | Large gaps |
| `spacing.2xl` | 48px | Major sections |
| `spacing.3xl` | 64px | Page margins |

### Component Spacing

| Component | Height | Horizontal Padding |
|-----------|--------|-------------------|
| Button | 44px | 24px |
| Input | 44px | 16px |
| List Item | 72px | 16px |
| Card | — | 16px |
| Tab Bar | 49px | — |

### Screen Margins

```typescript
export const screenMargins = {
  horizontal: 16,  // spacing.base
  verticalBottom: 16,
  verticalTop: 8,
};
```

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `borderRadius.xs` | 4px | Progress bars, dots |
| `borderRadius.small` | 8px | Chips, badges |
| `borderRadius.medium` | 12px | Buttons, tags |
| `borderRadius.large` | 16px | Cards, containers |
| `borderRadius.xl` | 24px | Modals, bottom sheets |
| `borderRadius.full` | 9999px | Pills, avatars, icon buttons |

### Usage

```typescript
import { borderRadius } from '@/theme';

// Cards
<View style={{ borderRadius: borderRadius.large }}>

// Buttons
<TouchableOpacity style={{ borderRadius: borderRadius.medium }}>

// Pills
<View style={{ borderRadius: borderRadius.full }}>
```

## Shadows

Shadows use the primary text color (`#2D2A26`) with reduced opacity for subtle depth:

| Level | Token | Elevation | Offset | Opacity | Radius |
|-------|-------|-----------|--------|---------|--------|
| 0 | `subtle` | 1 | 1px | 0.04 | 3px |
| 1 | `card` | 3 | 2px | 0.06 | 8px |
| 2 | `floatingActionButton` | 6 | 4px | 0.08 | 16px |
| 3 | `modal` | 8 | 8px | 0.10 | 24px |
| 4 | `alert` | 12 | 12px | 0.14 | 32px |

### Usage

```typescript
import { shadows } from '@/theme';

// Card at rest
<View style={shadows.card}>

// Floating action button
<View style={shadows.floatingActionButton}>

// Modal
<View style={shadows.modal}>
```

## Animation

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `instant` | 100ms | Button presses, toggles |
| `quick` | 150ms | Exit animations, small fades |
| `reveal` | 180ms | Quick fades |
| `standard` | 200ms | Standard transitions |
| `enter` | 280ms | Screen/card entry |
| `moderate` | 300ms | Page transitions |
| `emphasis` | 400ms | Complex sequences |
| `progress` | 800ms | Progress bar fills |
| `celebration` | 3000ms | Confetti, particles |
| `stagger` | 60ms | Stagger delay per item |
| `toast` | 5000ms | Toast auto-dismiss |

### Spring Presets

| Preset | Damping | Stiffness | Usage |
|--------|---------|-----------|-------|
| `button` | 18 | 240 | Button press/release |
| `micro` | 15 | 400 | Micro-interactions |
| `snappy` | 15 | 150 | Quick response |
| `gentle` | 20 | 100 | Smooth reveals |
| `sheet` | 20 | 200 | Modal/sheet presentations |
| `bottomSheet` | 26 | 300 | Bottom sheet |
| `gesture` | 20 | 450 | Direct manipulation |
| `exit` | 26 | 420 | Fast dismissal |
| `pulse` | 12 | 250 | Attention pulse |
| `bouncy` | 10 | 180 | Celebrations only |

### Easing Presets

```typescript
export const easings = {
  buttonPress: { duration: 100 },
  quick: { duration: 150 },
  standard: { duration: 200 },
  emphasis: { duration: 400 },
};
```

### Animation Guidelines

1. **Entry motion**: fade + translateY, 280ms ease-out
2. **Hierarchy**: 60ms stagger, max 5 items
3. **Feedback**: spring-based, ≤100ms for taps
4. **Max 3 simultaneous** moving elements per viewport
5. **No decorative loops** or idle animations

## Accessibility

### Color Contrast (WCAG 2.1 Level AA)

- Normal text (17pt): 4.5:1 minimum
- Large text (22pt+): 3:1 minimum
- UI components: 3:1 minimum

### Verified Ratios

- ✅ `gray.700` on white: 10.8:1
- ✅ `primary.700` on white: Sufficient for text
- ✅ `gray.600` on white: 8.3:1
- ⚠️ `warning.500` on white: 2.3:1 — Use `warning.700` for text
- ⚠️ `primary.500` on white: 2.9:1 — Use `primary.700` for text

### Touch Targets

- Minimum touch target: 44x44px (Apple HIG)
- Recommended: 48x48px for primary actions
- Tab bar items: 49px height

## Implementation

### Using Theme in Components

```typescript
import { useAppTheme, colors, spacing, borderRadius, shadows, typography } from '@/theme';

const MyComponent = () => {
  const theme = useAppTheme();

  return (
    <View style={{
      backgroundColor: colors.light.card,
      padding: spacing.base,
      borderRadius: borderRadius.large,
      shadow: shadows.card,
    }}>
      <Text style={typography.heading3}>Title</Text>
    </View>
  );
};
```

### Using React Native Paper

The theme integrates with React Native Paper:

```typescript
import { Text, Button, Card } from 'react-native-paper';

<Text variant="titleLarge">Title</Text>
<Button mode="contained">Press me</Button>
<Card>
  <Card.Content>Content</Card.Content>
</Card>
```

### Dark Mode (Future)

Dark mode tokens are available:

```typescript
colors.dark.background  // #111827
colors.dark.card        // #374151
colors.dark.surface     // #1F2937
```
