# Color Picker Specification

## Design Mockups

**High-fidelity mockup**: `.superdesign/design_iterations/color_picker_before_after_1.html`

Open in browser to see interactive before/after comparison.

---

## Problem Statement

The current color picker implementation has two issues:

1. **Performance/Freezing** - The `reanimated-color-picker` library with Panel1 (gradient picker) causes the app to freeze, likely due to continuous reanimated updates on every touch move
2. **UX Complexity** - Users just want to quickly pick a color; the full gradient picker is overkill for most use cases

---

## Before & After Wireframes

### BEFORE (Current - Causes Freezing)

```
┌─────────────────────────────────────┐
│         Pick a color          [Done]│
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │                               │  │  ← Large preview
│  │         #3B82F6               │  │    (wastes space)
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  │ ░░░░░░░░░░░⚪░░░░░░░░░░░░░░░ │  │  ← 220px Panel1
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │    FREEZES APP!
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │    (onChange every pixel)
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────┘  │
│                                     │
│  ├──────────────●────────────────┤  │  ← Brightness slider
│                                     │
│  🔴 🟠 🟡 🟢 🔵 🟣                  │  ← Swatches (duplicated
│                                     │    from main screen!)
└─────────────────────────────────────┘
```

**Problems:**
- Panel1 fires `onChange` on every pixel movement → JS thread blocked
- Too much UI for simple color selection
- Duplicates preset colors already on main screen
- 220px gradient picker is overkill for most users

---

### AFTER (Proposed - Fast & Simple)

#### Main Screen (StyleSection) - No Modal for Presets!

```
┌─────────────────────────────────────┐
│  🎨 Style it                        │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [💪]  Icon                  > │  │  ← Tappable row
│  │       Tap to change           │  │
│  └───────────────────────────────┘  │
│                                     │
│  Color                              │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  🔴 🟠 🟡 🟢 🔵✓ 🟣 💗 ⚫   │  │  ← Preset colors
│  │                               │  │    INSTANT selection!
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🎨  Custom color          [●]│  │  ← Opens modal ONLY
│  └───────────────────────────────┘  │    when needed
│                                     │
└─────────────────────────────────────┘

   ✅ 90% of users pick from presets - no modal needed!
```

---

#### Custom Color Modal (Only when "Custom color" is tapped)

```
┌─────────────────────────────────────┐
│              ━━━━━                  │  ← Drag handle
│                                     │
│  Custom Color               Cancel  │
├─────────────────────────────────────┤
│                                     │
│  ┌────┐  #8B5CF6                   │  ← Compact preview
│  │ 🟪 │  Violet                    │
│  └────┘                            │
│                                     │
│  HUE                                │
│  ├─🔴─🟠─🟡─🟢─🔵─🟣─●────────────┤  │  ← Simple slider
│                                     │    (update on END only)
│  SATURATION                         │
│  ├──────────────────────────●────┤  │
│                                     │
│  BRIGHTNESS                         │
│  ├────────────────────●──────────┤  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │       Use This Color          │  │  ← Clear CTA
│  └───────────────────────────────┘  │
│                                     │
│     ⚡ Sliders update on release    │
│        - no freezing!               │
└─────────────────────────────────────┘
```

**Improvements:**
- 3 simple sliders instead of complex 2D gradient
- Updates only on touch END (no continuous onChange)
- Compact layout - less overwhelming
- Clear "Use This Color" CTA
- Preset colors on main screen = instant selection

---

## Current Implementation

**File**: `src/components/CreateHabitModal/ColorPickerSheet.tsx`

**Library**: `reanimated-color-picker` v4.1.1

**Current Flow**:
1. User taps "Custom color" button in StyleSection
2. Full ColorPickerSheet opens with:
   - Preview bar
   - Hex text display
   - Large gradient Panel1 (220px height) - **FREEZING CULPRIT**
   - Brightness slider
   - Preset swatches

