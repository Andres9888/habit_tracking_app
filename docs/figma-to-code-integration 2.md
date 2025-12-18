# Figma to React Native Integration Guide

**Generated:** 2025-10-30
**Project:** Habit Tracker - Science-Backed Mobile App
**Purpose:** Bridge Figma designs with existing React Native + Expo + NativeWind codebase

---

## 🎯 Overview

This document maps your Figma design specifications to your existing React Native codebase structure, ensuring seamless design-to-code workflow.

**Your Tech Stack:**
- **Framework:** React Native (0.81.5) + Expo (54.0.20)
- **Styling:** NativeWind 4.1 (Tailwind CSS) + StyleSheet API
- **Component Library:** React Native Paper (5.14.5) + Custom components
- **Animation:** React Native Reanimated (4.1.1)
- **Backend:** Convex
- **Design System:** Custom theme system (`/src/theme/`)

---

## 📦 Current Design System Structure

### 1. Design Tokens Location

Your design tokens are already implemented and match the UX specification exactly:

```
src/theme/
├── colors.ts           # Brand, semantic, strength levels, grays
├── typography.ts       # Font families, sizes, weights, line heights
├── spacing.ts          # 8pt grid system
└── index.ts            # Combined theme export
```

**Verification:** All colors pass WCAG 2.1 AA tests (see `src/theme/__tests__/colors.test.ts`)

---

### 2. Token Import Pattern

**How to use design tokens in components:**

```typescript
import { useAppTheme } from '../theme';

function MyComponent() {
  const theme = useAppTheme();

  // Access colors
  const brandColor = theme.custom.colors.primary[500];  // #10B981
  const strengthColor = theme.custom.colors.strength.building;  // #10B981

  // Access typography
  const heading = theme.custom.typography.heading1;  // Style object

  // Access spacing
  const margin = theme.custom.spacing.lg;  // 24

  return (
    <View style={{ backgroundColor: brandColor, margin }}>
      <Text style={heading}>Hello</Text>
    </View>
  );
}
```

---

### 3. Color Mapping: Figma → Code

| Figma Token | Code Path | Hex Value |
|-------------|-----------|-----------|
| `brand/primary/500` | `theme.custom.colors.primary[500]` | #10B981 |
| `brand/primary/600` | `theme.custom.colors.primary[600]` | #059669 |
| `semantic/success` | `theme.custom.colors.success` | #10B981 |
| `semantic/warning` | `theme.custom.colors.warning[500]` | #F59E0B |
| `gray/700` | `theme.custom.colors.gray[700]` | #374151 |
| `strength/starting` | `theme.custom.colors.strength.starting` | #86EFAC |
| `strength/building` | `theme.custom.colors.strength.building` | #10B981 |
| `strength/strong` | `theme.custom.colors.strength.strong` | #047857 |

**NativeWind Usage:**
```tsx
// Instead of theme.custom.colors.primary[500]
<View className="bg-[#10B981]" />

// Or use Tailwind config colors (if extended)
<View className="bg-primary-500" />
```

---

### 4. Typography Mapping: Figma → Code

| Figma Style | Code Path | Usage |
|-------------|-----------|-------|
| Display/Large | `theme.custom.typography.displayLarge` | Onboarding headlines |
| Heading/H1 | `theme.custom.typography.heading1` | Screen titles |
| Heading/H2 | `theme.custom.typography.heading2` | Section titles |
| Heading/H3 | `theme.custom.typography.heading3` | Card titles, habit names |
| Body/Regular | `theme.custom.typography.body` | Primary text |
| Body/Small | `theme.custom.typography.bodySmall` | Secondary info |
| Caption | `theme.custom.typography.caption` | Meta info, timestamps |

**Example:**
```typescript
<Text style={theme.custom.typography.heading2}>
  Section Title
</Text>
```

**NativeWind Alternative:**
```tsx
<Text className="text-2xl font-semibold">
  Section Title
</Text>
```

---

### 5. Spacing Mapping: Figma → Code

| Figma Token | Code Value | Pixels | Usage |
|-------------|------------|--------|-------|
| `spacing/xs` | `theme.custom.spacing.xs` | 4pt | Tight spacing |
| `spacing/sm` | `theme.custom.spacing.sm` | 8pt | Compact |
| `spacing/base` | `theme.custom.spacing.base` | 16pt | Standard |
| `spacing/lg` | `theme.custom.spacing.lg` | 24pt | Section spacing |
| `spacing/xl` | `theme.custom.spacing.xl` | 32pt | Screen margins |

