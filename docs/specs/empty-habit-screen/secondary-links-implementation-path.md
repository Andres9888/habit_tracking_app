# Secondary Links Inline - Implementation Path

## Quick Overview

Replace the current `SecondaryLinks` component with a new `InlineHint` component that displays links as a natural sentence directly below the CTA button.

**Estimated Time**: ~1 hour
**Complexity**: Low
**Files Modified**: 6
**Files Created**: 2
**Risk Level**: Low (isolated component swap)

---

## Visual Implementation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Add Color Constant (2 min)                          │
│ ─────────────────────────────────────────────────────────  │
│ File: constants.ts                                          │
│                                                              │
│ export const COLORS = {                                     │
│   // ... existing colors                                    │
│   stone600: '#57534E',  // NEW: For inline hint base text  │
│   // ...                                                    │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Create InlineHint Component (20 min)                │
│ ─────────────────────────────────────────────────────────  │
│ File: InlineHint.tsx (NEW)                                  │
│                                                              │
│ Component Structure:                                        │
│ <View style={{ marginTop: 16, alignItems: 'center' }}>     │
│   <Text>                                                    │
│     or explore{' '}                                         │
│     <Pressable onPress={onBrowseTemplates}>                │
│       <Text style={linkStyle}>templates</Text>             │
│     </Pressable>                                            │
│     {' '}and{' '}                                           │
│     <Pressable onPress={onCreateCustom}>                   │
│       <Text style={linkStyle}>custom options</Text>        │
│     </Pressable>                                            │
│   </Text>                                                   │
│ </View>                                                     │
│                                                              │
│ Props: { onBrowseTemplates, onCreateCustom }               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Update Exports (2 min)                              │
│ ─────────────────────────────────────────────────────────  │
│ File: index.ts                                              │
│                                                              │
│ // Add new export                                           │
│ export { InlineHint } from './InlineHint';                 │
│                                                              │
│ // Remove old export (keep file for reference)             │
│ // export { SecondaryLinks } from './SecondaryLinks';      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Integrate in Main Component (10 min)                │
│ ─────────────────────────────────────────────────────────  │
│ File: HabitsEmptyStateMinimal.tsx                           │
│                                                              │
│ BEFORE:                                                     │
│ import { SecondaryLinks } from './SecondaryLinks';         │
│ ...                                                         │
│ <SecondaryLinks                                             │
│   onBrowseTemplates={openTemplatesScreen}                  │
│   onCreateCustom={openCreateHabitScreen}                   │
│ />                                                          │
│                                                              │
│ AFTER:                                                      │
│ import { InlineHint } from './InlineHint';                 │
│ ...                                                         │
│ <InlineHint                                                 │
│   onBrowseTemplates={openTemplatesScreen}                  │
│   onCreateCustom={openCreateHabitScreen}                   │
│ />                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Add Unit Tests (15 min)                             │
│ ─────────────────────────────────────────────────────────  │
│ File: InlineHint.test.tsx (NEW)                             │
│                                                              │
│ Test Cases:                                                 │
│ ✓ Renders text: "or explore ... and ..."                   │
│ ✓ Templates link calls onBrowseTemplates                   │
│ ✓ Custom options link calls onCreateCustom                 │
│ ✓ Accessibility labels are correct                         │
│ ✓ Both links are pressable                                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Update Integration Tests (10 min)                   │
│ ─────────────────────────────────────────────────────────  │
│ File: HabitsEmptyStateMinimal.test.tsx                      │
│                                                              │
│ Updates:                                                    │
│ • Find links by new accessibility labels                   │
│ • Verify callbacks still work                              │
│ • Existing keyboard-aware tests still pass                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Manual QA (10 min)                                  │
│ ─────────────────────────────────────────────────────────  │
│ Checklist:                                                  │
│ □ Text is readable (14px, good contrast)                   │
│ □ Links are distinguishable from base text                 │
│ □ Touch targets are easy to tap                            │
│ □ Sentence flows naturally                                 │
│ □ Fades out when keyboard opens                            │
│ □ Test on iPhone SE & iPhone 13                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
                            DONE ✓
```

---

## File Tree Changes

```
src/features/habits/components/HabitsEmptyStateMinimal/
├── InlineHint.tsx                    ← NEW (Step 2)
├── __tests__/
│   ├── InlineHint.test.tsx           ← NEW (Step 5)
│   └── HabitsEmptyStateMinimal.test.tsx  ← MODIFIED (Step 6)
├── HabitsEmptyStateMinimal.tsx       ← MODIFIED (Step 4)
├── SecondaryLinks.tsx                ← KEEP (deprecated, for reference)
├── constants.ts                      ← MODIFIED (Step 1)
└── index.ts                          ← MODIFIED (Step 3)
```

---

## Code Diff Preview

### 1. constants.ts
```diff
export const COLORS = {
  // ... existing colors
+ stone600: '#57534E', // For inline hint base text
  // ...
} as const;
```

### 2. InlineHint.tsx (NEW FILE)
```typescript
/**
 * InlineHint - Secondary navigation links inline after CTA
 */
import { Pressable, Text, View } from 'react-native';
import { COLORS } from './constants';
import type { InlineHintProps } from './types';

export function InlineHint({
  onBrowseTemplates,
  onCreateCustom,
}: InlineHintProps) {
  return (
    <View
      style={{
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: COLORS.stone600,
          lineHeight: 21,
          textAlign: 'center',
        }}
      >
        or explore{' '}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Browse habit templates"
          accessibilityHint="Opens screen with pre-made habit templates"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            padding: 6,
          })}
          onPress={onBrowseTemplates}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.emerald700,
            }}
          >
            templates
          </Text>
        </Pressable>
        {' '}and{' '}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create custom habit"
          accessibilityHint="Opens full habit creation screen"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            padding: 6,
          })}
          onPress={onCreateCustom}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.emerald700,
            }}
          >
            custom options
          </Text>
        </Pressable>
      </Text>
    </View>
  );
}
```

### 3. types.ts
```diff
+ export interface InlineHintProps {
+   onBrowseTemplates: () => void;
+   onCreateCustom: () => void;
+ }
```

### 4. index.ts
```diff
export { AnimatedEntrance } from './AnimatedEntrance';
export { CtaButton } from './CtaButton';
export { ErrorMessage } from './ErrorMessage';
export { HabitInput } from './HabitInput';
export { HeroIcon } from './HeroIcon';
+ export { InlineHint } from './InlineHint';
export { LoadingSkeleton } from './LoadingSkeleton';
- export { SecondaryLinks } from './SecondaryLinks';
export { SuccessState } from './SuccessState';
export { SuggestionChips } from './SuggestionChips';
```

### 5. HabitsEmptyStateMinimal.tsx
```diff
- import { SecondaryLinks } from './SecondaryLinks';
+ import { InlineHint } from './InlineHint';

