# Theme System Documentation

Complete design system implementation for the Habit Tracking app based on UX Specification.

## Overview

This theme system provides a consistent, accessible design foundation using:
- **React Native Paper** for component theming
- **Custom color palette** (Emerald green primary, Science blue secondary)
- **iOS-native typography** (SF Pro font family)
- **8pt grid spacing system**
- **WCAG 2.1 Level AA accessibility compliance**

## Usage

### Basic Usage

```typescript
import { useAppTheme } from '@/theme';

function MyComponent() {
  const theme = useAppTheme();

  return (
    <View style={{
      backgroundColor: theme.custom.colors.primary[500],
      padding: theme.custom.spacing.base
    }}>
      <Text style={theme.custom.typography.heading1}>
        Hello World
      </Text>
    </View>
  );
}
```

### Using React Native Paper Components

Paper components automatically inherit the theme:

```typescript
import { Button, Text } from 'react-native-paper';

function MyComponent() {
  return (
    <>
      <Text variant="headlineLarge">Automatic theming</Text>
      <Button mode="contained">Primary Button</Button>
    </>
  );
}
```

### Direct Imports

You can also import modules directly:

```typescript
import { colors, spacing, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.background,
    padding: spacing.base,
  },
  title: {
    ...typography.heading1,
    color: colors.gray[900],
  },
});
```

## Color Palette

### Primary (Brand Green)

```typescript
colors.primary[400] // #34D399 - Lighter
colors.primary[500] // #10B981 - Main brand color
colors.primary[600] // #059669 - Pressed states
colors.primary[700] // #047857 - High contrast text
```

**Usage:** Primary buttons, active states, completed habits, strength indicators

### Secondary (Science Blue)

```typescript
colors.secondary[400] // #60A5FA - Lighter
colors.secondary[500] // #3B82F6 - Main science theme
colors.secondary[600] // #2563EB - Pressed states
```

**Usage:** Analytics charts, info messages, science badges

### Semantic Colors

```typescript
colors.success // #10B981 (matches primary)
colors.warning[500] // #F59E0B - Habits at risk
colors.warning[700] // #D97706 - Better contrast for text
colors.error // #EF4444 - Errors, delete confirmations
colors.info // #3B82F6 (matches secondary)
```

### Habit Strength Levels

```typescript
colors.strength.starting   // #86EFAC - 0-20% 🌱
colors.strength.building   // #10B981 - 20-40% 🌿
colors.strength.developing // #059669 - 40-60% 🌳
colors.strength.strong     // #047857 - 60-80% 💪
colors.strength.automatic  // #065F46 - 80-100% ⚡
```

**Always pair with emoji for accessibility** (color + icon, never color alone)

### Accessibility Notes

```typescript
// ✅ Good contrast (use for text)
colors.gray[700] on white: 10.8:1 ratio
colors.primary[700] for text on white
colors.gray[600] on white: 8.3:1 ratio

// ⚠️ Insufficient for text (decorative only)
colors.primary[500] on white: 2.9:1 - Use primary[700] for text
colors.warning[500] on white: 2.3:1 - Use warning[700] for text
```

## Typography

### Type Scale

```typescript
typography.displayLarge   // 34pt, Bold - Onboarding headlines
typography.heading1       // 28pt, Bold - Screen titles
typography.heading2       // 22pt, Semibold - Section titles
typography.heading3       // 17pt, Semibold - Card titles, habit names
typography.body           // 17pt, Regular - Primary text
typography.bodySmall      // 15pt, Regular - Secondary info
typography.caption        // 13pt, Regular - Meta info, timestamps
typography.button         // 17pt, Semibold - Button text
typography.tabBar         // 10pt, Medium - Tab bar labels
typography.monospace      // 17pt, Regular - Numbers, percentages
```

### Helper Function

```typescript
import { textStyle } from '@/theme/typography';

const title = textStyle('heading1', colors.gray[900]);
// Returns: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, color }
```

### Dynamic Type Support

Typography automatically scales with iOS Dynamic Type settings (XS to XXXL). No additional code needed when using React Native Paper's `<Text>` component.

## Spacing

### 8pt Grid System

```typescript
spacing.xs    // 4pt - Tight spacing, icon padding
spacing.sm    // 8pt - Compact spacing within components
spacing.md    // 12pt - Component internal spacing
spacing.base  // 16pt - Standard spacing (most common)
spacing.lg    // 24pt - Section spacing
spacing.xl    // 32pt - Screen margins, major sections
spacing['2xl'] // 48pt - Large vertical spacing
spacing['3xl'] // 64pt - Page sections
```