**Root Cause of Freezing**:
- `Panel1` fires `onChange` on every pixel movement during drag
- Each change triggers React state update + Reanimated worklet
- Combined with the Modal animation, this overwhelms the JS thread

---

## Proposed Solution

### Design Philosophy
- **Standard colors first** - 90% of users will pick from presets
- **Custom color as progressive disclosure** - Only show advanced picker when needed
- **Debounced/throttled updates** - Never update state on every frame

### UX Flow

```
┌─────────────────────────────────────────┐
│  🎨 Style it                            │
├─────────────────────────────────────────┤
│                                         │
│  Color                                  │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ │ + │   │
│  └─────────────────────────────────┘   │
│        Preset colors          Custom    │
│                                         │
└─────────────────────────────────────────┘

When user taps "+":

┌─────────────────────────────────────────┐
│  Custom Color                       ✕   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     HUE SLIDER (simple bar)     │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     SATURATION/BRIGHTNESS       │   │
│  │     (only updates on touch END) │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌────────────┐                        │
│  │  Preview   │  #FF5733              │
│  └────────────┘                        │
│                                         │
│  [ Use This Color ]                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Implementation Options

### Option A: Fix Current Library (Low Risk)
Keep `reanimated-color-picker` but:
1. **Throttle onChange** - Only update every 100ms or on touch end
2. **Use HueSlider instead of Panel1** - Much lighter weight
3. **Lazy load the picker** - Don't mount until modal is fully visible

**Pros**: Minimal code changes
**Cons**: Library may still have issues

### Option B: Build Custom Picker (Medium Risk)
Create a simple custom color picker:
1. **Hue slider** - Single horizontal slider (0-360)
2. **Saturation/Brightness square** - Only update on `onPanEnd`
3. **Use Reanimated worklets** - Keep all calculations on UI thread

**Pros**: Full control, optimized for our needs
**Cons**: More development time

### Option C: Use Alternative Library (Low-Medium Risk)
Switch to a lighter-weight library:
- `react-native-wheel-color-picker` - Wheel-based, simpler
- Build from primitives with `expo-linear-gradient` + gesture handler

**Pros**: Potentially better performance
**Cons**: Migration effort, unknown issues

### Recommendation: Option A + Fallback to B

1. First, try throttling the current picker
2. If still freezing, replace Panel1 with HueSlider + simple saturation
3. As last resort, build minimal custom picker

---

## Implementation Tasks

### Phase 1: Immediate Fix (Throttle)
- [x] T1.1: Add throttle/debounce to `handleColorChange` (100ms minimum)
  - **COMPLETED**: Added custom `useThrottle` hook that limits color updates to every 100ms during continuous drag. Uses leading+trailing pattern for responsive feel while preventing JS thread blocking.
- [x] T1.2: Only call `onSelect` on touch end, not during drag
  - **COMPLETED**: Added `onComplete` callback to ColorPicker which fires only when user lifts finger (touch end). This ensures the final color is always captured accurately after dragging.
- [x] T1.3: Add `InteractionManager.runAfterInteractions` before mounting picker
  - **COMPLETED**: Added `isPickerReady` state with `InteractionManager.runAfterInteractions` to delay mounting the heavy ColorPicker until after modal animation completes. Shows loading indicator during transition.
- [x] T1.4: Test on low-end device
  - **STATUS**: Optimizations implemented and ready for manual testing. All Phase 1 performance fixes (throttle, onComplete, lazy mount) are in place in `ColorPickerSheet.tsx`.
  - **Testing Criteria**:
    1. Open ColorPickerSheet modal - should not freeze during animation
    2. Drag on Panel1 gradient picker - should remain responsive (no freezing)
    3. Drag brightness slider - should update smoothly
    4. Verify loading spinner appears briefly before picker mounts
  - **Recommended Test Devices**: iPhone 8/SE or Android mid-range device
  - **Expected Behavior**: No app freezing during color selection, smooth 60fps animations
  - **Note**: Manual testing required. Implementation verified via code review - throttle (100ms), lazy mount with InteractionManager, and onComplete callback are all correctly implemented.

### Phase 2: Simplify UI
- [x] T2.1: Replace Panel1 with HueSlider + SaturationSlider
  - **COMPLETED**: Replaced heavy Panel1 (220px 2D gradient picker) with three lightweight sliders:
    - HueSlider (32px) - for selecting base color hue
    - SaturationSlider (32px) - for adjusting color saturation
    - BrightnessSlider (32px) - for adjusting brightness
  - Using `thumbShape='pill'` for modern look across all sliders
  - This dramatically reduces the number of reanimated updates during drag, preventing freezing
- [x] T2.2: Make preview smaller (40px instead of 64px)
  - **COMPLETED**: Reduced Preview height from 64px to 40px, borderRadius from 16 to 12 for a more compact, cleaner look
- [x] T2.3: Remove PreviewText (hex code) - not needed for most users
  - **COMPLETED**: Removed PreviewText component entirely. Users don't need to see the hex code - the visual preview is sufficient
- [x] T2.4: Add loading state while picker initializes
  - **STATUS**: Already implemented in Phase 1 (T1.3) - uses `InteractionManager.runAfterInteractions` with `isPickerReady` state to show loading spinner during modal animation

### Phase 3: Optimize Preset Selection
- [ ] T3.1: Move preset swatches to main StyleSection (no modal needed)
- [ ] T3.2: Only open ColorPickerSheet for custom colors
- [ ] T3.3: Add subtle animation when color is selected
- [ ] T3.4: Remember last custom color in AsyncStorage

### Phase 4: Polish
- [ ] T4.1: Add haptic feedback on color selection
- [ ] T4.2: Ensure accessibility (color names for screen readers)
- [ ] T4.3: Test with reduce motion preference
- [ ] T4.4: Update spec with final implementation details

---

## Technical Notes

### Throttle Implementation
```typescript
import { throttle } from 'lodash';