// ... (in render section)

- <SecondaryLinks
+ <InlineHint
    onBrowseTemplates={openTemplatesScreen}
    onCreateCustom={openCreateHabitScreen}
  />
```

---

## Testing Checklist

### Unit Tests (InlineHint.test.tsx)

```typescript
✓ Renders "or explore" base text
✓ Renders "templates" link
✓ Renders "and" connector text
✓ Renders "custom options" link
✓ onBrowseTemplates fires on templates link press
✓ onCreateCustom fires on custom options link press
✓ Templates link has correct accessibility label
✓ Custom options link has correct accessibility label
✓ Pressed opacity changes to 0.7
```

### Integration Tests (HabitsEmptyStateMinimal.test.tsx)

```typescript
✓ InlineHint renders in empty state
✓ Templates link navigates to templates screen
✓ Custom options link navigates to create habit screen
✓ InlineHint fades out when keyboard opens
✓ InlineHint visible when keyboard closes
```

### Manual QA

```
□ Open empty habits screen
□ Verify text is readable at 14px
□ Tap "templates" - opens templates screen
□ Tap "custom options" - opens create habit screen
□ Tap input - keyboard opens, inline hint fades out
□ Dismiss keyboard - inline hint fades back in
□ Test on iPhone SE (small screen)
□ Test on iPhone 13 (with safe area)
```

---

## Rollback Plan

If issues arise, rollback is simple:

```diff
# Revert Step 4 (HabitsEmptyStateMinimal.tsx)
- import { InlineHint } from './InlineHint';
+ import { SecondaryLinks } from './SecondaryLinks';

- <InlineHint
+ <SecondaryLinks
    onBrowseTemplates={openTemplatesScreen}
    onCreateCustom={openCreateHabitScreen}
  />
```

```diff
# Revert Step 3 (index.ts)
- export { InlineHint } from './InlineHint';
+ export { SecondaryLinks } from './SecondaryLinks';
```

The old `SecondaryLinks.tsx` file remains untouched, so reverting is instant.

---

## Success Criteria

After implementation, verify:

1. **Visibility**: Links are easier to see (14px, better contrast)
2. **Reading Flow**: Natural sentence progression from CTA
3. **Accessibility**: WCAG AA contrast (5.74:1 base, 6.38:1 links)
4. **Touch Targets**: Easy to tap (44pt minimum)
5. **Tests Pass**: All unit + integration tests green
6. **No Regressions**: Keyboard animation still works
7. **Safe Area**: Links remain visible with bottom padding

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Text wrapping on small screens | Low | Low | 14px allows graceful wrap, center-aligned |
| Translation length issues | Medium | Low | lineHeight: 21px accommodates 2 lines |
| Inline Pressable not working | Low | Medium | Standard RN pattern, well-tested |
| Accessibility concerns | Low | High | Proper labels + hints, meets WCAG AA |
| Keyboard animation breaks | Low | Medium | Same AnimatedEntrance wrapper as before |

**Overall Risk**: **LOW** - Simple component swap with isolated changes.

---

## Next Steps

1. **Review Spec**: Await CodeRabbit review feedback
2. **Implement**: Follow steps 1-6 in sequence
3. **Test**: Run unit tests, integration tests, manual QA
4. **Commit**: Create commit with clear message
5. **Monitor**: Watch for user feedback on discoverability

---

## Related Documentation

- **Spec**: `docs/specs/empty-habit-screen/secondary-links-inline-spec.md`
- **Design Mock**: `.superdesign/design_iterations/empty_state_secondary_links_improvements_2.html` (Option F)
- **Safe Area Fix**: `docs/specs/empty-habit-screen/safe-area-fix-spec.md`
- **Original Component**: `SecondaryLinks.tsx` (deprecated after this change)