**NativeWind Equivalent:**
```tsx
<View className="p-4">      {/* padding: 16pt */}
<View className="gap-6">    {/* gap: 24pt */}
<View className="mx-8">     {/* margin-x: 32pt */}
```

---

## 🧩 Existing Components

### Components Already Built (Use These!)

#### 1. HabitStrengthIndicator
**Location:** `src/components/HabitStrengthIndicator/HabitStrengthIndicator.tsx`

**Figma Spec:** Matches Section 4.2 exactly

**Usage:**
```typescript
import HabitStrengthIndicator from '@/components/HabitStrengthIndicator';

// Compact variant (for list)
<HabitStrengthIndicator
  strength={65}
  variant="compact"
  showPercentage
/>

// Full variant (for detail screen)
<HabitStrengthIndicator
  strength={65}
  variant="full"
  showLabel
  habitName="Morning Meditation"
/>
```

**Features:**
- ✅ Spring animation (damping: 15, stiffness: 150)
- ✅ Emoji mapping (🌱 🌿 🌳 💪 ⚡)
- ✅ Color transitions
- ✅ Accessibility announcements
- ✅ WCAG AA compliant

---

#### 2. ColorPickerSheet
**Location:** `src/components/CreateHabitModal/ColorPickerSheet.tsx`

**Figma Spec:** Custom component (not in spec, but implemented)

**Usage:**
```typescript
import { ColorPickerSheet } from '@/components/CreateHabitModal/ColorPickerSheet';

<ColorPickerSheet
  visible={isVisible}
  value="#10B981"
  presetColors={['#10B981', '#3B82F6', '#F59E0B']}
  onSelect={(color) => setSelectedColor(color)}
  onClose={() => setIsVisible(false)}
/>
```

---

#### 3. Button Component
**Location:** `src/components/Button.tsx`

**Figma Spec:** Section 4.2 Button Component

**Usage:**
```typescript
import Button from '@/components/Button';

<Button
  variant="primary"  // primary, secondary, ghost
  size="medium"      // small, medium, large
  onPress={handlePress}
>
  Create Habit
</Button>
```

---

#### 4. Card Component
**Location:** `src/components/Card.tsx`

**Figma Spec:** Section 4.2 Card Component

**Usage:**
```typescript
import Card from '@/components/Card';

<Card variant="stat">
  <Text>5 Habits</Text>
  <Text>Active</Text>
</Card>
```

---

### Components To Build (From Figma Spec)

These components are specified in your Figma docs but not yet implemented:

#### 5. Modal Component (Bottom Sheet)
**Figma Spec:** `figma-components-spec.json` → Modal → bottomSheet variant

**Recommended Library:** `@gorhom/bottom-sheet` or React Native Paper Portal

**Structure:**
```tsx
<BottomSheet>
  <Handle />
  <View style={{ padding: 24, gap: 24 }}>
    <Text style={theme.custom.typography.heading2}>Create Habit</Text>
    {/* Form fields */}
  </View>
</BottomSheet>
```

---

#### 6. Toast Component
**Figma Spec:** `figma-components-spec.json` → Toast

**Recommended Library:** Already have `sonner` (2.0.3) installed!

**Usage:**
```typescript
import { toast } from 'sonner';

// Success
toast.success('Habit completed successfully');

// Error
toast.error('Failed to save habit');

// Custom
toast('Custom message', {
  icon: '✓',
  duration: 3000,
});
```

---

#### 7. EmptyState Component
**Location:** `src/components/EmptyState.tsx` (already exists!)

**Figma Spec:** Section 4.2 EmptyState Component

---

## 🎨 Styling Patterns

### Pattern 1: NativeWind (Tailwind) - Preferred for Layout

```tsx
<View className="flex-1 items-center justify-center gap-4 bg-white p-4">
  <Text className="text-2xl font-bold text-gray-700">Welcome</Text>
  <View className="h-16 w-full rounded-xl bg-primary-500" />
</View>
```

**Pros:**
- ✅ Fast development
- ✅ Responsive by default
- ✅ Familiar Tailwind syntax

