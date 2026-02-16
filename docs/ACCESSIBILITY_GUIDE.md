# Accessibility Guide - Chain Day Habit Tracker

This guide documents accessibility best practices and requirements for the Chain Day app.

## Table of Contents

1. [Color Contrast](#color-contrast)
2. [Touch Targets](#touch-targets)
3. [Text Scaling](#text-scaling)
4. [Screen Reader Support](#screen-reader-support)
5. [Focus Management](#focus-management)
6. [Error Handling](#error-handling)
7. [Images & Icons](#images--icons)

---

## Color Contrast

**Requirement**: WCAG AA Level
- Regular text (< 18pt): **4.5:1** minimum contrast ratio
- Large text (≥ 18pt or 14pt bold): **3:1** minimum contrast ratio
- UI components: **3:1** minimum contrast ratio

### Color System

Our color palette is WCAG AA compliant. See `src/theme/colors/core.ts` for annotated contrast ratios.

#### Light Mode
- Primary text: `#2D2A26` on `#F5F1ED` (high contrast)
- Secondary text: `#6B6560` on `#F5F1ED` (5.1:1)
- Error: `#B53030` on `#F5F1ED` (5.45:1)
- Success: `#15793C` on `#F5F1ED` (4.88:1)

#### Dark Mode
- Primary text: `#F9FAFB` on `#111827`
- Secondary text: `#9CA3AF` on `#1F2937`
- Tertiary text: `#8E95A2` on `#1F2937` (4.87:1)

### Testing Contrast

Use these tools to verify contrast:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)

---

## Touch Targets

**Requirement**: Minimum **44×44pt** touch target for all interactive elements.

### Component Standards

All interactive components meet minimum touch target requirements:

```typescript
// Button sizes
small: 44pt height ✅
medium: 44pt height ✅
large: 56pt height ✅

// Inputs
TextInput: 44pt height ✅

// Tab Bar
TabBar: 49pt height ✅
```

### Implementation

When creating custom interactive components:

```tsx
// ✅ Good - meets 44pt minimum
<Pressable
  style={{
    minHeight: 44,
    minWidth: 44,
    // ... other styles
  }}
>
  {/* content */}
</Pressable>

// ❌ Bad - too small
<Pressable style={{ height: 32, width: 32 }}>
  <Icon size={16} />
</Pressable>
```

---

## Text Scaling

**Requirement**: Support Dynamic Type while preventing layout breaking.

### Implementation

Use `maxFontSizeMultiplier` on **all** Text components:

```tsx
import { AccessibleText } from '@/components/ui/AccessibleText';

// Body text - allows 2.5x scaling
<AccessibleText scalingType="body">
  This is readable paragraph text
</AccessibleText>

// UI text - default 2.0x scaling
<AccessibleText scalingType="ui">
  Button Label
</AccessibleText>

// Strict - layout-critical (1.5x)
<AccessibleText scalingType="strict">
  Tab Bar Label
</AccessibleText>

// Or use native Text with manual multiplier
<Text maxFontSizeMultiplier={2.0}>
  Some text
</Text>
```

### Scaling Levels

| Type | Multiplier | Use Case |
|------|------------|----------|
| `body` | 2.5 | Article text, note content, descriptions |
| `ui` | 2.0 | Buttons, labels, cards, most UI text |
| `strict` | 1.5 | Tab bars, headers, layout-critical text |

**Never omit `maxFontSizeMultiplier`** - it prevents infinite scaling that breaks layouts.

---

## Screen Reader Support

### Accessibility Labels

Every interactive element must have a descriptive label:

```tsx
// ✅ Good
<Button accessibilityLabel="Save habit">
  <SaveIcon />
</Button>

<TextInput
  accessibilityLabel="Habit name"
  placeholder="Enter habit name"
/>

// ❌ Bad - no label for icon-only button
<Button>
  <SaveIcon />
</Button>
```

### Accessibility Hints

Add hints for non-obvious actions:

```tsx
<Pressable
  accessibilityLabel="Delete habit"
  accessibilityHint="Double tap to permanently delete this habit"
  accessibilityRole="button"
>
  <TrashIcon />
</Pressable>
```

### Accessibility Roles

Use semantic roles for better screen reader context:

```tsx
<View accessibilityRole="header">
  <Text>Habits</Text>
</View>

<Pressable accessibilityRole="button" />
<Pressable accessibilityRole="checkbox" />
<View accessibilityRole="list">
  <View accessibilityRole="listitem" />
</View>
```

### Live Regions

Announce dynamic content changes:

```tsx
// Validation errors, status updates
<View accessibilityLiveRegion="polite">
  <Text>{statusMessage}</Text>
</View>

// Critical alerts
<View accessibilityLiveRegion="assertive">
  <Text>{criticalError}</Text>
</View>
```

### Decorative Elements

Hide decorative images from screen readers:

```tsx
// Decorative icon
<Image
  source={decorativePattern}
  accessibilityElementsHidden
  importantForAccessibility="no"
/>

// Meaningful image
<Image
  source={habitPhoto}
  accessibilityLabel="Morning meditation session"
/>
```

---

## Focus Management

### Focus Order

Ensure logical tab order in forms and modals:

```tsx
// Use ref and returnKeyType for forms
const nameRef = useRef<TextInput>(null);
const descRef = useRef<TextInput>(null);

<TextInput
  accessibilityLabel="Habit name"
  returnKeyType="next"
  onSubmitEditing={() => descRef.current?.focus()}
/>

<TextInput
  ref={descRef}
  accessibilityLabel="Description"
  returnKeyType="done"
/>
```

### Focus Indicators

Use the `useFocusRing` hook for keyboard navigation:

```tsx
import { useFocusRing } from '@/utils/accessibility';

function MyButton() {
  const { focusStyle, focusHandlers } = useFocusRing({
    disabled: false,
  });

  return (
    <Pressable
      {...focusHandlers}
      style={[styles.button, focusStyle]}
    >
      {/* content */}
    </Pressable>
  );
}
```

---

## Error Handling

### Accessible Error Messages

Use `AccessibleErrorMessage` component for form errors:

```tsx
import { AccessibleErrorMessage } from '@/components/ui/AccessibleErrorMessage';

function MyForm() {
  const [error, setError] = useState<string | null>(null);

  return (
    <View>
      <TextInput
        accessibilityLabel="Email"
        // ...
      />
      <AccessibleErrorMessage
        message={error}
        urgency="polite"
      />
    </View>
  );
}
```

### Features
- Automatically announces to screen readers via `accessibilityLiveRegion`
- Marked with `accessibilityRole="alert"`
- Respects font scaling
- Only renders when error exists

### Urgency Levels

```tsx
// Form validation (default)
<AccessibleErrorMessage
  message="Email is required"
  urgency="polite"
/>

// Critical system errors
<AccessibleErrorMessage
  message="Unable to sync data"
  urgency="assertive"
/>
```

---

## Images & Icons

### Meaningful Images

All images must have alt text:

```tsx
import { Image } from 'expo-image';

// User-uploaded content
<Image
  source={{ uri: imageUrl }}
  accessibilityLabel={caption || "User uploaded image"}
/>

// Habit icons
<Image
  source={habitIcon}
  accessibilityLabel={`${habitName} habit icon`}
/>
```

### Decorative Images

Mark purely decorative images:

```tsx
// Background patterns, dividers
<Image
  source={backgroundPattern}
  accessibilityElementsHidden
  importantForAccessibility="no"
/>
```

### Icon Buttons

Icon-only buttons need labels:

```tsx
// ✅ Good
<Pressable
  accessibilityLabel="Edit habit"
  accessibilityRole="button"
>
  <EditIcon size={20} />
</Pressable>

// ✅ Also good - icon with visible label
<Pressable accessibilityRole="button">
  <EditIcon size={20} />
  <Text>Edit</Text>
</Pressable>
```

---

## Testing Checklist

### Manual Testing

- [ ] Enable VoiceOver (iOS) or TalkBack (Android)
- [ ] Navigate entire app using only screen reader
- [ ] Verify all interactive elements have labels
- [ ] Check error announcements work
- [ ] Test with 200% system font size
- [ ] Verify tab order in forms makes sense
- [ ] Test in both light and dark mode

### Automated Testing

```bash
# Run accessibility lint rules
npm run lint:a11y

# Check color contrast in components
npm run test:contrast
```

### Tools

- **iOS**: Settings > Accessibility > VoiceOver
- **Android**: Settings > Accessibility > TalkBack
- **React Native Debugger**: Accessibility Inspector
- **Flipper**: Accessibility Plugin

---

## Common Mistakes to Avoid

### ❌ Don't Do This

```tsx
// Missing maxFontSizeMultiplier
<Text>Some text</Text>

// Icon button without label
<Button><SaveIcon /></Button>

// Error without live region
{error && <Text>{error}</Text>}

// Decorative image not hidden
<Image source={pattern} />

// Too-small touch target
<Pressable style={{ height: 32, width: 32 }} />
```

### ✅ Do This Instead

```tsx
// Include maxFontSizeMultiplier
<Text maxFontSizeMultiplier={2.0}>Some text</Text>

// Icon button with label
<Button accessibilityLabel="Save habit">
  <SaveIcon />
</Button>

// Error with announcement
<AccessibleErrorMessage message={error} />

// Decorative image hidden
<Image
  source={pattern}
  accessibilityElementsHidden
  importantForAccessibility="no"
/>

// Proper touch target
<Pressable style={{ minHeight: 44, minWidth: 44 }} />
```

---

## Resources

- [React Native Accessibility Docs](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Accessibility Programming Guide](https://developer.apple.com/accessibility/ios/)
- [Android Accessibility Guide](https://developer.android.com/guide/topics/ui/accessibility)
- [WebAIM Resources](https://webaim.org/)

---

## Questions?

For accessibility questions or issues, contact the development team or file an issue in the repository.
