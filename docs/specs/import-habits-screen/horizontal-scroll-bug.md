# Import Habits Screen - Horizontal Scroll Bug Specification

## Problem Statement

The horizontal scroll in the Import Habits (Templates) screen is inconsistent and unreliable. When users try to scroll horizontally through template cards within expanded category sections, the scroll behavior is unpredictable - sometimes it works, sometimes it doesn't respond at all.

### Symptoms

1. **Inconsistent scroll response** - Horizontal swipe gestures are sometimes captured, sometimes ignored
2. **Scroll conflicts** - The vertical parent ScrollView may be capturing horizontal gestures
3. **Loading-related issues** - The problem may be exacerbated when templates are still loading
4. **Gesture competition** - Multiple nested scrollable containers compete for touch events

---

## Current State Analysis

### Component Hierarchy

```
TemplatesScreen.tsx
└── ScrollView (vertical - browseContent)
    └── CollapsibleCategorySection.tsx (multiple)
        └── Animated.View (expanded content)
            └── ScrollView (horizontal - templatesScroll)
                └── MiniTemplateCard (multiple)
```

### Affected Files

| File | Role | Issue |
|------|------|-------|
| `src/screens/TemplatesScreen.tsx` | Parent screen with vertical ScrollView | Outer scroll may intercept horizontal gestures |
| `src/components/CollapsibleCategorySection.tsx` | Contains horizontal ScrollView | No gesture handling configuration |
| `src/components/MiniTemplateCard.tsx` | Individual card with press handlers | Pressable may conflict with scroll |

### CollapsibleCategorySection.tsx (lines 136-165)

```tsx
{isExpanded && (
  <Animated.View
    entering={FadeIn.duration(200)}
    exiting={FadeOut.duration(150)}
    style={styles.content}
  >
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.templatesScroll}
    >
      {templates.map((template) => (
        <MiniTemplateCard ... />
      ))}
    </ScrollView>
  </Animated.View>
)}
```

**Problems Identified**:
1. No `nestedScrollEnabled` prop on horizontal ScrollView
2. No scroll event throttling
3. No directional lock configuration
4. Parent vertical ScrollView has no gesture coordination
5. Animated enter/exit may interfere with scroll recognition during transitions

### TemplatesScreen.tsx (lines 676-706)

```tsx
<ScrollView
  ref={scrollViewRef}
  contentContainerStyle={styles.browseContent}
  showsVerticalScrollIndicator={false}
>
  <View style={styles.categorySections}>
    {categories?.map(...)}
  </View>
</ScrollView>
```

**Problems Identified**:
1. No `nestedScrollEnabled` prop
2. No directional lock (`directionalLockEnabled`)
3. No scroll event throttling
4. Wraps the horizontal ScrollViews without gesture coordination

---

## Root Cause Analysis

### 1. Gesture Conflict (Primary Cause)

React Native's gesture system has difficulty distinguishing between:
- Vertical scroll intent (parent ScrollView)
- Horizontal scroll intent (child ScrollView in CollapsibleCategorySection)

When the user's gesture is diagonal or starts slightly vertical, the parent ScrollView captures it.

### 2. Missing Nested Scroll Configuration

The horizontal ScrollView lacks `nestedScrollEnabled={true}`, which on Android specifically helps coordinate nested scroll containers.

### 3. Animation Interference

The `entering={FadeIn.duration(200)}` animation on the container may delay the ScrollView's gesture responder registration, causing initial scroll attempts to fail.

### 4. Pressable Touch Competition

Each `MiniTemplateCard` has `onPress`, `onPressIn`, and `onPressOut` handlers. The Pressable component's responder negotiation may:
- Capture touches that should scroll
- Delay scroll recognition while determining if it's a tap or scroll

### 5. No Directional Lock

Without `directionalLockEnabled`, the parent ScrollView continues to respond to gestures even when the user clearly intends horizontal movement.

---

## Proposed Solution

### Phase 1: Core Scroll Fixes

#### 1.1 Update CollapsibleCategorySection.tsx

```tsx
<ScrollView
  horizontal
  nestedScrollEnabled={true}  // Add for Android nested scroll support
  directionalLockEnabled={true}  // Lock direction once started
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.templatesScroll}
  scrollEventThrottle={16}  // Smooth scroll events
  decelerationRate="fast"  // Better feel for horizontal card scrolling
>
```

#### 1.2 Update Parent ScrollView in TemplatesScreen.tsx

```tsx
<ScrollView
  ref={scrollViewRef}
  contentContainerStyle={styles.browseContent}
  showsVerticalScrollIndicator={false}
  nestedScrollEnabled={true}  // Add
  directionalLockEnabled={true}  // Add - lock to vertical
>
```

