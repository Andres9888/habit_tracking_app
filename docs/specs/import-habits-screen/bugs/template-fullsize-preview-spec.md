# Template Fullsize Preview - UX Spec & Tasks

## Problem Statement
Templates are not displaying prominently enough in the browse view. When users tap a template card, they should see a **fullsize preview** that showcases the template properly before deciding to import.

---

## Current State
- **MiniTemplateCard**: 220px wide compact cards in horizontal scroll
- **TemplateCard**: Full-width cards but still compact with limited visual impact
- **TemplatePreviewModal**: Customization-focused, not preview-focused

## Proposed Solution
Add a **fullsize template preview modal** that:
1. Shows the template at its most visually impactful
2. Provides rich context (science, description, frequency)
3. Allows quick import OR transition to customization

---

## Visual Mockup (ASCII)

### Template Card in Browse View (Current - Compact)
```
┌────────────────────────────────────────────────────┐
│ [🧘] ▸ Morning Routine        [Category Badge]     │
│ ─────────────────────────────────────────────────  │
│ Start your day with 5 minutes of mindful          │
│ breathing to reduce cortisol and improve focus... │
│ ┌────────────────────────────────┐                 │
│ │ 🔬 Journal of Health Psychology │                │
│ └────────────────────────────────┘                 │
│            [ Import Habit ]                        │
└────────────────────────────────────────────────────┘
```

### NEW: Fullsize Preview Modal (When Tapped)
```
┌─────────────────────────────────────────────────────┐
│                        [X]                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│                     ┌─────────┐                     │
│                     │         │                     │
│                     │   🧘    │  ← Large icon       │
│                     │         │    (96x96)          │
│                     └─────────┘                     │
│                                                     │
│             Morning Meditation                      │
│          ─────────────────────                      │
│                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │  Daily    │  │ Morning   │  │ 5 min     │       │
│  │ Frequency │  │ Routine   │  │ Duration  │       │
│  └───────────┘  └───────────┘  └───────────┘       │
│                                                     │
│  Start your day with 5 minutes of mindful          │
│  breathing. This practice activates your           │
│  parasympathetic nervous system, reducing          │
│  cortisol levels and setting a calm tone           │
│  for the entire day ahead.                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔬 SCIENCE BEHIND THIS HABIT                │   │
│  │────────────────────────────────────────────│   │
│  │ "Morning meditation reduces cortisol by    │   │
│  │ 23% and improves focus throughout the day" │   │
│  │                                             │   │
│  │ — Journal of Health Psychology, 2022       │   │
│  │                                             │   │
│  │ [📄 Read Research]  [▶️ Watch Video]        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          Import This Habit                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Customize First →]                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Design Tokens

### Icon Container (Hero)
- Size: 96x96 (vs current 56x56)
- Border radius: 24px
- Background: `${iconColor}20`
- Icon font size: 48px
- Glow shadow: blur 24px, opacity 0.3

### Title
- Font size: 28px
- Font weight: 800
- Letter spacing: -0.5
- Color: #101727

### Metadata Pills
- Background: `${iconColor}10`
- Border: 1px solid `${iconColor}20`
- Padding: 8px 14px
- Border radius: 12px
- Font: 13px, weight 600

### Science Box
- Background: #f0fdf4
- Border: 2px solid #bbf7d0
- Border radius: 16px
- Padding: 20px
- Icon size: 20px

### Import Button
- Height: 56px
- Border radius: 16px
- Font: 18px, weight 700
- Full width
- Background: iconColor

### Customize Link
- Font: 15px, weight 600
- Color: #6B7280
- Centered below button

---

## Animation Spec

### Modal Entrance
- Backdrop: fade in 200ms (0 → 0.5 opacity)
- Content: slide up from bottom + fade (300ms, spring damping 22)
- Icon: scale from 0.8 → 1.0 with bounce (delay 100ms)

### Import Button Press
- Scale: 1.0 → 0.96 → 1.0
- Background: brighten 10%
- Haptic: Medium impact

### Success State
- Icon container: pulse green glow
- Checkmark: scale from 0 with spring bounce
- Button text transitions to "Added!"

---

## Implementation Tasks

### Phase 1: Create FullsizeTemplatePreview Component
- [x] **Task 1.1**: Create new component `src/components/FullsizeTemplatePreview.tsx`
  - Props: template, visible, onClose, onImport, onCustomize
  - Uses existing Modal component with `variant='fullscreen'` or `variant='bottomSheet'`
  - **Completed**: Created with all specified props plus isImporting and isImported states

- [x] **Task 1.2**: Implement hero icon section
  - Large 96x96 icon container with glow
  - Centered layout with gradient background option
  - **Completed**: Hero section with animated glow effect and LinearGradient background

- [x] **Task 1.3**: Implement metadata pills row
  - Frequency, Category, Duration pills
  - Horizontal scroll if overflow
  - **Completed**: Horizontal ScrollView with Frequency, Category, and Duration pills

- [x] **Task 1.4**: Implement science box with research link
  - Expandable if reference text is long
  - Tap to open link in browser
  - **Completed**: Science box with research quote and "Read Research" link button that opens in browser

- [x] **Task 1.5**: Implement dual CTA footer
  - Primary: "Import This Habit" button
  - Secondary: "Customize First →" link
  - **Completed**: Full-width import button with success state animation, plus customize link below

### Phase 2: Wire Up to Templates Screen
- [x] **Task 2.1**: Update `handleTemplatePreview` in TemplatesScreen
  - Show FullsizeTemplatePreview instead of TemplatePreviewModal
  - **Completed**: handleTemplatePreview now opens FullsizeTemplatePreview first

- [x] **Task 2.2**: Add flow: Fullsize → Customize modal
  - "Customize First" opens existing TemplatePreviewModal
  - Direct import skips customization (uses defaults)
  - **Completed**: handleCustomizeFromPreview transitions to TemplatePreviewModal; handleDirectImport imports directly

- [x] **Task 2.3**: Update MiniTemplateCard onPress
  - Ensure it triggers fullsize preview
  - **Completed**: MiniTemplateCard already calls onPress which triggers handleTemplatePreview → FullsizeTemplatePreview

### Phase 3: Polish & Animation
- [ ] **Task 3.1**: Add entrance animations
  - Choreographed reveal (backdrop → content → icon)

- [ ] **Task 3.2**: Add success state animations
  - Green pulse, checkmark, confetti optional

- [ ] **Task 3.3**: Add reduced motion support
  - Instant transitions for accessibility

### Phase 4: Testing & QA
- [ ] **Task 4.1**: Manual testing on iOS/Android
- [ ] **Task 4.2**: Test with various template data (long names, missing research)
- [ ] **Task 4.3**: Verify haptic feedback works correctly

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/FullsizeTemplatePreview.tsx` | **NEW** - Main component |
| `src/screens/TemplatesScreen.tsx` | Wire up preview modal |
| `src/components/MiniTemplateCard.tsx` | Ensure onPress triggers preview |
| `src/components/TemplateCard.tsx` | Ensure onPreview triggers fullsize |

---

## Success Criteria
1. Tapping any template card opens fullsize preview
2. Preview clearly showcases the template's visual identity
3. Users can import directly OR customize first
4. Animations are smooth (60fps) and feel premium
5. Reduced motion users see instant transitions

---

## Open Questions
1. Should we add a "swipe to next template" gesture in fullsize view?
2. Should we show related templates at the bottom?
3. Do we want a "Share Template" option?

---

*Created: December 2024*
*Status: Ready for Implementation*
