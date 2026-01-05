# Create Habit Modal - Styling Guide

## Overview

This guide covers styling and visual customization options for both the original and centered layout versions of the Create Habit Modal. Learn how to customize colors, spacing, typography, and create a cohesive visual experience.

---

## Table of Contents

- [Design Tokens](#design-tokens)
- [Centered Layout Styling](#centered-layout-styling)
- [Color Customization](#color-customization)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Styling](#component-styling)
- [Theme Integration](#theme-integration)
- [Accessibility Considerations](#accessibility-considerations)
- [Examples](#examples)

---

## Design Tokens

### Color Palette

The modal uses a predefined color palette for habit colors:

```typescript
// src/components/CreateHabitModal/constants.ts
export const HABIT_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
] as const;
```

**Customization:**

```typescript
// Option 1: Modify the constants file directly
export const HABIT_COLORS = [
  '#YOUR_COLOR_1',
  '#YOUR_COLOR_2',
  // ... up to 12 colors
] as const;

// Option 2: Create a custom palette
const CUSTOM_PALETTE = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
```

### Neutral Colors

Used throughout the interface:

```typescript
// Tailwind CSS classes used
'stone-50'   // #fafaf9 - Very light gray backgrounds
'stone-100'  // #f5f5f4 - Light gray backgrounds
'stone-200'  // #e7e5e4 - Borders, disabled states
'stone-300'  // #d6d3d1 - Borders, dividers
'stone-400'  // #a8a29e - Muted text, icons
'stone-500'  // #78716c - Secondary text
'stone-600'  // #57534e - Body text
'stone-900'  // #1c1917 - Primary text, active states
```

### Semantic Colors

```typescript
// Success (used for selected states)
'emerald-500' // #10b981 - Selected emoji ring
'green-500'   // #22c55e - Alternative success color

// Interactive states
'stone-100'   // Hover backgrounds
'stone-200'   // Disabled backgrounds
'stone-900'   // Active/enabled backgrounds
```

---

## Centered Layout Styling

### Visual Hierarchy

The centered layout prioritizes visual hierarchy through size, spacing, and color:

```
┌─────────────────────────────────────┐
│ Header: stone-900, xl (20px)       │  High contrast
├─────────────────────────────────────┤
│                                     │
│  Heading: stone-900, 3xl (30px)    │  Primary focus
│           font-bold                 │
│                                     │
│  Input: stone-600, xl (20px)       │  Secondary focus
│         rounded-2xl, border         │
│                                     │
│  Counter: stone-400, xs (12px)     │  Tertiary info
│                                     │
│  CUSTOMIZE: stone-500, xs (12px)   │  Section label
│              uppercase, semibold    │
│                                     │
│  Emoji chips: 48×48px              │  Interactive elements
│  Color chips: 36×36px              │
│                                     │
└─────────────────────────────────────┘
```

### Heading Section

```typescript
// Container
className="mb-8 mt-10 px-6"

// Heading text (split across 2 lines)
className="mb-6 text-center text-3xl font-bold leading-tight text-stone-900"
// fontSize: 30px (3xl)
// lineHeight: 36px (tight)
// marginBottom: 24px (6)
// textAlign: 'center'
```

### Name Input

```typescript
// Input field
className="rounded-2xl border border-stone-300 px-4 py-4 text-center text-xl text-stone-600"
// borderRadius: 16px (rounded-2xl)
// borderColor: #d6d3d1 (stone-300)
// paddingVertical: 16px (py-4)
// paddingHorizontal: 16px (px-4)
// fontSize: 20px (text-xl)
// textAlign: 'center'

// Character counter
className="mt-2 text-center text-xs text-stone-400"
// fontSize: 12px (xs)
// marginTop: 8px (mt-2)
```

### Customization Section Label

```typescript
className="mb-4 px-6 text-center text-xs font-semibold uppercase text-stone-500"
style={{ letterSpacing: 0.5 }}
// fontSize: 12px (xs)
// fontWeight: '600' (semibold)
// textTransform: 'uppercase'
// letterSpacing: 0.5
// color: #78716c (stone-500)
```

### Emoji Picker

```typescript
// Container
className="mb-8 flex-row flex-wrap justify-center gap-2 px-6"

// Individual emoji chip (unselected)
className="h-12 w-12 items-center justify-center rounded-xl bg-stone-50"
// height: 48px
// width: 48px
// borderRadius: 12px (rounded-xl)
// backgroundColor: #fafaf9 (stone-50)

// Selected state
className="h-12 w-12 items-center justify-center rounded-xl bg-stone-50 border-2 border-emerald-500"
// Additional: 2px solid border in emerald (#10b981)

// Emoji text
className="text-2xl"
// fontSize: 24px

// "More" button
className="h-12 w-12 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-100"

// "More" label
className="text-[10px] font-semibold uppercase text-stone-500"
style={{ letterSpacing: 0.3 }}
```

### Color Picker

```typescript
// Container
className="mb-8 flex-row flex-wrap justify-center gap-2.5 px-6"

// Individual color chip
<View
  style={{
    width: 36,
    height: 36,
    borderRadius: 18, // Circular
    backgroundColor: color,
  }}
/>

// Selected state (outer ring)
<View
  style={{
    width: 44,       // +8px for ring
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  }}
>
  <View style={{ /* inner circle */ }} />
</View>
```

### Reminder Card

```typescript
className="mx-6 mb-5 flex-row items-center justify-between rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm"
// marginHorizontal: 24px (mx-6)
// marginBottom: 20px (mb-5)
// paddingHorizontal: 14px (p-3.5)
// paddingVertical: 14px
// borderRadius: 12px (rounded-xl)
// borderWidth: 1
// borderColor: #e7e5e4 (stone-200)
// shadowOffset: { width: 0, height: 1 }
// shadowOpacity: 0.05
// shadowRadius: 2
```

### Submit Button

```typescript
// Disabled state
className="mx-6 mb-6 rounded-2xl bg-stone-200 py-4"
// backgroundColor: #e7e5e4 (stone-200)
// paddingVertical: 16px (py-4)
// borderRadius: 16px (rounded-2xl)

// Enabled state
className="mx-6 mb-6 rounded-2xl bg-stone-900 py-4"
// backgroundColor: #1c1917 (stone-900)

// Text (disabled)
className="text-center text-base font-semibold text-stone-400"

// Text (enabled)
className="text-center text-base font-semibold text-white"
```

---

## Color Customization

### Adding Custom Colors to Palette

```typescript
// 1. Extend the color array
export const HABIT_COLORS = [
  ...HABIT_COLORS,
  '#YOUR_NEW_COLOR',
] as const;

// 2. Limit to 12 for optimal layout
const colors = HABIT_COLORS.slice(0, 12);

// 3. Update color names utility (optional)
// src/utils/colorNames.ts
export function getColorName(hex: string): string {
  const colorMap: Record<string, string> = {
    '#YOUR_NEW_COLOR': 'Custom Color Name',
    // ... other colors
  };
  return colorMap[hex] || 'Unknown';
}
```

### Dynamic Color Generation

```typescript
// Generate colors from user preferences
function generateUserColors(preferences: UserPreferences): string[] {
  // Example: Pastel colors
  const pastelColors = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA',
    '#BAFFC9', '#BAE1FF', '#E0BBE4',
  ];

  // Example: Dark colors
  const darkColors = [
    '#2C3E50', '#34495E', '#7F8C8D',
    '#95A5A6', '#BDC3C7', '#ECF0F1',
  ];

  return preferences.theme === 'dark' ? darkColors : pastelColors;
}
```

---

## Typography

### Font Families

The modal uses system fonts by default:

```typescript
// iOS
fontFamily: '-apple-system, BlinkMacSystemFont'

// Android
fontFamily: 'Roboto, sans-serif'
```

### Font Sizes

```typescript
// Tailwind text size classes used
'text-xs'   // 12px - Labels, counters, meta info
'text-sm'   // 14px - Secondary text
'text-base' // 16px - Body text, buttons
'text-lg'   // 18px - Larger body text
'text-xl'   // 20px - Input text, headers
'text-2xl'  // 24px - Emojis
'text-3xl'  // 30px - Main heading
```

### Font Weights

```typescript
'font-normal'   // 400 - Body text
'font-medium'   // 500 - Slightly emphasized text
'font-semibold' // 600 - Section labels, buttons
'font-bold'     // 700 - Main heading
```

### Line Heights

```typescript
'leading-none'   // 1.0 - Compact text
'leading-tight'  // 1.2 - Headings (36px for 30px text)
'leading-snug'   // 1.375 - Comfortable reading
'leading-normal' // 1.5 - Default line height
```

### Customizing Typography

```typescript
// Create a typography config
const typography = {
  heading: {
    fontSize: 32,        // Larger heading
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.5, // Tighter tracking
  },
  input: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
};

// Apply in components
<Text style={typography.heading}>
  What habit do you want to build?
</Text>
```

---

## Spacing & Layout

### Container Spacing

```typescript
// Horizontal padding (sides)
'px-6' // 24px left and right

// Vertical margins
'mt-10' // 40px top margin (heading section)
'mb-8'  // 32px bottom margin (sections)
'mb-6'  // 24px bottom margin (heading text)
'mb-5'  // 20px bottom margin (reminder card)
'mb-4'  // 16px bottom margin (optional label)
```

### Component Gaps

```typescript
// Emoji picker
'gap-2' // 8px gap between chips

// Color picker
'gap-2.5' // 10px gap between chips

// "More" button + label
'gap-1' // 4px gap between icon and text
```

### Padding Values

```typescript
'p-3.5' // 14px all around (reminder card)
'py-4'  // 16px vertical (input, button)
'px-4'  // 16px horizontal (input)
```

### Border Radius

```typescript
'rounded-xl'  // 12px - Chips, cards, reminder
'rounded-2xl' // 16px - Input, button
'rounded-full' // 50% - Circular elements (not used in centered layout)
```

### Customizing Spacing

```typescript
// Create a spacing scale
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

// Apply in components
<View style={{ marginTop: spacing['3xl'], paddingHorizontal: spacing.xl }}>
  {/* Content */}
</View>
```

---

## Component Styling

### Modal Container

```typescript
<Modal
  animationType="slide"
  presentationStyle="pageSheet"
  visible={visible}
  onRequestClose={onClose}
>
  {/* Content */}
</Modal>
```

**Styling options:**

```typescript
// Full screen modal
presentationStyle="fullScreen"

// Different animation
animationType="fade" // or "none"

// Custom background
<View style={{
  flex: 1,
  backgroundColor: '#F5F5F4', // stone-100
}}>
```

### Swipe Gesture Indicator (Optional)

Add a visual indicator for swipe-to-dismiss:

```typescript
// Add at top of modal content
<View className="mt-2 h-1 w-12 self-center rounded-full bg-stone-300" />
```

### Shadow & Elevation

```typescript
// iOS shadow
shadowColor: '#000'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.15
shadowRadius: 4

// Android elevation
elevation: 3

// Tailwind equivalent
className="shadow-sm" // Small shadow
className="shadow-md" // Medium shadow
className="shadow-lg" // Large shadow
```

---

## Theme Integration

### Light/Dark Mode Support

```typescript
import { useColorScheme } from 'react-native';

function ThemedModal() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = {
    background: isDark ? '#1c1917' : '#ffffff',
    text: isDark ? '#ffffff' : '#1c1917',
    border: isDark ? '#44403c' : '#e7e5e4',
    input: isDark ? '#292524' : '#fafaf9',
  };

  return (
    <View style={{ backgroundColor: styles.background }}>
      <Text style={{ color: styles.text }}>
        What habit do you want to build?
      </Text>
    </View>
  );
}
```

### Design System Integration

```typescript
// Define tokens in your design system
const tokens = {
  colors: {
    primary: '#1c1917',
    secondary: '#78716c',
    background: '#ffffff',
    border: '#e7e5e4',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24,
  },
  typography: {
    heading: { size: 30, weight: '700', lineHeight: 36 },
    body: { size: 16, weight: '400', lineHeight: 24 },
  },
  radii: {
    sm: 8, md: 12, lg: 16, full: 9999,
  },
};

// Use in components
<View style={{
  backgroundColor: tokens.colors.background,
  padding: tokens.spacing.lg,
  borderRadius: tokens.radii.lg,
}}>
```

---

## Accessibility Considerations

### Color Contrast

Ensure WCAG AA compliance (4.5:1 for normal text):

```typescript
// ✅ Good contrast
<Text className="text-stone-900">Primary Text</Text> // #1c1917 on white

// ✅ Acceptable
<Text className="text-stone-600">Body Text</Text> // #57534e on white

// ⚠️ Low contrast (use for large text only)
<Text className="text-stone-400">Muted Text</Text> // #a8a29e on white

// ❌ Fails WCAG AA
<Text className="text-stone-300">Too Light</Text> // #d6d3d1 on white
```

### Text Sizing

Support user font scaling:

```typescript
import { Text } from 'react-native';

// Automatically scales with user preferences
<Text style={{ fontSize: 16 }}>
  Scales with accessibility settings
</Text>

// Disable scaling only when necessary
<Text style={{ fontSize: 16 }} allowFontScaling={false}>
  Fixed size (use sparingly)
</Text>
```

### Touch Targets

Minimum touch target size: 44×44 points

```typescript
// ✅ Emoji chips: 48×48px (meets minimum)
<Pressable className="h-12 w-12" />

// ✅ Color chips: 36×36px with hitSlop
<Pressable
  className="h-9 w-9"
  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
/>
```

### Reduced Motion

```typescript
import { useReducedMotion } from '@/hooks/useReducedMotion';

function AnimatedComponent() {
  const reducedMotion = useReducedMotion();

  const animationConfig = reducedMotion
    ? { duration: 0 } // Instant
    : { duration: 300 }; // Normal animation

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeIn.duration(300)}
    />
  );
}
```

---

## Examples

### Example 1: Pastel Theme

```typescript
const PASTEL_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', // Warm pastels
  '#BAFFC9', '#BAE1FF', '#E0BBE4', // Cool pastels
  '#FFD1DC', '#FFF4CC', '#E8F5E9', // Light pastels
  '#F3E5F5', '#E1F5FE', '#FFF9C4', // Subtle pastels
];

const pastelStyles = {
  heading: 'text-purple-900',
  input: 'bg-purple-50 border-purple-200',
  button: 'bg-purple-500',
  label: 'text-purple-700',
};
```

### Example 2: Dark Theme

```typescript
const darkStyles = {
  background: '#1c1917',   // stone-900
  surface: '#292524',      // stone-800
  border: '#44403c',       // stone-700
  text: '#fafaf9',         // stone-50
  textMuted: '#a8a29e',    // stone-400
};

<View style={{ backgroundColor: darkStyles.background }}>
  <Text style={{ color: darkStyles.text }}>
    What habit do you want to build?
  </Text>
  <TextInput
    style={{
      backgroundColor: darkStyles.surface,
      borderColor: darkStyles.border,
      color: darkStyles.text,
    }}
  />
</View>
```

### Example 3: Compact Layout

```typescript
// Reduce spacing for smaller screens
const compactStyles = {
  heading: 'text-2xl mb-4 mt-6',    // Smaller heading
  section: 'mb-6',                   // Less space between sections
  input: 'py-3 px-3',                // Smaller padding
  chip: 'h-10 w-10',                 // Smaller chips
};
```

### Example 4: Branded Theme

```typescript
const brandTheme = {
  primary: '#YOUR_BRAND_COLOR',
  secondary: '#YOUR_SECONDARY_COLOR',
  accent: '#YOUR_ACCENT_COLOR',
};

<View>
  {/* Brand color for selected states */}
  <View style={{
    borderColor: selected ? brandTheme.primary : '#e7e5e4',
    borderWidth: selected ? 2 : 1,
  }}>
    {/* Chip content */}
  </View>

  {/* Brand color for button */}
  <Pressable style={{
    backgroundColor: brandTheme.primary,
  }}>
    <Text style={{ color: 'white' }}>Create Habit</Text>
  </Pressable>
</View>
```

---

## Best Practices

### 1. Maintain Consistency

Use the same color, spacing, and typography tokens throughout the app:

```typescript
// ✅ Good - Consistent spacing
<View className="px-6"> {/* 24px */}
<View className="px-6"> {/* 24px */}

// ❌ Bad - Inconsistent spacing
<View className="px-6">  {/* 24px */}
<View className="px-5">  {/* 20px */}
```

### 2. Test on Multiple Devices

```typescript
// Use Platform-specific adjustments
import { Platform } from 'react-native';

const fontSize = Platform.select({
  ios: 16,
  android: 15, // Slightly smaller on Android
});
```

### 3. Support Accessibility

```typescript
// Always include accessibility labels
<Pressable
  accessibilityLabel="Select red color"
  accessibilityRole="button"
  accessibilityState={{ selected: isSelected }}
>
```

### 4. Use Semantic Color Names

```typescript
// ✅ Good - Semantic naming
const colors = {
  primary: '#1c1917',
  surface: '#ffffff',
  border: '#e7e5e4',
  error: '#ef4444',
};

// ❌ Bad - Non-semantic naming
const colors = {
  black: '#1c1917',
  white: '#ffffff',
  gray: '#e7e5e4',
  red: '#ef4444',
};
```

---

## Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [React Native Styling](https://reactnative.dev/docs/style)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)

---

## Summary

The centered layout uses a carefully crafted visual hierarchy with:
- **Bold heading** (30px, font-bold) for primary focus
- **Centered input** (20px) for clear data entry
- **Optional section** clearly labeled and visually separated
- **Consistent spacing** (multiples of 4px/8px)
- **Accessible colors** meeting WCAG AA standards
- **Touch-friendly targets** (minimum 44×44px with hitSlop)

Customize colors, spacing, and typography to match your brand while maintaining these core principles for the best user experience.
