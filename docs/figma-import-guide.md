# Figma Import Guide

**Generated:** 2025-10-30
**Purpose:** Step-by-step guide to import design tokens and components into Figma

---

## 📦 Files Generated

1. **`figma-design-tokens.json`** - Color, typography, spacing, shadow, and animation tokens
2. **`figma-components-spec.json`** - Detailed component specifications with variants
3. **`figma-design-spec.md`** - Human-readable design documentation
4. **`figma-import-guide.md`** - This file

---

## 🚀 Quick Start: Import into Figma

### Method 1: Manual Import (Recommended for Learning)

#### Step 1: Set Up Design Tokens (30 minutes)

**1.1 Create Color Variables**

1. Open Figma
2. Click on your profile → **Local variables**
3. Create a new collection: **"Habit Tracker Colors"**
4. Add color variables from `figma-design-tokens.json`:

```
Brand Colors:
├── brand/primary/400 → #34D399
├── brand/primary/500 → #10B981
├── brand/primary/600 → #059669
└── brand/primary/700 → #047857

Semantic Colors:
├── semantic/success → #10B981
├── semantic/warning → #F59E0B
├── semantic/error → #EF4444
└── semantic/info → #3B82F6

Gray Scale:
├── gray/50 → #F9FAFB
├── gray/100 → #F3F4F6
├── ... (add all 10 shades)
└── gray/900 → #111827

Strength Levels:
├── strength/starting → #86EFAC
├── strength/building → #10B981
├── strength/developing → #059669
├── strength/strong → #047857
└── strength/automatic → #065F46
```

**1.2 Create Text Styles**

1. Go to **Assets** panel → **Local styles** → **Text styles**
2. Create these text styles from the tokens file:

```
Display/Large
├── Font: SF Pro Display
├── Weight: Bold (700)
├── Size: 34pt
├── Line Height: 41pt
└── Letter Spacing: 0.37pt

Heading/H1
├── Font: SF Pro Display
├── Weight: Bold (700)
├── Size: 28pt
├── Line Height: 34pt
└── Letter Spacing: 0.36pt

Heading/H2
├── Font: SF Pro Display
├── Weight: Semibold (600)
├── Size: 22pt
├── Line Height: 28pt
└── Letter Spacing: 0.35pt

Heading/H3
├── Font: SF Pro Text
├── Weight: Semibold (600)
├── Size: 17pt
├── Line Height: 22pt
└── Letter Spacing: -0.41pt

Body/Regular
├── Font: SF Pro Text
├── Weight: Regular (400)
├── Size: 17pt
├── Line Height: 22pt
└── Letter Spacing: -0.41pt

Body/Small
├── Font: SF Pro Text
├── Weight: Regular (400)
├── Size: 15pt
├── Line Height: 20pt
└── Letter Spacing: -0.24pt

Caption
├── Font: SF Pro Text
├── Weight: Regular (400)
├── Size: 13pt
├── Line Height: 18pt
└── Letter Spacing: -0.08pt

Button/Label
├── Font: SF Pro Text
├── Weight: Semibold (600)
├── Size: 17pt
├── Line Height: 22pt
└── Letter Spacing: -0.41pt
```

**1.3 Create Effect Styles (Shadows)**

1. Go to **Assets** → **Local styles** → **Effect styles**
2. Create these shadow effects:

```
shadow/card
├── Type: Drop Shadow
├── X: 0, Y: 2
├── Blur: 8
└── Color: rgba(0, 0, 0, 0.1)

shadow/modal
├── Type: Drop Shadow
├── X: 0, Y: 4
├── Blur: 16
└── Color: rgba(0, 0, 0, 0.12)

shadow/fab
├── Type: Drop Shadow
├── X: 0, Y: 6
├── Blur: 12
└── Color: rgba(0, 0, 0, 0.15)
```

---

#### Step 2: Build Core Components (2-4 hours)

Follow the specifications in `figma-components-spec.json`. Start with these components in order:

**2.1 Button Component** (Start here - most reused)

1. Create a new component: **Button**
2. Add component properties:
   - `type` (variant): primary, secondary, ghost, icon
   - `state` (variant): default, pressed, disabled, loading
   - `size` (variant): small, medium, large
3. Use Auto Layout:
   - Direction: Horizontal
   - Padding: 16pt (horizontal), 12pt (vertical)
   - Spacing: 8pt
   - Corner radius: 12pt
4. Apply color variables and text styles
5. Create all variant combinations

**2.2 HabitStrengthIndicator Component**

1. Create component: **HabitStrengthIndicator**
2. Add properties:
   - `type` (variant): compact, full, graph
   - `level` (variant): starting, building, developing, strong, automatic
3. Build "compact" variant:
   - Auto Layout horizontal
   - Emoji (24pt) + Progress Bar + Percentage text
   - Use color variables for strength levels
