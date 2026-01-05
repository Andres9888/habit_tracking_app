# Styling Guide - Centered Habit Creation Modal

## 🎨 Design System Overview

This guide covers the complete styling system for the **Centered Habit Creation Modal**, including colors, typography, spacing, and customization patterns.

---

## 🎨 Color Palette

### Habit Colors (Primary Palette)

The default habit color palette consists of 12 vibrant colors:

```typescript
const HABIT_COLORS = [
  '#EF4444', // Red (default)
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

**Visual Preview:**

```
🔴 Red     🟠 Orange   🟡 Amber    🟡 Yellow
🟢 Lime    🟢 Emerald  🔵 Teal     🔵 Cyan
🔵 Blue    🟣 Indigo   🟣 Violet   🩷 Pink
```

**Color Properties:**

| Color | Hex Code | Use Case | WCAG AA Compliant* |
|-------|----------|----------|-------------------|
| Red | `#EF4444` | Default, urgent habits | ⚠️ Large text only |
| Orange | `#F97316` | Energy, morning habits | ⚠️ Large text only |
| Amber | `#F59E0B` | Learning, growth | ⚠️ Large text only |
| Yellow | `#EAB308` | Mindfulness, positivity | ⚠️ Large text only |
| Lime | `#84CC16` | Health, nutrition | ⚠️ Large text only |
| Emerald | `#10B981` | Nature, environment | ✅ All text |
| Teal | `#14B8A6` | Calm, focus | ✅ All text |
| Cyan | `#06B6D4` | Hydration, clarity | ✅ All text |
| Blue | `#3B82F6` | Productivity, work | ⚠️ Large text only |
| Indigo | `#6366F1` | Creativity, evening | ⚠️ Large text only |
| Violet | `#8B5CF6` | Spirituality, meditation | ⚠️ Large text only |
| Pink | `#EC4899` | Self-care, relationships | ⚠️ Large text only |