### Component-Specific Spacing

```typescript
componentSpacing.card.padding          // 16pt all sides
componentSpacing.card.marginVertical   // 8pt vertical
componentSpacing.listItem.height       // 72pt minimum (thumb tap)
componentSpacing.button.height         // 44pt (Apple HIG minimum)
componentSpacing.input.height          // 44pt (consistent with buttons)
componentSpacing.modal.padding         // 24pt all sides
componentSpacing.tabBar.height         // 49pt + safe area
```

### Helpers

```typescript
import { getSpacing, createSpacing, createPadding } from '@/theme/spacing';

const margin = getSpacing('lg'); // Returns: 24

const margins = createSpacing(16, 8);
// Returns: { marginVertical: 16, marginHorizontal: 8 }

const padding = createPadding(24, 16);
// Returns: { paddingVertical: 24, paddingHorizontal: 16 }
```

## Border Radius

```typescript
borderRadius.small  // 8pt - Buttons, tags
borderRadius.medium // 12pt - Cards, inputs
borderRadius.large  // 16pt - Modals, sheets
borderRadius.xl     // 20pt - Full screen modals (top corners only)
borderRadius.full   // 9999 - Circular (50% for percentages)
```

## Shadows (iOS-style)

```typescript
shadows.card // Subtle elevation for cards
// { shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 8 }

shadows.modal // Medium elevation for modals
// { shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.12, shadowRadius: 16 }

shadows.floatingActionButton // Higher elevation for FAB
// { shadowColor: '#000', shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.15, shadowRadius: 12 }
```

### Usage

```typescript
import { shadows } from '@/theme';

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    // Other styles
  },
});
```

## Examples

### Button Component

```typescript
import { useAppTheme } from '@/theme';
import { Pressable, Text } from 'react-native';

function PrimaryButton({ children, onPress }) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.custom.colors.primary[500],
        height: theme.custom.componentSpacing.button.height,
        paddingHorizontal: theme.custom.componentSpacing.button.paddingHorizontal,
        borderRadius: theme.custom.borderRadius.small,
        ...theme.custom.shadows.card,
      }}
    >
      <Text style={{
        ...theme.custom.typography.button,
        color: '#FFFFFF',
      }}>
        {children}
      </Text>
    </Pressable>
  );
}
```

### Card Component

```typescript
import { useAppTheme } from '@/theme';
import { View, Text } from 'react-native';

function HabitCard({ title, strengthLevel }) {
  const theme = useAppTheme();

  return (
    <View style={{
      backgroundColor: theme.custom.colors.light.card,
      padding: theme.custom.componentSpacing.card.padding,
      marginVertical: theme.custom.componentSpacing.card.marginVertical,
      borderRadius: theme.custom.borderRadius.medium,
      ...theme.custom.shadows.card,
    }}>
      <Text style={{
        ...theme.custom.typography.heading3,
        color: theme.custom.colors.gray[900],
      }}>
        {title}
      </Text>
      <View style={{
        width: '100%',
        height: 4,
        backgroundColor: theme.custom.colors.gray[200],
        borderRadius: 2,
        marginTop: theme.custom.spacing.sm,
      }}>
        <View style={{
          width: `${strengthLevel}%`,
          height: '100%',
          backgroundColor: theme.custom.colors.primary[500],
          borderRadius: 2,
        }} />
      </View>
    </View>
  );
}
```

## Testing

### Dynamic Type Testing

Test all text sizes from XS to XXXL:
```bash
# iOS Settings → Accessibility → Display & Text Size → Larger Text
# Move slider to XXXL and verify layouts don't clip/overflow
```

### Color Contrast Testing

Use online tools to verify WCAG 2.1 Level AA compliance:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Minimum ratios: 4.5:1 (normal text), 3:1 (large text/UI)

### Dark Mode (Future)

Theme includes dark mode colors (not yet implemented):

```typescript
colors.dark.background // #111827
colors.dark.surface    // #1F2937
colors.dark.card       // #374151
```

To implement dark mode, create a separate `darkTheme` export and switch based on user preference or system settings.

## Files

```
src/theme/
├── colors.ts      - Color palette with accessibility notes
├── typography.ts  - Type scale and font families
├── spacing.ts     - 8pt grid, border radius, shadows
├── index.ts       - Main theme export and useAppTheme hook
└── README.md      - This file
```

## References

- **UX Specification:** `/docs/ux-specification.md` (Sections 5.1, 5.2, 5.3)
- **React Native Paper Docs:** https://callstack.github.io/react-native-paper/
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Apple Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/

---

**Version:** 1.0
**Last Updated:** 2025-10-22