4. Build "full" variant:
   - Auto Layout vertical
   - Large emoji (64pt) + Level label + Progress bar + Percentage

**2.3 HabitCard Component**

1. Create component: **HabitCard**
2. Add properties:
   - `state` (variant): default, completed, atRisk, pressed, disabled
   - `size` (variant): small, standard, large
3. Layout structure:
   - Auto Layout horizontal
   - Accent bar (4pt wide) + Icon + Content + Status icon
   - Height: 72pt (standard)
4. Nest HabitStrengthIndicator (compact) inside
5. Apply shadow effect

**2.4 Modal Component**

1. Create component: **Modal**
2. Add properties:
   - `type` (variant): bottomSheet, fullScreen, centerAlert
   - `state` (variant): entering, open, exiting
3. Bottom Sheet variant:
   - Corner radius: 20pt (top corners only)
   - Handle: 40pt wide, 4pt tall, gray/300
   - Padding: 24pt
   - Shadow: modal shadow
4. Add backdrop frame (60% black overlay)

**2.5 Card Component**

1. Create component: **Card**
2. Add properties:
   - `type` (variant): default, highlighted, stat
   - `state` (variant): default, pressed, disabled
3. Stat card variant:
   - Icon + Large text + Small label
   - Vertical Auto Layout
   - Apply shadow

**2.6 Toast Component**

1. Create component: **Toast**
2. Add properties:
   - `type` (variant): success, error, info, warning, undo
   - `state` (variant): entering, visible, exiting
3. Layout:
   - Icon + Message + Optional action button
   - Horizontal Auto Layout
   - Background: rgba(31, 41, 55, 0.9)

---

#### Step 3: Build Screen Templates (2-3 hours)

Use the component library to assemble screens:

**3.1 Home Screen (Habit List)**

1. Create iPhone 13 frame (390 x 844 pt)
2. Structure:
   - Status bar (system)
   - Header (64pt): Settings icon + "Today" + Add button
   - Date header (44pt): "Monday, Oct 30, 2025"
   - Scrollable content: Stack HabitCard instances
   - Tab bar (49pt + safe area)
3. Apply safe area constraints

**3.2 Create Habit Modal**

1. Create backdrop (60% black overlay)
2. Add Modal component (bottomSheet variant)
3. Fill modal content:
   - Title: "Create Habit"
   - Input field: Habit Name
   - Icon picker (horizontal scroll)
   - Color picker
   - Reminder time picker
   - Primary button: "Create Habit"
   - Ghost button: "Cancel"

**3.3 Analytics Dashboard**

1. Create iPhone 13 frame
2. Structure:
   - Header with lock badge (for free users)
   - Stat cards (2-column grid)
   - Donut chart (strength distribution)
   - Line chart (30-day trend)
   - Heatmap (compliance calendar)
3. Add scrollable container

**3.4 Paywall Modal**

1. Create full-screen modal
2. Structure:
   - Close button (top-right)
   - Headline: "✨ Premium ✨"
   - Feature list (5-6 items with icons)
   - Highlighted pricing card (7-day trial)
   - Alternative pricing option
   - Fine print + Restore purchases button

**3.5 Milestone Celebration**

1. Create center modal (320pt wide)
2. Structure:
   - Large emoji (80pt) with glow effect
   - Level name (28pt bold)
   - Habit name + description
   - Animated progress bar
   - "Share Achievement" button (48pt)
   - "Continue" ghost button
3. Add confetti overlay (optional animation)

---

### Method 2: Use Figma Plugins (Faster, Less Control)

#### Plugin Option 1: Design Tokens Plugin

1. Install: **Design Tokens** by Jan Six
2. Import `figma-design-tokens.json`
3. Plugin will auto-create:
   - Color variables
   - Text styles
   - Spacing variables
4. Manually create components afterward

#### Plugin Option 2: Tokens Studio

1. Install: **Tokens Studio for Figma**
2. Import JSON tokens
3. Sync with Figma variables
4. Apply tokens to components

#### Plugin Option 3: Relay (Figma to Code)

1. Install: **Relay for Figma**
2. Import component specs
3. Generate React Native code directly
4. Requires setup with your codebase

---

## 🎨 Setting Up Prototypes

### Interaction 1: Habit Completion Animation

1. Create HabitCard with "default" and "completed" variants
2. Add interaction:
   - **Trigger:** On Tap
   - **Action:** Change to "Completed"
   - **Animation:** Smart Animate, 600ms, Spring easing
3. Animate these properties:
   - Checkmark: scale 0 → 1.2 → 1.0
   - Background color: white → muted green
   - Strength bar: old width → new width

### Interaction 2: Modal Slide-Up

1. Create two frames:
   - Frame 1: Modal off-screen (Y: +844pt)
   - Frame 2: Modal on-screen (Y: 0)
2. Add interaction:
   - **Trigger:** On Tap (button)
   - **Action:** Navigate to Frame 2
   - **Animation:** Smart Animate, 300ms, Spring