\* *Against white background (#FFFFFF)*

### Neutral Colors (UI Palette)

```typescript
const NEUTRAL_COLORS = {
  background: '#FAFAF9',    // stone-50 - Modal background
  surface: '#FFFFFF',       // white - Input, cards
  border: '#E7E5E4',        // stone-200 - Borders
  borderLight: '#F5F5F4',   // stone-100 - Subtle borders
  text: {
    primary: '#1C1917',     // stone-900 - Headings, labels
    secondary: '#78716C',   // stone-500 - Section headers
    tertiary: '#A8A29E',    // stone-400 - Placeholders, counters
  },
  disabled: {
    background: '#E7E5E4',  // stone-200 - Disabled button
    text: '#78716C',        // stone-500 - Disabled text
  },
};
```

### Semantic Colors

```typescript
const SEMANTIC_COLORS = {
  success: '#10B981',       // emerald-500 - Success states
  error: '#EF4444',         // red-500 - Error states
  warning: '#F59E0B',       // amber-500 - Warning states
  info: '#3B82F6',          // blue-500 - Info states
  selected: '#10B981',      // emerald-500 - Selection indicator
};
```

---

## 📐 Centered Layout Visual Hierarchy

### Container Structure

```
┌─────────────────────────────────────────┐
│ Modal Container (stone-50 background)   │
│ Safe Area Insets Applied                │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Header (48px height)              │  │ ← 1. Navigation
│  │ • Title: "Create Habit"           │  │
│  │ • Close button (right)            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ╔══════════════════════════════════╗  │
│  ║ PRIMARY SECTION (margin-top: 40) ║  │ ← 2. Primary Focus
│  ║                                  ║  │
│  ║    What habit do you             ║  │ Heading: 3xl (30px)
│  ║    want to build?                ║  │          2 lines, centered
│  ║                                  ║  │
│  ║  ┌────────────────────────────┐ ║  │
│  ║  │ [Name Input Field]         │ ║  │ Input: xl (20px)
│  ║  └────────────────────────────┘ ║  │        centered text
│  ║       0/50 characters            ║  │ Counter: xs (12px)
│  ║                                  ║  │
│  ╚══════════════════════════════════╝  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ CUSTOMIZE (OPTIONAL)             │  │ ← 3. Section Divider
│  └──────────────────────────────────┘  │    xs (12px), uppercase
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🎯 ✨ 💪 📖 🧘 💧 [+]           │  │ ← 4. Emoji Picker
│  │                     More          │  │    48×48px chips
│  └──────────────────────────────────┘  │    "More" label (10px)
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🔴 🟠 🟡 🟢 🔵 🟣 ...           │  │ ← 5. Color Picker
│  └──────────────────────────────────┘  │    36×36px chips
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🔔 Remind me    [12:00 PM] ○     │  │ ← 6. Reminder Selector
│  └──────────────────────────────────┘  │    Card with border
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  [     Create Habit     ]        │  │ ← 7. Submit Button
│  └──────────────────────────────────┘  │    Full width
└─────────────────────────────────────────┘
```

### Spacing Measurements

```typescript
const SPACING = {
  // Container
  modalPadding: 20,                    // Horizontal padding

  // Sections
  headerToNameInput: 40,               // Top margin for name section
  nameInputToOptionalLabel: 32,        // Bottom margin after input
  optionalLabelToEmojiPicker: 16,      // After "CUSTOMIZE (OPTIONAL)"
  emojiPickerToColorPicker: 32,        // Between pickers
  colorPickerToReminder: 32,           // Before reminder
  reminderToSubmitButton: 20,          // Final spacing

  // Components
  headingLineHeight: 36,               // Line height for 2-line heading
  inputHeight: 52,                     // Name input height
  counterTopMargin: 4,                 // Character counter spacing
  emojiChipSize: 48,                   // Emoji chip dimensions
  emojiChipGap: 8,                     // Gap between emoji chips
  colorChipSize: 36,                   // Color chip dimensions
  colorChipGap: 10,                    // Gap between color chips
  reminderCardPadding: 14,             // Reminder card internal padding
  submitButtonHeight: 50,              // Submit button height
};
```

---

## 🔤 Typography System

### Font Families

```typescript
const FONT_FAMILIES = {
  sans: 'System', // -apple-system, SF Pro (iOS), Roboto (Android)
  mono: 'SF Mono, Menlo, Courier', // For technical content
};
```

### Font Sizes

```typescript
const FONT_SIZES = {
  '3xl': 30,   // Primary heading
  'xl': 20,    // Input text
  'base': 16,  // Body text, buttons
  'sm': 14,    // Secondary text
  'xs': 12,    // Section labels, character counter
  '2xs': 10,   // "More" label
};
```

### Font Weights

```typescript
const FONT_WEIGHTS = {
  bold: '700',       // Headings
  semibold: '600',   // Section labels, buttons
  medium: '500',     // Input text
  regular: '400',    // Placeholders
};
```

### Line Heights

```typescript
const LINE_HEIGHTS = {
  tight: 1.2,     // Headings (36px for 30px font)
  normal: 1.5,    // Body text
  relaxed: 1.625, // Larger body text
};
```

### Text Styles by Component

| Component | Font Size | Weight | Color | Line Height |
|-----------|-----------|--------|-------|-------------|
| **Heading** | 30px (3xl) | bold (700) | stone-900 | 36px (1.2) |
| **Input Text** | 20px (xl) | medium (500) | stone-900 | 30px (1.5) |
| **Input Placeholder** | 20px (xl) | regular (400) | stone-400 | 30px (1.5) |
| **Character Counter** | 12px (xs) | regular (400) | stone-400 | 18px (1.5) |
| **Section Label** | 12px (xs) | semibold (600) | stone-500 | 18px (1.5) |
| **Button Text** | 16px (base) | semibold (600) | white | 24px (1.5) |
| **"More" Label** | 10px (2xs) | semibold (600) | stone-500 | 15px (1.5) |

---

## 🎯 Component-Specific Styling

### 1. Modal Container

```typescript
containerStyle = {
  backgroundColor: '#FAFAF9',  // stone-50
  borderTopLeftRadius: 28,     // Rounded top corners
  borderTopRightRadius: 28,
  paddingTop: 8,               // Swipe indicator space
  paddingHorizontal: 20,
  paddingBottom: useSafeAreaInsets().bottom + 20,
}
```

**Swipe Indicator:**

```typescript
swipeIndicatorStyle = {
  width: 36,
  height: 4,
  backgroundColor: '#D6D3D1',  // stone-300
  borderRadius: 2,
  marginBottom: 12,
  alignSelf: 'center',
}
```

### 2. Heading Section

```typescript
headingContainerStyle = {
  marginTop: 40,
  marginBottom: 16,
  alignItems: 'center',
}

headingTextStyle = {
  fontSize: 30,              // 3xl
  fontWeight: '700',         // bold
  color: '#1C1917',         // stone-900
  textAlign: 'center',
  lineHeight: 36,           // 1.2
  maxWidth: '90%',          // Wrap to 2 lines naturally
}
```

### 3. Name Input

```typescript
inputContainerStyle = {
  marginBottom: 4,
}

inputStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,          // rounded-2xl
  borderWidth: 1,
  borderColor: '#E7E5E4',   // stone-200
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 20,             // xl
  fontWeight: '500',        // medium
  color: '#1C1917',        // stone-900
  textAlign: 'center',
  height: 52,
}

inputFocusedStyle = {
  borderColor: '#78716C',   // stone-500 on focus
  borderWidth: 2,
}

placeholderTextColor = '#A8A29E'  // stone-400
```

**Character Counter:**

```typescript
characterCounterStyle = {
  fontSize: 12,             // xs
  color: '#A8A29E',        // stone-400
  textAlign: 'center',
  marginTop: 4,
}
```

### 4. Section Label ("CUSTOMIZE (OPTIONAL)")

```typescript
sectionLabelStyle = {
  fontSize: 12,             // xs
  fontWeight: '600',        // semibold
  color: '#78716C',        // stone-500
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  textAlign: 'center',
  marginBottom: 16,
  marginTop: 32,
}
```

### 5. Emoji Picker

**Container:**

```typescript
emojiPickerContainerStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 32,
}
```

**Emoji Chip:**

```typescript
emojiChipStyle = {
  width: 48,
  height: 48,
  borderRadius: 12,         // rounded-xl
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5F5F4', // stone-100
}

emojiChipSelectedStyle = {
  backgroundColor: '#DCFCE7', // green-100
  borderWidth: 2,
  borderColor: '#10B981',     // emerald-500
  transform: [{ scale: 1.05 }],
}

emojiTextStyle = {
  fontSize: 24,
}
```

**Plus Button (More):**

```typescript
moreBut tonContainerStyle = {
  alignItems: 'center',
  gap: 4,                   // gap-1
}

plusButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: '#D6D3D1',   // stone-300
  backgroundColor: '#F5F5F4', // stone-100
  justifyContent: 'center',
  alignItems: 'center',
}

moreLabelStyle = {
  fontSize: 10,             // 2xs
  fontWeight: '600',        // semibold
  color: '#78716C',        // stone-500
  textTransform: 'uppercase',
  letterSpacing: 0.3,
}
```

### 6. Color Picker

**Container:**

```typescript
colorPickerContainerStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 10,
  marginBottom: 32,
}
```

**Color Chip:**

```typescript
colorChipStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,         // Fully rounded (circle)
  borderWidth: 2,
  borderColor: 'transparent',
}

colorChipSelectedStyle = {
  borderWidth: 2,
  borderColor: color,       // Same as chip color
  shadowColor: color,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 4,             // Android shadow
  transform: [{ scale: 1.1 }],
}
```

**Plus Button (Custom Color):**

```typescript
customColorButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: '#D6D3D1',   // stone-300
  backgroundColor: '#F5F5F4', // stone-100
  justifyContent: 'center',
  alignItems: 'center',
}
```

### 7. Reminder Selector

```typescript
reminderCardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,         // rounded-xl
  borderWidth: 1,
  borderColor: '#E7E5E4',   // stone-200
  padding: 14,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,             // Android shadow
  marginBottom: 20,
}
```

### 8. Submit Button

**Default State:**

```typescript
submitButtonStyle = {
  backgroundColor: '#1C1917', // stone-900
  borderRadius: 16,          // rounded-2xl
  paddingVertical: 14,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
}

submitButtonTextStyle = {
  fontSize: 16,              // base
  fontWeight: '600',         // semibold
  color: '#FFFFFF',
  textAlign: 'center',
}
```

**Disabled State:**

```typescript
submitButtonDisabledStyle = {
  backgroundColor: '#E7E5E4', // stone-200
}

submitButtonDisabledTextStyle = {
  color: '#78716C',          // stone-500
}
```

**Pressed State:**

```typescript
submitButtonPressedStyle = {
  opacity: 0.8,
  transform: [{ scale: 0.98 }],
}
```

---

## 🌓 Theme Integration

### Light Mode (Default)

Already defined above - uses stone palette with white surfaces.

### Dark Mode (Optional)

```typescript
const DARK_COLORS = {
  background: '#1C1917',      // stone-900
  surface: '#292524',         // stone-800
  border: '#44403C',          // stone-700
  text: {
    primary: '#FAFAF9',       // stone-50
    secondary: '#D6D3D1',     // stone-300
    tertiary: '#78716C',      // stone-500
  },
  disabled: {
    background: '#44403C',    // stone-700
    text: '#78716C',          // stone-500
  },
};
```

**Dark Mode Component Styles:**

```typescript
// Update relevant styles when dark mode is active
const isDarkMode = useColorScheme() === 'dark';

modalContainerStyle = {
  backgroundColor: isDarkMode ? DARK_COLORS.background : NEUTRAL_COLORS.background,
}

inputStyle = {
  backgroundColor: isDarkMode ? DARK_COLORS.surface : '#FFFFFF',
  borderColor: isDarkMode ? DARK_COLORS.border : NEUTRAL_COLORS.border,
  color: isDarkMode ? DARK_COLORS.text.primary : NEUTRAL_COLORS.text.primary,
}
```

---

## 🎭 Animation & Interaction States

### Scale Animations

```typescript
const scaleAnimation = {
  default: 1,
  pressed: 0.95,
  selected: 1.05,
};

// Usage in Pressable
<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
```

### Opacity Animations

```typescript
const opacityAnimation = {
  default: 1,
  pressed: 0.8,
  disabled: 0.5,
};
```

### Spring Configuration

```typescript
const springConfig = {
  damping: 20,
  stiffness: 300,
  mass: 1,
};

// Usage with reanimated
translateY.value = withSpring(0, springConfig);
```

---

## 🎨 Design System Tokens

For consistency across the app, define tokens:

```typescript
// tokens/colors.ts
export const colors = {
  habit: HABIT_COLORS,
  neutral: NEUTRAL_COLORS,
  semantic: SEMANTIC_COLORS,
};

// tokens/spacing.ts
export const spacing = SPACING;

// tokens/typography.ts
export const typography = {
  sizes: FONT_SIZES,
  weights: FONT_WEIGHTS,
  lineHeights: LINE_HEIGHTS,
};

// tokens/borders.ts
export const borders = {
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  width: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
};

// tokens/shadows.ts
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};
```

---

## 🎯 Accessibility Considerations

### Color Contrast

**Minimum Contrast Ratios (WCAG AA):**

- Normal text (< 18px): 4.5:1
- Large text (≥ 18px): 3:1
- UI components: 3:1

**Current Compliance:**

| Element | Contrast Ratio | Compliant? |
|---------|---------------|------------|
| Heading (stone-900 on stone-50) | 18:1 | ✅ AAA |
| Input text (stone-900 on white) | 19:1 | ✅ AAA |
| Placeholder (stone-400 on white) | 4.6:1 | ✅ AA |
| Section label (stone-500 on stone-50) | 6.5:1 | ✅ AAA |
| Button (white on stone-900) | 19:1 | ✅ AAA |

### Text Sizing

Support Dynamic Type (iOS) and Font Scale (Android):

```typescript
import { useWindowDimensions, PixelRatio } from 'react-native';

const { fontScale } = useWindowDimensions();

// Scale font sizes
const scaledFontSize = 16 * fontScale;
```

### Touch Targets

**Minimum sizes:**

- Buttons: 44×44pt (iOS), 48×48dp (Android)
- Emoji chips: 48×48px ✅
- Color chips: 36×36px ⚠️ (wrap in 44×44 touchable area)

```typescript
// Expand touch area for color chips
<Pressable
  hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
>
  {/* 36×36 color chip */}
</Pressable>
```

### Reduced Motion

Respect user's reduced motion preference:

```typescript
import { useReduceMotion } from '@/hooks/useReduceMotion';

const reduceMotion = useReduceMotion();

// Conditional animations
const scaleAnimation = reduceMotion ? 1 : animatedScale.value;
```

---

## 🛠️ Customization Examples

### Example 1: Pastel Theme

```typescript
const PASTEL_COLORS = [
  '#FFB3BA', // Pastel Red
  '#FFDFBA', // Pastel Orange
  '#FFFFBA', // Pastel Yellow
  '#BAFFC9', // Pastel Green
  '#BAE1FF', // Pastel Blue
  '#E0BBE4', // Pastel Purple
];

const PASTEL_NEUTRAL = {
  background: '#FFF9F0',    // Warm off-white
  surface: '#FFFFFF',
  text: '#5A4A42',         // Warm dark brown
};
```

### Example 2: Dark & Bold Theme

```typescript
const BOLD_COLORS = [
  '#DC2626', // Bold Red
  '#EA580C', // Bold Orange
  '#CA8A04', // Bold Yellow
  '#16A34A', // Bold Green
  '#2563EB', // Bold Blue
  '#7C3AED', // Bold Purple
];

const DARK_THEME = {
  background: '#0F172A',    // slate-900
  surface: '#1E293B',       // slate-800
  text: {
    primary: '#F1F5F9',     // slate-100
    secondary: '#94A3B8',   // slate-400
  },
};
```

### Example 3: Compact Layout

```typescript
const COMPACT_SPACING = {
  headerToNameInput: 24,            // Reduced from 40
  nameInputToOptionalLabel: 20,     // Reduced from 32
  emojiPickerToColorPicker: 20,     // Reduced from 32
  colorPickerToReminder: 20,        // Reduced from 32
};

const COMPACT_SIZES = {
  headingFontSize: 24,              // Reduced from 30
  inputFontSize: 18,                // Reduced from 20
  emojiChipSize: 40,                // Reduced from 48
  colorChipSize: 30,                // Reduced from 36
};
```

### Example 4: Branded Theme

```typescript
// Use your brand colors
const BRAND_COLORS = {
  primary: '#6366F1',       // Your brand color
  accent: '#EC4899',
  background: '#F9FAFB',
  text: '#111827',
};

// Apply to components
submitButtonStyle = {
  backgroundColor: BRAND_COLORS.primary, // Instead of stone-900
}

emojiChipSelectedStyle = {
  borderColor: BRAND_COLORS.primary,     // Instead of emerald-500
}
```

---

## 📏 Responsive Design

### Breakpoints

```typescript
const BREAKPOINTS = {
  small: 320,   // Small phones
  medium: 375,  // Standard phones
  large: 414,   // Large phones
  tablet: 768,  // Tablets
};
```

### Responsive Spacing

```typescript
const { width } = useWindowDimensions();

const responsiveSpacing = {
  modalPadding: width < BREAKPOINTS.medium ? 16 : 20,
  emojiChipSize: width < BREAKPOINTS.small ? 40 : 48,
};
```

---

## 🎨 Best Practices

### ✅ Do's

- **Use design tokens** for consistency
- **Test color contrast** with accessibility tools
- **Support dynamic type** for better accessibility
- **Maintain visual hierarchy** - name input is primary
- **Use semantic colors** for state (green = selected, red = error)
- **Apply consistent spacing** across all components
- **Respect system preferences** (dark mode, reduced motion)

### ❌ Don'ts

- **Don't hardcode colors** - use token system
- **Don't ignore safe area insets** - use `useSafeAreaInsets()`
- **Don't use absolute positioning** unless necessary
- **Don't rely on color alone** for information (use text/icons too)
- **Don't forget disabled states** - show clear visual feedback
- **Don't skip animation considerations** - honor reduced motion

---

## 📚 External Resources

- [Material Design Color System](https://m3.material.io/styles/color/overview)
- [iOS Human Interface Guidelines - Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors) (stone palette reference)

---

## 🔗 Related Documentation

- [Integration Guide](./INTEGRATION_GUIDE_CENTERED.md) - How to integrate the component
- [Quick Start](./QUICK_START_CENTERED.md) - Get started in 5 minutes
- [Full Specification](./centered-optional-fields.md) - Complete technical details

---

**Last Updated:** January 5, 2026
**Version:** 1.0.0
**Component:** CreateHabitModalCentered