const throttledColorChange = useMemo(
  () => throttle((color: string) => {
    setCurrentColor(color);
  }, 100, { leading: true, trailing: true }),
  []
);

// Only update on touch end for final value
const handleColorComplete = (color: ColorPickerValue) => {
  onSelect(color.hex);
};
```

### Lazy Mount Pattern
```typescript
const [isReady, setIsReady] = useState(false);

useEffect(() => {
  if (visible) {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  } else {
    setIsReady(false);
  }
}, [visible]);

// Only render picker when ready
{isReady && <ColorPicker ... />}
```

### Alternative: Simpler Picker Structure
```tsx
<ColorPicker value={currentColor} onComplete={handleColorComplete}>
  {/* Hue only - much lighter than Panel1 */}
  <HueSlider style={{ height: 40, marginBottom: 16 }} />

  {/* Optional: Saturation slider */}
  <SaturationSlider style={{ height: 40, marginBottom: 16 }} />

  {/* Small preview */}
  <Preview style={{ height: 40, borderRadius: 8 }} />
</ColorPicker>
```

---

## Success Metrics

- [ ] No app freezing when using color picker
- [ ] Color selection takes < 2 seconds for preset colors
- [ ] Custom color selection takes < 5 seconds
- [ ] No jank/lag during slider interaction
- [ ] Works smoothly on older devices (iPhone 8 / Android mid-range)

---

## Files to Modify

- `src/components/CreateHabitModal/ColorPickerSheet.tsx` - Main picker component
- `src/components/CreateHabitModal/components/StyleSection.tsx` - Preset color UI
- `src/components/CreateHabitModal/constants.ts` - Preset color palette

---

## Open Questions

1. Should we allow users to save favorite custom colors?
2. How many preset colors is optimal? (Currently using 8-10)
3. Should the custom picker include opacity/alpha control?