**Cons:**
- ❌ No direct access to theme tokens
- ❌ Can't use dynamic values easily

---

### Pattern 2: StyleSheet + Theme - Preferred for Components

```tsx
import { useAppTheme } from '../theme';

function MyComponent() {
  const theme = useAppTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.custom.colors.primary[500] }
    ]}>
      <Text style={theme.custom.typography.heading1}>Title</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
});
```

**Pros:**
- ✅ Type-safe theme access
- ✅ Performance optimized
- ✅ Full control

**Cons:**
- ❌ More verbose
- ❌ Requires separate style object

---

### Pattern 3: Hybrid (Best of Both)

```tsx
function HabitCard() {
  const theme = useAppTheme();

  return (
    <View className="flex-row items-center gap-2 rounded-xl p-4">
      {/* Use NativeWind for layout */}

      <View style={{
        backgroundColor: theme.custom.colors.strength.building,
        width: 4,
        height: '100%',
        borderRadius: 4,
      }}>
        {/* Use theme for brand colors */}
      </View>

      <Text className="text-lg font-semibold" style={{
        color: theme.custom.colors.gray[700]
      }}>
        Habit Name
      </Text>
    </View>
  );
}
```

---

## 🎬 Animation Specifications

### Spring Physics Configuration

Your codebase already uses these values (matches Figma spec):

```typescript
import { withSpring } from 'react-native-reanimated';

// Standard spring (matches iOS feel)
withSpring(targetValue, {
  damping: 15,
  stiffness: 150,
});

// Bouncy spring (for celebrations)
withSpring(targetValue, {
  damping: 10,
  stiffness: 100,
});
```

**Figma → Code Mapping:**
- Figma "Spring easing" = `withSpring({ damping: 15, stiffness: 150 })`
- Figma "300ms standard" = `withTiming(value, { duration: 300 })`

---

### Animation Example: Habit Completion

**From Figma Spec (Section 8.2):**