### Phase 2: Gesture Improvements

#### 2.1 Add GestureHandlerRootView (if not present)

Ensure the app wraps screens in `GestureHandlerRootView` from `react-native-gesture-handler` for proper gesture coordination.

#### 2.2 Consider Using FlatList Instead of ScrollView

Replace the horizontal ScrollView with FlatList for:
- Better performance with many templates
- More predictable gesture handling
- Built-in virtualization

```tsx
<FlatList
  data={templates}
  horizontal
  nestedScrollEnabled={true}
  directionalLockEnabled={true}
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => <MiniTemplateCard ... />}
  contentContainerStyle={styles.templatesScroll}
  initialNumToRender={4}
  maxToRenderPerBatch={4}
  windowSize={3}
/>
```

### Phase 3: Touch Target Optimization

#### 3.1 Delay Pressable Response

Add `delayPressIn` to MiniTemplateCard to allow scroll gestures to be recognized:

```tsx
<Pressable
  onPress={handlePress}
  delayPressIn={50}  // Small delay to allow scroll to take over
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
>
```

#### 3.2 Alternative: Use TouchableWithoutFeedback for Wrapper

Wrap cards in a component that doesn't compete for gestures as aggressively.

### Phase 4: Loading State Handling

#### 4.1 Prevent Scroll During Initial Render

Add a small delay before enabling scroll after expansion:

```tsx
const [scrollEnabled, setScrollEnabled] = useState(false);

useEffect(() => {
  if (isExpanded) {
    const timer = setTimeout(() => setScrollEnabled(true), 250);
    return () => clearTimeout(timer);
  } else {
    setScrollEnabled(false);
  }
}, [isExpanded]);

<ScrollView
  horizontal
  scrollEnabled={scrollEnabled}
  ...
/>
```

---

## Implementation Tasks

### Phase 1: Quick Fixes (High Priority)
- [x] Add `nestedScrollEnabled={true}` to horizontal ScrollView in CollapsibleCategorySection
- [x] Add `directionalLockEnabled={true}` to both parent and child ScrollViews
- [x] Add `scrollEventThrottle={16}` to horizontal ScrollView
- [ ] Test on both iOS and Android

### Phase 2: Gesture Optimization
- [x] Add `delayPressIn={50}` to MiniTemplateCard Pressable
- [ ] Evaluate replacing ScrollView with FlatList for horizontal scroll
- [ ] Test with slow 3G network simulation to verify loading behavior

### Phase 3: Animation Timing
- [ ] Investigate if enter animation delays scroll responder
- [ ] Consider using `onLayout` callback to enable scroll after layout complete
- [ ] Test with `entering` animation removed to isolate issue

### Phase 4: Testing & Validation
- [ ] Test with 10+ templates per category
- [ ] Test rapid expand/collapse of categories
- [ ] Test on low-end Android devices
- [ ] Test with React Native debugger enabled (slower)

---

## Success Metrics

1. **Scroll reliability**: 100% of horizontal swipe gestures should initiate horizontal scroll
2. **No vertical interference**: Horizontal scroll should not trigger vertical scroll
3. **First-attempt success**: User's first swipe after expanding a category should work
4. **Performance**: Scroll should maintain 60fps

---

## Technical Notes

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/CollapsibleCategorySection.tsx` | Add scroll props, consider FlatList |
| `src/screens/TemplatesScreen.tsx` | Add directionalLockEnabled to parent |
| `src/components/MiniTemplateCard.tsx` | Add delayPressIn to Pressable |

### Testing Approach

1. **Manual Testing**
   - Expand category section
   - Immediately try horizontal scroll
   - Test diagonal gestures
   - Test during template loading

2. **Device Matrix**
   - iOS Simulator (latest)
   - iOS Physical Device
   - Android Emulator (API 31+)
   - Low-end Android device

### Dependencies

- No new dependencies required
- Uses existing React Native ScrollView/FlatList APIs
- react-native-reanimated already installed

---

## Related Issues

- Similar pattern exists in CategoryFilters.tsx (horizontal category pills)
- Similar pattern exists in EmojiPickerV2/CategoryPills.tsx
- CreateHabitModal template browser may have same issue

---

## Open Questions

1. Should we add visual scroll indicators (dots, arrows) to hint that content is scrollable?
2. Should we implement snap-to-card behavior for cleaner scroll experience?
3. Is there a threshold number of templates where we should use pagination instead?

---

## References

- [React Native ScrollView docs](https://reactnative.dev/docs/scrollview)
- [React Native Gesture Handler - nested scrolling](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [VirtualizedList nesting warning](https://reactnative.dev/docs/flatlist#nested-virtualized-lists)
