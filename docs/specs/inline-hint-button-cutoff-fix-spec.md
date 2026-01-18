# InlineHint Button Cutoff Fix Specification

**Status: IMPLEMENTED** ✅

> **Note**: This spec covers the InlineHint component (the "or explore" section with templates/custom buttons).
> For the SuggestionChips component (habit quick-add buttons), a separate fix maintains the 3-2-1 pyramid layout with compact chip sizing to fit 320pt screens.

## Problem Statement

The "or explore 📋 templates and ✨ custom habit" row on the empty habits page is being cut off at the left and right edges of the screen. This is a **recurring issue** that has been attempted to be fixed multiple times but keeps reappearing.

### Why This Keeps Happening

1. **Nested padding conflict**: The `HabitsEmptyStateMinimal` component has `paddingHorizontal: 24`, but the `InlineHint` uses `flexWrap: 'wrap'` with inline elements that can overflow
2. **`ListEmptyComponent` rendering context**: The component is rendered inside a `DraggableFlatList` which has its own `contentContainerStyle` padding, but `ListEmptyComponent` doesn't inherit this padding consistently
3. **Inline row layout**: The `flexDirection: 'row'` with `flexWrap: 'wrap'` can cause content to extend to full width before wrapping

## Root Cause Analysis

```
┌─────────────────────────────────────────────────────────────┐
│ DraggableFlatList (paddingHorizontal: 24)                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ListEmptyComponent                                      │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ HabitsEmptyStateMinimal (paddingHorizontal: 24)     │ │ │
│ │ │ ┌─────────────────────────────────────────────────┐ │ │ │
│ │ │ │ InlineHint (width: 100%, no padding)            │ │ │ │
│ │ │ │ ┌───────────────────────────────────────────────┼─┼─┼─┤ ← OVERFLOW!
│ │ │ │ │ "or explore" [📋 templates] "and" [✨ custom] │ │ │ │
│ │ │ │ └───────────────────────────────────────────────┼─┼─┼─┤
│ │ │ └─────────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

The issue: Even with `paddingHorizontal: 24` on the parent, the `InlineHint` View uses `width: 100%` implicitly and its inline content can push against the edges.

## Solution Design

### Option A: Vertical Stack Layout (RECOMMENDED)

Change from horizontal inline layout to a **centered vertical stack** that's more resilient to width constraints.

**Before:**

```
or explore [📋 templates] and [✨ custom habit]
```

**After:**

```
        or explore
  [📋 templates]  [✨ custom]
```

**Benefits:**

- Eliminates horizontal overflow entirely
- Works on all screen sizes without breakpoint logic
- Simpler layout math
- Better visual hierarchy

### Option B: Constrained Width with Max-Width

Keep the inline layout but add explicit width constraints:

```tsx
<View style={{
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: 16,
  maxWidth: '100%',  // Explicit constraint
  paddingHorizontal: 8,  // Additional inner padding
}}>
```

**Benefits:**

- Preserves current design
- Minimal code change

**Drawbacks:**

- May still wrap awkwardly on very narrow screens
- Relies on parent padding being correct

### Option C: Responsive Breakpoint

Use `useWindowDimensions` to switch layouts based on screen width:

```tsx
const { width } = useWindowDimensions();
const isNarrow = width < 360;

// Use vertical layout on narrow screens, horizontal on wider
```

**Benefits:**

- Optimal layout for each screen size

**Drawbacks:**

- More complex logic
- Additional dependency on screen dimensions

## Recommended Implementation (Option A)

### Task 1: Update InlineHint Layout

**File:** `src/features/habits/components/HabitsEmptyStateMinimal/InlineHint.tsx`

Change from:

```tsx
<View
  style={{
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  }}
>
  <Text>or explore </Text>
  <Pressable>[📋 templates]</Pressable>
  <Text> and </Text>
  <Pressable>[✨ custom habit]</Pressable>
</View>
```

To:

```tsx
<View
  style={{
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  }}
>
  {/* Row 1: "or explore" text */}
  <Text
    style={{
      color: COLORS.stone600,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 8,
      textAlign: 'center',
    }}
  >
    or explore
  </Text>

  {/* Row 2: Buttons in horizontal row with gap */}
  <View
    style={{
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
    }}
  >
    <Pressable>[📋 templates]</Pressable>
    <Pressable>[✨ custom]</Pressable>
  </View>
</View>
```

### Task 2: Shorten Button Labels

To further reduce width, shorten "✨ custom habit" to "✨ custom":

- "📋 templates" → Keep as-is (short enough)
- "✨ custom habit" → "✨ custom" (saves ~6 characters)

### Task 3: Update Tests

**File:** `src/features/habits/components/HabitsEmptyStateMinimal/__tests__/InlineHint.test.tsx`

Update tests to match new layout:

- Remove tests for inline text flow (`flexDirection: 'row'`)
- Update text content expectations ("✨ custom" instead of "✨ custom habit")
- Update layout tests for vertical stack pattern

### Task 4: Visual QA Checklist

Test on these screen widths:

- [ ] iPhone SE (320pt width) - smallest common device
- [ ] iPhone 14 (390pt width) - standard size
- [ ] iPhone 14 Pro Max (430pt width) - largest iPhone
- [ ] Android small (360dp width)
- [ ] Tablet portrait mode

Verify:

- [ ] No horizontal cutoff on any device
- [ ] Buttons remain tappable (44pt minimum touch target)
- [ ] Text is readable and properly centered
- [ ] Proper spacing between elements

## Acceptance Criteria

1. **No cutoff**: The buttons must be fully visible on screens as narrow as 320pt
2. **Centered**: All content should be horizontally centered
3. **Accessible**: Touch targets remain at least 44pt
4. **Consistent**: Layout looks good across all supported screen sizes
5. **Tests pass**: All updated tests must pass

## Code Review Checklist

- [ ] No hardcoded pixel widths that could cause overflow
- [ ] Uses percentage or flex-based sizing
- [ ] Touch targets meet 44pt minimum
- [ ] Proper accessibility labels preserved
- [ ] Tests updated to match new layout
- [ ] Verified on smallest supported screen size (320pt)

## Future Prevention

To prevent this issue from recurring:

1. **Add E2E visual regression test** for empty habits screen on narrow viewport
2. **Document minimum supported width** in design system (320pt)
3. **Add lint rule or PR checklist item** to verify horizontal layouts on narrow screens