```typescript
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence
} from 'react-native-reanimated';

function HabitCard() {
  const scale = useSharedValue(1);
  const checkmarkScale = useSharedValue(0);

  const handlePress = () => {
    // 1. Card press (0-100ms)
    scale.value = withSpring(0.95, { damping: 15 });

    // 2. Checkmark appears (100-300ms)
    checkmarkScale.value = withSequence(
      withSpring(1.2, { damping: 10 }),
      withSpring(1.0, { damping: 15 })
    );

    // 3. Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }]
  }));

  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.Text style={checkmarkStyle}>✓</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

---

## 📱 Component Implementation Guide

### Step-by-Step: Building HabitCard from Figma

**Figma Spec:** `figma-components-spec.json` → HabitCard

**1. Read Figma Component Spec:**
```json
{
  "HabitCard": {
    "layout": {
      "type": "auto-layout",
      "direction": "horizontal",
      "spacing": "8pt",
      "padding": { "all": "16pt" },
      "height": "72pt",
      "cornerRadius": "12pt"
    },
    "children": [
      { "name": "accent-bar", "width": "4pt" },
      { "name": "icon", "size": "32pt" },
      { "name": "content", "layoutGrow": 1 },
      { "name": "status-icon", "size": "24pt" }
    ]
  }
}
```

**2. Translate to React Native:**

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme';
import HabitStrengthIndicator from '@/components/HabitStrengthIndicator';

interface HabitCardProps {
  habitName: string;
  icon: string;
  color: string;
  strength: number;
  completed: boolean;
  onPress: () => void;
}

export function HabitCard({
  habitName,
  icon,
  color,
  strength,
  completed,
  onPress
}: HabitCardProps) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: completed
            ? 'rgba(16, 185, 129, 0.1)'
            : theme.custom.colors.light.card
        }
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${habitName}, ${completed ? 'completed' : 'not completed'}`}
    >
      {/* Accent bar (4pt wide) */}
      <View style={[
        styles.accentBar,
        { backgroundColor: color }
      ]} />

      {/* Icon (32pt) */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: color }
      ]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content (flexible) */}
      <View style={styles.content}>
        <Text style={[
          theme.custom.typography.heading3,
          { color: theme.custom.colors.gray[700] }
        ]}>
          {habitName}
        </Text>

        <HabitStrengthIndicator
          strength={strength}
          variant="compact"
          showPercentage
        />
      </View>

      {/* Status icon (24pt) */}
      <View style={styles.statusIcon}>
        <Text style={{ fontSize: 20 }}>
          {completed ? '✓' : '○'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 20, // Extra 4pt for accent bar
    height: 72,
    borderRadius: 12,
    gap: 8,

    // Shadow from Figma spec
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2, // Android
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  statusIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

---

## 🔄 Figma MCP Integration Workflow

### Extracting Design Context from Figma

**Use Case:** You have a Figma design and want to generate code

**Available MCP Tools:**

#### 1. Get Design Context (Extract Component Code)
```typescript
// In Claude Code with Figma MCP connected
mcp__figma-desktop__get_design_context({
  nodeId: "123:456",  // From Figma URL
  clientLanguages: "typescript,javascript",
  clientFrameworks: "react-native"
})
```

**Returns:**
- Component structure in XML
- Styling properties
- Layout constraints
- Text content

**Next Step:** Convert XML to React Native component

---

#### 2. Get Variable Definitions
```typescript
mcp__figma-desktop__get_variable_defs({
  nodeId: "123:456"
})
```

**Returns:** Color variables, text styles used in the design

**Use Case:** Sync Figma variables with your theme files

---

#### 3. Get Screenshot (Visual Reference)
```typescript
mcp__figma-desktop__get_screenshot({
  nodeId: "123:456"
})
```

**Returns:** PNG screenshot of the design

**Use Case:** Visual comparison during implementation

---

### Workflow: Figma → Code

**Step 1: Extract Design from Figma**
```bash
# In Claude Code (with Figma open in desktop app)
mcp__figma-desktop__get_design_context({
  nodeId: "1:2"
})
```

**Step 2: Map to Existing Components**
- Check if component exists in `src/components/`
- Use existing components when possible
- Reuse theme tokens from `src/theme/`

**Step 3: Generate New Component**
```bash
# Use extracted context + design tokens + Figma spec
# Generate TypeScript component
```

**Step 4: Apply Theme**
```typescript
import { useAppTheme } from '@/theme';

// Use theme.custom.colors, typography, spacing
```

**Step 5: Add Animation**
```typescript
import { withSpring } from 'react-native-reanimated';

// Follow Figma animation specs
```

---

## 📋 Checklists

### Design Token Checklist

When importing new Figma designs:

- [ ] Check if color exists in `src/theme/colors.ts`
- [ ] Verify WCAG AA contrast (use `colors.test.ts` pattern)
- [ ] Add to theme if new color needed
- [ ] Update `figma-design-tokens.json` if adding tokens
- [ ] Use `theme.custom.colors` not hardcoded hex

---

### Component Implementation Checklist

When building a Figma component:

- [ ] Read Figma component spec from `figma-components-spec.json`
- [ ] Check if similar component exists in `src/components/`
- [ ] Use NativeWind for layout (`className`)
- [ ] Use theme for colors/typography (`style`)
- [ ] Add TypeScript types for props
- [ ] Include accessibility props (`accessible`, `accessibilityRole`, `accessibilityLabel`)
- [ ] Add animation with Reanimated (if specified)
- [ ] Write tests in `__tests__/` folder
- [ ] Document in component file header

---

### Animation Checklist

When implementing Figma animations:

- [ ] Use `withSpring({ damping: 15, stiffness: 150 })` for standard
- [ ] Use `withSpring({ damping: 10, stiffness: 100 })` for bouncy
- [ ] Add haptic feedback with `expo-haptics`
- [ ] Respect Reduce Motion (check `AccessibilityInfo`)
- [ ] Use `useSharedValue` and `useAnimatedStyle`
- [ ] Apply `useNativeDriver: true` (done automatically by Reanimated)
- [ ] Test on iPhone SE (minimum device)

---

## 🔗 File References

### Design System Files
- **Colors:** `src/theme/colors.ts`
- **Typography:** `src/theme/typography.ts`
- **Spacing:** `src/theme/spacing.ts`
- **Theme Hook:** `src/theme/index.ts` (export `useAppTheme`)

### Figma Export Files
- **Design Tokens:** `docs/figma-design-tokens.json`
- **Component Specs:** `docs/figma-components-spec.json`
- **Design Spec:** `docs/figma-design-spec.md`
- **UX Specification:** `docs/ux-specification.md`

### Existing Components
- **HabitStrengthIndicator:** `src/components/HabitStrengthIndicator/HabitStrengthIndicator.tsx`
- **ColorPickerSheet:** `src/components/CreateHabitModal/ColorPickerSheet.tsx`
- **Button:** `src/components/Button.tsx`
- **Card:** `src/components/Card.tsx`
- **EmptyState:** `src/components/EmptyState.tsx`

### Tailwind Config
- **Config File:** `tailwind.config.js`
- **CSS Variables:** Uses HSL variables (`hsl(var(--primary))`)

---

## 🚀 Quick Start Workflows

### Workflow 1: Import New Color from Figma

```bash
# 1. Extract from Figma
mcp__figma-desktop__get_variable_defs({ nodeId: "..." })

# 2. Add to src/theme/colors.ts
export const colors = {
  ...existing,
  newColor: '#HEX_VALUE',
} as const;

# 3. Add test in src/theme/__tests__/colors.test.ts
it('should match UX spec NewColor (#HEX_VALUE)', () => {
  expect(colors.newColor).toBe('#HEX_VALUE');
});

# 4. Run tests
npm test -- colors.test.ts
```

---

### Workflow 2: Build Component from Figma

```bash
# 1. Read Figma component spec
cat docs/figma-components-spec.json | jq '.components.ComponentName'

# 2. Create component file
touch src/components/ComponentName.tsx

# 3. Implement using:
# - NativeWind for layout
# - theme.custom for colors/typography
# - Reanimated for animations

# 4. Add test
touch src/components/__tests__/ComponentName.test.tsx

# 5. Export from index
echo "export { default as ComponentName } from './ComponentName';" >> src/components/index.ts
```

---

### Workflow 3: Extract & Generate from Figma MCP

```typescript
// 1. Get design context
const context = await mcp__figma-desktop__get_design_context({
  nodeId: "123:456",
  clientLanguages: "typescript",
  clientFrameworks: "react-native"
});

// 2. Parse XML structure
// 3. Map to theme tokens
// 4. Generate React Native component
// 5. Apply styling patterns
// 6. Add animations
```

---

## 💡 Best Practices

### DO ✅

- **Use existing components** from `src/components/` when possible
- **Import theme** with `useAppTheme()` for colors/typography
- **Use NativeWind** for layout and spacing
- **Add accessibility** props to all interactive elements
- **Test on device** not just simulator
- **Follow naming** conventions (PascalCase components)
- **Write tests** for business logic and rendering

### DON'T ❌

- **Hardcode colors** - use `theme.custom.colors`
- **Hardcode sizes** - use `theme.custom.spacing`
- **Ignore accessibility** - always add labels
- **Skip animations** - use Reanimated with spring physics
- **Use inline styles** everywhere - prefer StyleSheet or NativeWind
- **Forget dark mode** - prepare styles for both themes

---

## 🎓 Learning Resources

### Internal Documentation
- `docs/ux-specification.md` - Complete UX strategy
- `docs/figma-design-spec.md` - Visual design details
- `docs/ai-frontend-prompt.md` - Code implementation guide
- `docs/figma-import-guide.md` - Figma setup instructions

### External Resources
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [React Native Paper](https://reactnativepaper.com/)

---

## 🔧 Troubleshooting

### Issue: Figma colors don't match code

**Solution:**
1. Check `src/theme/colors.ts` for exact hex values
2. Run `npm test -- colors.test.ts` to verify
3. If mismatch, update `colors.ts` and re-export theme

---

### Issue: NativeWind classes not working

**Solution:**
1. Check `tailwind.config.js` includes correct content paths
2. Verify `nativewind/preset` is in presets array
3. Restart Metro bundler: `npm run expo:start -- --clear`

---

### Issue: Animations are janky

**Solution:**
1. Use `useNativeDriver` (Reanimated does this automatically)
2. Avoid animating `width`/`height` - use `transform` instead
3. Profile with React DevTools Performance tab
4. Test on iPhone SE (minimum device)

---

## 📞 Support

**Questions?**
- Reference Figma spec files in `/docs`
- Check existing components in `/src/components`
- Review theme tests in `/src/theme/__tests__`

---

**Ready to build!** 🚀

This guide ensures your Figma designs seamlessly integrate with your React Native codebase, maintaining consistency and quality throughout the development process.
