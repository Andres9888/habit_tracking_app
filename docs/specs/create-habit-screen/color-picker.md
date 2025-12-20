# Color Picker Specification

## Design Mockups

**High-fidelity mockup**: `.superdesign/design_iterations/color_picker_before_after_1.html`

Open in browser to see interactive before/after comparison.

---

## Status: REVISION NEEDED

**Previous attempts (throttle, HSB sliders) did NOT fix the freezing issue.**

The `reanimated-color-picker` library continues to freeze the app even with:
- 100ms throttle on onChange
- onComplete callback for final value
- InteractionManager lazy mounting
- Replacing Panel1 with HueSlider/SaturationSlider/BrightnessSlider

**New approach**:
1. Remove custom color picker entirely for now (preset colors only)
2. Research alternative solutions in parallel
3. Re-add custom color feature once a working solution is found

---

## Problem Statement

The current color picker implementation has two issues:

1. **Performance/Freezing** - The `reanimated-color-picker` library causes the app to freeze, even with throttling and simplified sliders
2. **UX Complexity** - Users just want to quickly pick a color; the full gradient picker is overkill for most use cases

---

## Before & After Wireframes

### BEFORE (Current - Causes Freezing)

```
┌─────────────────────────────────────┐
│  🎨 Style it                        │
├─────────────────────────────────────┤
│                                     │
│  Color                              │
│  🔴 🟠 🟡 🟢 🔵 🟣 💗 ⚫            │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 🎨  Custom color          [●]│  │  ← Opens freezing modal
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘

When "Custom color" is tapped:

┌─────────────────────────────────────┐
│         Pick a color          [Done]│
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │         PREVIEW               │  │
│  └───────────────────────────────┘  │
│                                     │
│  HUE SLIDER                         │
│  ├─🔴─🟠─🟡─🟢─🔵─🟣─────────────┤  │  ← STILL FREEZES!
│                                     │
│  SATURATION SLIDER                  │
│  ├──────────────────────────────┤   │  ← STILL FREEZES!
│                                     │
│  BRIGHTNESS SLIDER                  │
│  ├──────────────────────────────┤   │  ← STILL FREEZES!
│                                     │
└─────────────────────────────────────┘
```

**Problems:**
- `reanimated-color-picker` sliders still freeze the app
- Throttling and lazy loading did not fix the issue
- Library appears fundamentally incompatible with our setup

---

### AFTER (Phase 1 - Preset Colors Only)

```
┌─────────────────────────────────────┐
│  🎨 Style it                        │
├─────────────────────────────────────┤
│                                     │
│  Color                              │
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  🔴 🟠 🟡 🟢 🔵✓ 🟣 💗 ⚫   │  │  ← Expanded preset palette
│  │                               │  │     (16-20 curated colors)
│  │  🩵 🩷 🧡 💚 💜 🤎 🖤 🤍   │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│     ✅ No modal, no freezing!       │
│                                     │
└─────────────────────────────────────┘
```

**Benefits:**
- Zero freezing - no external color picker library
- Instant selection with haptic feedback
- Curated colors that look good for habits
- No modal needed at all

---

### AFTER (Phase 2 - Custom Color Returns)

Once we find a working custom picker solution:

```
┌─────────────────────────────────────┐
│  🎨 Style it                        │
├─────────────────────────────────────┤
│                                     │
│  Color                              │
│                                     │
│  🔴 🟠 🟡 🟢 🔵✓ 🟣 💗 ⚫          │
│  🩵 🩷 🧡 💚 💜 🤎 🖤 🤍          │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  +  More colors...            │  │  ← Opens NEW picker
│  └───────────────────────────────┘  │     (different library)
│                                     │
└─────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Preset Colors Only (Immediate)

**Goal**: Remove freezing by removing the custom color picker entirely

#### Tasks

- [ ] **P1.1**: Expand preset color palette to 16-20 colors
  - Add more variety: pastels, earth tones, vibrant colors
  - Curate colors that work well for habit cards
  - Update `src/components/CreateHabitModal/constants.ts`

- [ ] **P1.2**: Update StyleSection UI
  - Remove "Custom color" button
  - Display colors in 2 rows (8-10 per row)
  - Keep selection animation and haptic feedback
  - File: `src/components/CreateHabitModal/components/StyleSection.tsx`

- [ ] **P1.3**: Remove ColorPickerSheet dependency
  - Remove import and usage from CreateHabitModal
  - Keep the file for future reference but don't render it
  - File: `src/components/CreateHabitModal/CreateHabitModalV2.tsx`

- [ ] **P1.4**: Test thoroughly
  - Verify no freezing
  - Confirm all preset colors work
  - Check haptic feedback

---

### Phase 2: Research Alternative Pickers (Parallel)

**Goal**: Find a color picker solution that doesn't freeze

#### Alternative Libraries to Evaluate

| Library | Approach | Pros | Cons |
|---------|----------|------|------|
| `react-native-wheel-color-picker` | Color wheel | Simple, different approach | May have same issues |
| `@miblanchard/react-native-slider` + gradients | Custom build | Full control | More work |
| Native iOS/Android pickers | Platform native | No JS overhead | Platform-specific code |
| Web-based picker in WebView | Isolated context | Completely isolated | WebView overhead |

#### Tasks

- [ ] **P2.1**: Test `react-native-wheel-color-picker`
  - Install and create isolated test screen
  - Check for freezing during interaction
  - Evaluate UX quality

- [ ] **P2.2**: Prototype custom slider-based picker
  - Use `@miblanchard/react-native-slider` or Gesture Handler
  - Build simple Hue slider with `expo-linear-gradient`
  - Only update state on gesture end

- [ ] **P2.3**: Evaluate native picker options
  - Research iOS `UIColorPickerViewController`
  - Research Android color picker intents
  - Assess Expo compatibility

- [ ] **P2.4**: Document findings
  - Create comparison table
  - Recommend best approach
  - Update this spec

---

### Phase 3: Re-implement Custom Color (Future)

Once a working solution is found:

- [ ] **P3.1**: Implement chosen picker solution
- [ ] **P3.2**: Add "More colors" button to StyleSection
- [ ] **P3.3**: Test on low-end devices
- [ ] **P3.4**: Add back accessibility features

---

## Expanded Color Palette (Phase 1)

### Proposed 16-Color Palette

```typescript
export const COLORS = [
  // Row 1: Core vibrant colors
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#1E293B', // Slate (dark)

  // Row 2: Softer/alternative tones
  '#06B6D4', // Cyan
  '#F472B6', // Light Pink
  '#FB923C', // Light Orange
  '#4ADE80', // Light Green
  '#A78BFA', // Light Purple
  '#78716C', // Stone (neutral)
  '#0EA5E9', // Sky Blue
  '#FBBF24', // Amber
];
```

### Color Selection Criteria

1. **Contrast**: All colors should be readable on white card backgrounds
2. **Variety**: Cover the full spectrum (warm, cool, neutral)
3. **Harmony**: Colors should look good together in the habit list
4. **Accessibility**: Meet WCAG contrast guidelines for text overlay

---

## Files to Modify

### Phase 1
- `src/components/CreateHabitModal/constants.ts` - Expand COLORS array
- `src/components/CreateHabitModal/components/StyleSection.tsx` - Remove custom color button, update grid layout
- `src/components/CreateHabitModal/CreateHabitModalV2.tsx` - Remove ColorPickerSheet import/usage

### Phase 2
- New test file for evaluating alternative pickers
- This spec (update with findings)

---

## Success Metrics

### Phase 1
- [ ] Zero freezing when selecting colors
- [ ] All 16 preset colors display correctly
- [ ] Haptic feedback works on selection
- [ ] Selection animation works smoothly

### Phase 2
- [ ] Identify at least one picker that doesn't freeze
- [ ] Document performance characteristics
- [ ] Create working prototype

---

## Rollback Plan

If Phase 1 causes issues:
- Keep current implementation but hide "Custom color" button
- Preset colors already work without freezing

---

## Historical Notes

### Previous Attempts (Did Not Fix Freezing)

1. **Throttle onChange (100ms)** - Still freezes
2. **onComplete callback** - Still freezes
3. **InteractionManager lazy mount** - Still freezes
4. **Replace Panel1 with HueSlider** - Still freezes
5. **Replace with 3 separate sliders (H/S/B)** - Still freezes

**Conclusion**: The `reanimated-color-picker` library has fundamental compatibility issues with our app's Reanimated/Gesture Handler setup. A different approach is needed.