3. Backdrop fades in (opacity 0 → 0.6) simultaneously

### Interaction 3: Button Press State

1. Create Button with "default" and "pressed" variants
2. Add interaction:
   - **Trigger:** While Pressing
   - **Action:** Change to "Pressed"
   - **Animation:** 100ms, Ease Out
3. Pressed state: scale 0.95, darker color

---

## 📱 iPhone Frame Setup

### Create Reusable iPhone Frame

1. Create frame: **iPhone 13**
   - Width: 390pt
   - Height: 844pt
2. Add safe area guides:
   - Top safe area: 47pt (for notch)
   - Bottom safe area: 34pt (for home indicator)
3. Lock safe area guides to prevent accidental movement
4. Save as component for reuse

### Safe Area Constraints

When placing content:
- **Header:** Start below top safe area (Y: 47pt)
- **Tab Bar:** End above bottom safe area (bottom margin: 34pt)
- **Modals:** Respect safe areas for interactivity

---

## ✅ Validation Checklist

Before finalizing your Figma file:

### Design Tokens
- [ ] All color variables created and organized
- [ ] Text styles for all 8 typography variants
- [ ] Shadow effects for card, modal, FAB
- [ ] Spacing documented (8pt grid)

### Components
- [ ] Button (all variants: primary, secondary, ghost)
- [ ] HabitCard (states: default, completed, at risk)
- [ ] HabitStrengthIndicator (compact and full)
- [ ] Modal (bottomSheet, fullScreen)
- [ ] Card (stat variant)
- [ ] Toast (success, error, info, warning)

### Screens
- [ ] Home Screen (Habit List)
- [ ] Create Habit Modal
- [ ] Analytics Dashboard
- [ ] Paywall Modal
- [ ] Milestone Celebration

### Accessibility
- [ ] Color contrast checked (WCAG AA)
- [ ] Touch targets ≥ 44x44pt
- [ ] Text styles support Dynamic Type
- [ ] Focus order verified with plugin

### Prototypes
- [ ] Habit completion animation
- [ ] Modal transitions (slide-up, slide-from-right)
- [ ] Button press states

---

## 🔗 Exporting for Development

### Export Design Tokens

1. Install **Design Tokens** plugin
2. Select all variables/styles
3. Export as JSON
4. Share with developer (already provided in repo)

### Export Components for Code

**Option 1: Manual Handoff**
1. Use Figma Dev Mode
2. Share link with developers
3. Developers inspect CSS properties

**Option 2: Figma API Export**
1. Use Figma REST API
2. Export component specs programmatically
3. Generate React Native components

**Option 3: Code Generation Plugin**
1. Install **Anima** or **Locofy** plugin
2. Convert designs to React Native code
3. Review and refine generated code

---

## 📚 Additional Resources

### Figma Documentation
- [Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373)
- [Variables](https://help.figma.com/hc/en-us/articles/15339657135383)
- [Component Properties](https://help.figma.com/hc/en-us/articles/5579474826519)
- [Prototyping](https://help.figma.com/hc/en-us/articles/360040314193)

### Design System Examples
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://m3.material.io/)
- [iOS Design Kit](https://www.figma.com/community/file/768365747273056340)

### Plugins to Install
1. **Design Tokens** - Import/export design tokens
2. **A11y - Focus Order** - Check accessibility
3. **Color Contrast Checker** - Verify WCAG compliance
4. **Autoflow** - Create user flow diagrams
5. **Stark** - Comprehensive accessibility toolkit

---

## 🎯 Next Steps

1. **Start with Method 1** (Manual Import) to learn the design system
2. **Build Button component first** - most reused, good practice
3. **Create one screen end-to-end** (Home Screen recommended)
4. **Add prototypes and test interactions**
5. **Share with team for feedback**
6. **Export for development** when ready

---

## 💡 Pro Tips

### Efficiency Tips
- Use **Shift + A** to create Auto Layout quickly
- Duplicate components with **Cmd/Ctrl + D**
- Use **Cmd/Ctrl + /** to search for anything
- Enable **Snap to pixel grid** for precision

### Organization Tips
- Name layers descriptively: `habit-card/icon` not `Rectangle 7`
- Use folders/pages to organize: Design System → Components → Screens
- Lock layers you don't want to move accidentally
- Use frames for grouping, not groups (better for Auto Layout)

### Collaboration Tips
- Use **Figma Comments** for feedback
- Create a **Cover Page** explaining the design system
- Document design decisions in descriptions
- Share read-only link with stakeholders

---

**Ready to build!** 🎨

Follow this guide step-by-step, and you'll have a production-ready Figma design system in 4-6 hours.

Questions? Reference the detailed specs in:
- `figma-design-spec.md` (visual design details)
- `figma-design-tokens.json` (token values)
- `figma-components-spec.json` (component structure)
