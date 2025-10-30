# Figma Design System - Quick Start Guide

**Time Required:** 30 minutes setup + 4-6 hours build
**Goal:** Import design tokens into Figma and build component library

---

## 🚀 Phase 1: Import Design Tokens (30 Minutes)

### Step 1: Install Required Figma Plugins

Open Figma Desktop → **Plugins** → **Browse plugins in Community** → Search and install:

1. **Design Tokens** by Jan Six
2. **Stark** (for accessibility checking)
3. **Color Contrast Checker** (WCAG validation)

---

### Step 2: Create New Figma File

1. **Create file:** "Habit Tracker - Design System"
2. **Create pages:**
   - `🎨 Design Tokens` (we'll start here)
   - `🧩 Components`
   - `📱 Screens`
   - `🎬 Prototypes`

---

### Step 3: Import Design Tokens

#### A. Import with Design Tokens Plugin (Automatic)

1. Open the **Design Tokens** plugin (⌘ + / → "Design Tokens")
2. Click **"Import"** or **"Load from JSON"**
3. Select the file: `docs/figma-design-tokens.json`
4. Click **"Import All"**

**The plugin will auto-create:**
- ✅ 40+ color variables
- ✅ 9 text styles
- ✅ 3 shadow effects
- ✅ Spacing tokens as variables

#### B. Verify Import

Go to **Local variables** (click your profile → **Local variables**):

You should see:
```
📁 Habit Tracker Colors (40+ variables)
   ├── brand/primary/400
   ├── brand/primary/500
   ├── brand/primary/600
   ├── brand/primary/700
   ├── brand/secondary/...
   ├── semantic/...
   ├── gray/50-900 (10 shades)
   ├── strength/starting-automatic (5 levels)
   └── surface/...
```

**If import fails:** See Manual Import instructions below.

---

### Step 4: Create Text Styles

Go to **Assets** panel → **Local styles** → **+** → Create these text styles:

#### Quick Reference Table

| Style Name | Font | Weight | Size | Line Height | Letter Spacing |
|------------|------|--------|------|-------------|----------------|
| Display/Large | SF Pro Display | Bold (700) | 34pt | 41pt | 0.37pt |
| Heading/H1 | SF Pro Display | Bold (700) | 28pt | 34pt | 0.36pt |
| Heading/H2 | SF Pro Display | Semibold (600) | 22pt | 28pt | 0.35pt |
| Heading/H3 | SF Pro Text | Semibold (600) | 17pt | 22pt | -0.41pt |
| Body/Regular | SF Pro Text | Regular (400) | 17pt | 22pt | -0.41pt |
| Body/Small | SF Pro Text | Regular (400) | 15pt | 20pt | -0.24pt |
| Caption | SF Pro Text | Regular (400) | 13pt | 18pt | -0.08pt |
| Button/Label | SF Pro Text | Semibold (600) | 17pt | 22pt | -0.41pt |

**Tip:** Select text → Right sidebar → **Text** section → **Create style** → Name it as above

---

### Step 5: Create Effect Styles (Shadows)

Go to **Assets** → **Local styles** → **Effect styles** → **+** → Create:

#### Shadow: Card
- Type: Drop Shadow
- X: 0, Y: 2
- Blur: 8
- Color: `rgba(0, 0, 0, 0.1)` (10% black)

#### Shadow: Modal
- Type: Drop Shadow
- X: 0, Y: 4
- Blur: 16
- Color: `rgba(0, 0, 0, 0.12)` (12% black)

#### Shadow: FAB
- Type: Drop Shadow
- X: 0, Y: 6
- Blur: 12
- Color: `rgba(0, 0, 0, 0.15)` (15% black)

---

## ✅ Phase 1 Checkpoint

**You now have:**
- ✅ Color variables (40+)
- ✅ Text styles (8)
- ✅ Shadow effects (3)
- ✅ Spacing tokens as variables

**Test it:**
1. Create a rectangle
2. Fill → Switch to **Variables** → Select `brand/primary/500`
3. Should be emerald green (#10B981) ✓

---

## 🧩 Phase 2: Build Components (4-6 Hours)

### Component 1: Button (Start Here - 30 mins)

**Why first?** Most reused component, good practice for learning variants.

#### Step 1: Create Base Button

1. **Frame:** 44pt height × 120pt width minimum
2. **Auto Layout:**
   - Direction: Horizontal
   - Padding: 16pt horizontal, 12pt vertical
   - Spacing: 8pt
   - Alignment: Center/Center
3. **Fill:** Variable `brand/primary/500`
4. **Corner radius:** 12pt
5. **Shadow:** Apply "shadow/card" effect

#### Step 2: Add Text

1. Add text: "Button Text"
2. Apply text style: `Button/Label`
3. Color: White `#FFFFFF`

#### Step 3: Create Component

1. Select frame → Right-click → **Create component** (⌘ + Option + K)
2. Name: `Button`

#### Step 4: Add Component Properties

In right sidebar → **Component** section:

**Property 1: Type (Variant)**
- Values: `primary`, `secondary`, `ghost`

**Property 2: State (Variant)**
- Values: `default`, `pressed`, `disabled`

**Property 3: Size (Variant)**
- Values: `small`, `medium`, `large`

#### Step 5: Create Variants

1. Select component → Right sidebar → **Create variants**
2. Duplicate component (⌘ + D) to create all combinations
3. For each variant, adjust:

**Primary:**
- Fill: Variable `brand/primary/500`
- Text: White

**Secondary:**
- Fill: Transparent
- Stroke: 2pt, `brand/primary/500`
- Text: `brand/primary/500`

**Ghost:**
- Fill: Transparent
- Stroke: None
- Text: `brand/primary/500`

**Pressed state:**
- Scale: 0.95 (simulate press)
- Fill: `brand/primary/600` (darker)

**Disabled state:**
- Opacity: 50%

**Sizes:**
- Small: 32pt height
- Medium: 44pt height
- Large: 56pt height

#### Step 6: Test Component

1. Drag instance onto canvas
2. Right sidebar → Switch variants
3. Verify all combinations work

**✅ Button component complete!**

---

### Component 2: HabitStrengthIndicator (45 mins)

#### Variant: Compact (For Lists)

**Frame structure (Auto Layout Horizontal):**

```
[Emoji 24pt] — [Progress Bar flexible] — [Percentage 40pt]
     🌱              ▰▰▰▰▱▱▱▱▱▱              18%
```

**Build steps:**

1. **Frame:** Auto Layout horizontal, spacing 8pt
2. **Emoji text:** 24pt, content: "🌱"
3. **Progress bar frame:**
   - Width: Flexible (fills space)
   - Height: 8pt
   - Corner radius: 4pt (full pill)
   - Fill: Variable `gray/200`
4. **Progress fill (nested inside bar):**
   - Width: 18% (manual, or use variable)
   - Height: 8pt
   - Corner radius: 4pt
   - Fill: Variable `strength/starting`
5. **Percentage text:** "18%", SF Mono 15pt, color `gray/600`

**Create component:**
- Name: `HabitStrengthIndicator/Compact`
- Add variants for strength levels: `starting`, `building`, `developing`, `strong`, `automatic`

**For each variant, change:**
- Emoji: 🌱 → 🌿 → 🌳 → 💪 → ⚡
- Progress width: 10% → 30% → 50% → 70% → 90%
- Progress color: `strength/starting` → `strength/building` → etc.

**Pro tip:** Use Figma's **Component Properties** → **Instance swap** for emoji variants

---

#### Variant: Full (For Detail Screens)

**Frame structure (Auto Layout Vertical):**

```
        [Large Emoji 64pt]
              💪

        [Level Label 22pt]
            Strong

     [Progress Bar 280pt × 12pt]
     ▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱

          65% Strength
```

**Build steps:**

1. **Frame:** Auto Layout vertical, spacing 16pt, padding 24pt, center aligned
2. **Emoji:** 64pt, add shadow effect (glow)
3. **Label:** Text style `Heading/H2`, "Strong"
4. **Progress bar:** 280pt × 12pt, same structure as compact
5. **Percentage:** "65% Strength", SF Mono 17pt

**Create variants** for all 5 strength levels.

---

### Component 3: HabitCard (1 hour)

**Most complex component - follow `figma-components-spec.json` exactly**

**Frame structure (Auto Layout Horizontal):**

```
[Accent 4pt] [Icon 32pt] [Content flexible] [Status 24pt]
    |            🧘         Morning Meditation       ✓
    |                      ▰▰▰▰▰▰▱▱▱▱ 62% 💪
```

**Build steps:**

1. **Main frame:**
   - Auto Layout horizontal
   - Spacing: 8pt
   - Padding: 16pt (left: 20pt for accent bar)
   - Height: 72pt
   - Corner radius: 12pt
   - Fill: White variable `surface/card`
   - Shadow: Apply "shadow/card"

2. **Accent bar (position absolute):**
   - Width: 4pt
   - Height: 100% (stretch)
   - Corner radius: 4pt 0 0 4pt (left side only)
   - Fill: Variable `brand/primary/500`
   - Constraints: Left + Vertical stretch

3. **Icon container:**
   - Frame: 32pt × 32pt
   - Corner radius: 8pt
   - Fill: Variable `brand/primary/500`
   - Center emoji: "🧘" 18pt

4. **Content (nested Auto Layout Vertical):**
   - Layout grow: 1 (flexible)
   - Spacing: 4pt
   - **Habit name:** Text style `Heading/H3`, "Morning Meditation"
   - **Strength indicator:** Instance of `HabitStrengthIndicator/Compact`

5. **Status icon:**
   - Frame: 24pt × 24pt
   - Icon: "✓" or "○" 20pt

**Create component variants:**
- State: `default`, `completed`, `atRisk`
- Completed: Background → `rgba(16, 185, 129, 0.1)` (light green)

---

### Component 4: Modal (Bottom Sheet) (45 mins)

**Frame structure:**

```
┌────────────────────────────────────┐
│ ──────  Handle  ───────             │  4pt tall, 40pt wide
│                                     │
│  [Content Auto Layout Vertical]    │  Padding 24pt
│                                     │
└────────────────────────────────────┘
```

**Build steps:**

1. **Modal frame:**
   - Width: 390pt (iPhone 13)
   - Height: Auto (based on content)
   - Corner radius: 20pt 20pt 0 0 (top corners only)
   - Fill: Variable `surface/modal`
   - Shadow: Apply "shadow/modal"

2. **Handle:**
   - Rectangle: 40pt × 4pt
   - Corner radius: 2pt
   - Fill: Variable `gray/300`
   - Constraints: Horizontal center, Top 8pt

3. **Content area:**
   - Auto Layout vertical
   - Spacing: 24pt
   - Padding: 24pt (top: 32pt for handle)
   - Width: Fill container

**Create variants:**
- Size: `small`, `medium`, `large` (different heights)

---

### Component 5: Card (Stat Variant) (30 mins)

**For analytics dashboard stats**

**Frame structure:**

```
┌──────────────────┐
│  📊  Analytics   │  Icon + Label
│                  │
│      5 Habits    │  Large number
│       Active     │  Secondary label
└──────────────────┘
```

**Build steps:**

1. **Frame:**
   - Auto Layout vertical
   - Spacing: 8pt
   - Padding: 16pt
   - Corner radius: 12pt
   - Fill: Variable `surface/card`
   - Shadow: "shadow/card"

2. **Header (Auto Layout Horizontal):**
   - Icon: 24pt emoji or Lucide icon
   - Label: Text style `Body/Small`, color `gray/500`

3. **Value:**
   - Text: "5 Habits"
   - Style: `Heading/H2`
   - Color: `gray/700`

4. **Sub-label:**
   - Text: "Active"
   - Style: `Body/Small`
   - Color: `gray/500`

---

### Component 6: Toast (30 mins)

**Frame structure:**

```
[Icon 20pt] [Message flexible] [Action Button]
    ✓       Habit completed      [Undo]
```

**Build steps:**

1. **Frame:**
   - Auto Layout horizontal
   - Spacing: 12pt
   - Padding: 16pt horizontal, 12pt vertical
   - Corner radius: 12pt
   - Fill: `rgba(31, 41, 55, 0.9)` (dark with transparency)
   - Shadow: "shadow/card"

2. **Icon:** 20pt, color based on type
3. **Message:** Text style `Body/Small`, color white, flexible width
4. **Action button:** Text "Undo", color `brand/primary/400`

**Create variants:**
- Type: `success`, `error`, `info`, `warning`, `undo`
- Change icon and icon color per variant

---

## ✅ Phase 2 Checkpoint

**You now have 6 core components:**
1. ✅ Button (all variants)
2. ✅ HabitStrengthIndicator (compact + full)
3. ✅ HabitCard (most important!)
4. ✅ Modal (bottom sheet)
5. ✅ Card (stat variant)
6. ✅ Toast (all types)

---

## 📱 Phase 3: Build Screen Templates (2 Hours)

### Screen 1: Home Screen (Habit List)

**Frame:** iPhone 13 (390 × 844 pt)

**Structure:**

1. **Create iPhone frame:**
   - Frame tool (F) → 390 × 844pt
   - Name: "Home Screen"
   - Fill: Variable `surface/background`

2. **Add safe area guides:**
   - Rectangle: 390 × 47pt (top notch area) → Gray overlay 20%
   - Rectangle: 390 × 34pt (bottom home indicator) → Gray overlay 20%
   - Lock these layers (⌘ + Shift + L)

3. **Build header (64pt):**
   - Auto Layout horizontal
   - Padding: 16pt
   - Spacing: Auto (space between)
   - Settings icon (left) | "Today" text | Add button (right)

4. **Build habit list:**
   - Auto Layout vertical
   - Spacing: 8pt
   - Padding: 16pt horizontal
   - Stack HabitCard component instances (drag from Assets)
   - Make 4-5 cards with different states

5. **Add tab bar (49pt + safe area):**
   - Auto Layout horizontal
   - Distribute evenly
   - Icons: Home, Analytics, Templates, Settings
   - Active tab: Color `brand/primary/500`, others `gray/500`

**Tip:** Use constraints to make components stick to top/bottom/edges

---

### Screen 2: Analytics Dashboard (1 hour)

**Frame:** iPhone 13 (390 × 844 pt)

**Structure:**

1. **Header:** "Analytics" + Premium lock badge
2. **Scrollable content (Auto Layout Vertical):**
   - Stat cards (2-column grid using Auto Layout)
   - Donut chart placeholder (240pt height)
   - Line chart placeholder (240pt height)
   - Heatmap calendar placeholder

**Pro tip:** For charts, use placeholder rectangles with "📊 Chart" text. Real charts will be implemented in code.

---

### Screen 3: Create Habit Modal (30 mins)

1. **Backdrop:** Rectangle 390 × 844pt, fill black 60% opacity
2. **Modal:** Instance of Modal component
3. **Content:**
   - Title: "Create Habit"
   - Input field (rectangle with placeholder text)
   - Icon picker (horizontal Auto Layout with emoji)
   - Color swatches (use your color variables!)
   - Button instances

---

## 🎬 Phase 4: Add Prototypes (30 mins - Optional)

### Interaction 1: Button Press

1. Select Button component → **Prototype** tab
2. **Trigger:** While pressing
3. **Action:** Change to variant "pressed"
4. **Animation:** Instant (or 100ms ease-out)

### Interaction 2: Modal Open

1. Create 2 frames:
   - Frame 1: Home screen with button
   - Frame 2: Home screen + Modal visible
2. Connect button → Frame 2
3. **Animation:** Smart Animate, 300ms, Spring easing

### Interaction 3: Habit Completion

1. Create HabitCard "default" and "completed" variants
2. Tap interaction → Change to "completed"
3. **Animation:** Smart Animate, 600ms, Spring
4. Animate checkmark scale 0 → 1.2 → 1.0

---

## ✅ Final Checklist

**Design System:**
- [ ] 40+ color variables imported
- [ ] 8 text styles created
- [ ] 3 shadow effects created
- [ ] Spacing tokens as variables (if using plugin)

**Components:**
- [ ] Button (primary, secondary, ghost)
- [ ] HabitStrengthIndicator (compact, full)
- [ ] HabitCard (with states)
- [ ] Modal (bottom sheet)
- [ ] Card (stat variant)
- [ ] Toast (all types)

**Screens:**
- [ ] Home Screen (iPhone 13 frame)
- [ ] Analytics Dashboard
- [ ] Create Habit Modal
- [ ] Safe areas marked

**Prototypes:**
- [ ] Button press interaction
- [ ] Modal slide-up animation
- [ ] Habit completion animation

**Accessibility:**
- [ ] All colors checked with Stark plugin
- [ ] Touch targets ≥ 44 × 44pt
- [ ] Text styles support Dynamic Type

---

## 🎯 What's Next?

### Option A: Share with Developer

**Export for handoff:**
1. File → **Publish** → Share link
2. Developer uses Figma Dev Mode to inspect
3. Or export individual components: Select → Export → PNG/SVG

### Option B: Extract to Code

**With Figma MCP (in Claude Code):**
```bash
# Select component in Figma desktop
# Get node ID from URL: ?node-id=123-456
# In Claude Code:
mcp__figma-desktop__get_design_context({ nodeId: "123:456" })
```

I'll convert to React Native code!

### Option C: Continue Designing

- Add more components (Input, TabBar, EmptyState)
- Design all screen states (loading, error, empty)
- Create prototypes for full user flows
- Add animations and micro-interactions

---

## 🆘 Troubleshooting

### Plugin won't import JSON

**Manual Import (fallback):**

1. Open JSON file in text editor
2. Copy color hex values
3. Create variables manually:
   - Profile → Local variables → + → Enter name and value

### Text styles not working

- Check SF Pro font is installed (comes with macOS)
- If missing: Download from [Apple Developer](https://developer.apple.com/fonts/)

### Components not updating

- Check if component is detached (should show purple diamond)
- If detached, delete and re-drag from Assets
- Or right-click → **Reset all changes**

---

## 📚 Resources

**Figma Documentation:**
- [Variables guide](https://help.figma.com/hc/en-us/articles/15339657135383)
- [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519)
- [Auto Layout guide](https://help.figma.com/hc/en-us/articles/360040451373)

**Design Token Plugin:**
- [Plugin page](https://www.figma.com/community/plugin/888356646278934516)
- [Documentation](https://docs.tokens.studio/)

**Your Project Files:**
- `figma-design-tokens.json` - Import this first
- `figma-components-spec.json` - Component blueprints
- `figma-import-guide.md` - Detailed manual steps
- `figma-design-spec.md` - Visual specifications

---

## ⏱️ Time Estimate

| Phase | Task | Time |
|-------|------|------|
| 1 | Import tokens | 30 mins |
| 2 | Build 6 components | 4 hours |
| 3 | Create 3 screens | 2 hours |
| 4 | Add prototypes | 30 mins (optional) |
| **Total** | **Full design system** | **7 hours** |

**Quick version (core components only):** 2-3 hours

---

**Ready to build!** 🎨

Start with Phase 1 (30 minutes), then take a break. Phase 2 can be done component-by-component over multiple sessions.

**Questions?** Reference the detailed guides:
- `figma-import-guide.md` - Full walkthrough
- `figma-components-spec.json` - Exact specifications
- `figma-design-spec.md` - Visual details
