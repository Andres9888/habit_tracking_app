# Uniwind Migration - Phase 4: Code Updates

> **Focus**: Removing NativeWind-specific APIs from application code
> **Key Files**: `App.tsx` and any files using NativeWind utilities

## Phase 4 Tasks: Application Code Updates

### 4.1 Remove colorScheme API from App.tsx

**File**: `App.tsx`

- [ ] Remove the NativeWind colorScheme import and usage:

**Before (lines 4-6):**
```typescript
// Force light mode - disable system dark mode detection
import { colorScheme } from 'nativewind';
colorScheme.set('light');
```

**After:**
```typescript
// Light mode is enforced via CSS - no runtime API needed
```

> ⚠️ **Note**: Uniwind doesn't have a `colorScheme` API. Light mode is already enforced in your CSS (no dark mode variables defined), so this is a delete-only change.

### 4.2 Update global.css Import

**File**: `App.tsx`

- [ ] The import stays the same, no change needed:
```typescript
import './global.css';
```

### 4.3 Search for Other NativeWind Imports

- [ ] Search codebase for any other NativeWind imports:
```bash
grep -r "from 'nativewind'" src/
grep -r "from \"nativewind\"" src/
grep -r "nativewind" src/ --include="*.ts" --include="*.tsx"
```

Common NativeWind APIs to look for:
- `colorScheme` - Remove (handled in 4.1)
- `useColorScheme` - Replace with custom hook or CSS media query
- `vars()` - May need adjustment for CSS variable usage
- `styled()` - Not commonly used, but check if present

### 4.4 Check for Safe Area Utilities

- [ ] Search for `-safe` utility classes that aren't supported in Uniwind:
```bash
grep -r "pt-safe\|pb-safe\|pl-safe\|pr-safe\|mt-safe\|mb-safe" src/
```

If found, replace with `react-native-safe-area-context`:
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyComponent() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }}>
      {/* content */}
    </View>
  );
}
```

### 4.5 Verify className Usage Compatibility

- [ ] Most className usage should work unchanged. Verify these patterns:

**These should work as-is:**
```tsx
// Standard Tailwind classes
<View className="flex-1 bg-background" />
<Text className="text-lg font-bold text-foreground" />

// Conditional classes (tailwind-merge handles this)
<View className={cn("p-4", isActive && "bg-primary")} />
```

**May need attention:**
```tsx
// CSS variables in inline styles - verify these still resolve
style={{ backgroundColor: 'hsl(var(--primary))' }}

// Dynamic classes - should work but test
<View className={`bg-${colorName}`} />  // Avoid - use static classes
```

### 4.6 Review Component Files for NativeWind Patterns

- [ ] Check these commonly affected patterns in your components:

```bash
# Find files using cssInterop or other NativeWind patterns
grep -r "cssInterop" src/
grep -r "remapProps" src/
grep -r "createStyleSheet" src/
```

### 4.7 Specific File Updates

Based on your codebase structure, check these files:

#### `src/components/BinaryHeatmap/BinaryHeatmap.tsx`
- [ ] Verify className usage works with Uniwind
- [ ] Check for any NativeWind-specific patterns

#### Other component files
- [ ] `src/components/DateSelector.tsx`
- [ ] `src/components/CalendarTimeline.tsx`
- [ ] `src/components/DraggableHabit.tsx`
- [ ] `src/components/SettingsModal.tsx`
- [ ] `src/screens/CharacterScreen.tsx`
- [ ] `src/screens/HabitDetailScreen.tsx`

### 4.8 tailwind-merge Compatibility

- [ ] Your existing `tailwind-merge` usage should continue to work. Verify `cn()` utility:
```typescript
// src/lib/utils.ts or similar
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

> ⚠️ **Note**: Uniwind doesn't auto-dedupe classes like NativeWind, but since you already use `tailwind-merge`, you're covered.

## Complete App.tsx After Migration

```typescript
// Uniwind global styles
import './global.css';

// Light mode is enforced via CSS variables in global.css
// No runtime theme switching needed

import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import {
  ConvexProvider,
  ConvexReactClient,
  useMutation,
  useQuery,
} from 'convex/react';
// ... rest of imports unchanged
```

## Verification

- [ ] App compiles without NativeWind import errors
- [ ] All components render correctly
- [ ] className-based styling still works
- [ ] No console warnings about missing modules
- [ ] Theme colors display correctly (light mode)

## Files Changed Summary

| File | Change |
|------|--------|
| `App.tsx` | Remove `colorScheme` import and `.set()` call |
| `src/*` | Verify no NativeWind-specific imports |

---
**Previous Phase**: [UNIWIND_MIGRATION-3.md](./UNIWIND_MIGRATION-3.md) - Theme Conversion
**Next Phase**: [UNIWIND_MIGRATION-5.md](./UNIWIND_MIGRATION-5.md) - Testing & Validation
