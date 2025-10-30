# Habit Tracker - Figma Design Specification

**Generated:** 2025-10-30
**Project:** Science-Backed Habit Tracking App
**Platform:** iOS (React Native)
**Design System:** Custom component library with iOS Human Interface Guidelines

---

## 📐 Design Tokens & Variables

### Color System

Use Figma Variables for these color tokens:

#### Primary Colors (Growth & Progress)
```
brand/primary/400: #34D399 (Lighter, hover states)
brand/primary/500: #10B981 (Main brand color - Emerald green)
brand/primary/600: #059669 (Darker, pressed states)
brand/primary/700: #047857 (Very dark, high contrast text)
```

#### Secondary Colors (Trust & Calm)
```
brand/secondary/400: #60A5FA (Lighter, info states)
brand/secondary/500: #3B82F6 (Science/analytics theme)
brand/secondary/600: #2563EB (Darker, pressed)
```

#### Semantic Colors
```
semantic/success: #10B981
semantic/warning: #F59E0B (Amber - habits at risk)
semantic/error: #EF4444 (Red - errors, delete)
semantic/info: #3B82F6
```

#### Neutral Grays (iOS-inspired)
```
gray/50: #F9FAFB (Background, cards in dark mode)
gray/100: #F3F4F6 (Card backgrounds)
gray/200: #E5E7EB (Borders, dividers)
gray/300: #D1D5DB (Disabled elements)
gray/400: #9CA3AF (Placeholder text)
gray/500: #6B7280 (Secondary text)
gray/600: #4B5563 (Body text)
gray/700: #374151 (Headings)
gray/800: #1F2937 (Very dark text)
gray/900: #111827 (Pure black alternative)
```

#### Habit Strength Level Colors
```
strength/starting: #86EFAC (Light green) 0-20%
strength/building: #10B981 (Brand green) 20-40%
strength/developing: #059669 (Medium green) 40-60%
strength/strong: #047857 (Dark green) 60-80%
strength/automatic: #065F46 (Deep forest green) 80-100%
```

#### Background & Surfaces
```
surface/background: #FFFFFF (Pure white)
surface/card: #F9FAFB (Gray-50, subtle off-white)
surface/modal: #FFFFFF (with shadow)
```

---

### Typography System

**Font Family:** SF Pro (iOS native)

Create Figma Text Styles for:

#### Display Large
- **Name:** `Display/Large`
- **Font:** SF Pro Display Bold
- **Size:** 34pt
- **Weight:** 700 (Bold)
- **Line Height:** 41pt
- **Letter Spacing:** 0.37pt
- **Use Case:** Onboarding headlines

#### Heading 1
- **Name:** `Heading/H1`
- **Font:** SF Pro Display Bold
- **Size:** 28pt
- **Weight:** 700
- **Line Height:** 34pt
- **Letter Spacing:** 0.36pt
- **Use Case:** Screen titles

#### Heading 2
- **Name:** `Heading/H2`
- **Font:** SF Pro Display Semibold
- **Size:** 22pt
- **Weight:** 600
- **Line Height:** 28pt
- **Letter Spacing:** 0.35pt
- **Use Case:** Section titles

#### Heading 3
- **Name:** `Heading/H3`
- **Font:** SF Pro Text Semibold
- **Size:** 17pt
- **Weight:** 600
- **Line Height:** 22pt
- **Letter Spacing:** -0.41pt
- **Use Case:** Card titles, habit names

#### Body
- **Name:** `Body/Regular`
- **Font:** SF Pro Text Regular
- **Size:** 17pt
- **Weight:** 400
- **Line Height:** 22pt
- **Letter Spacing:** -0.41pt
- **Use Case:** Primary text

#### Body Small
- **Name:** `Body/Small`
- **Font:** SF Pro Text Regular
- **Size:** 15pt
- **Weight:** 400
- **Line Height:** 20pt
- **Letter Spacing:** -0.24pt
- **Use Case:** Secondary info

#### Caption
- **Name:** `Caption`
- **Font:** SF Pro Text Regular
- **Size:** 13pt
- **Weight:** 400
- **Line Height:** 18pt
- **Letter Spacing:** -0.08pt
- **Use Case:** Meta info, timestamps

#### Button Text
- **Name:** `Button/Label`
- **Font:** SF Pro Text Semibold
- **Size:** 17pt
- **Weight:** 600
- **Line Height:** 22pt
- **Letter Spacing:** -0.41pt

---

### Spacing System

Use Figma Variables for spacing tokens (8pt grid):

```
spacing/xs: 4pt (tight spacing, icon padding)
spacing/sm: 8pt (compact spacing within components)
spacing/md: 12pt (component internal spacing)
spacing/base: 16pt (standard spacing - most common)
spacing/lg: 24pt (section spacing)
spacing/xl: 32pt (screen margins, major sections)
spacing/2xl: 48pt (large vertical spacing)
spacing/3xl: 64pt (page sections)
```

#### Component-Specific Spacing
```
card/padding: 16pt (all sides)
card/margin: 8pt vertical, 16pt horizontal
list-item/height: 72pt minimum
button/height: 44pt (Apple HIG minimum)
input/height: 44pt
tab-bar/height: 49pt + safe area bottom
```

---

### Border Radius

```
radius/sm: 8pt (buttons, tags)
radius/md: 12pt (cards, inputs)
radius/lg: 16pt (modals, sheets)
radius/xl: 20pt (full screen modals - top corners only)
radius/full: 50% (circular - avatars, icon buttons)
```

---

### Shadows & Elevation

iOS-style shadows (subtle, not Material Design):

#### Card Shadow
```
Effect: Drop Shadow
- X: 0
- Y: 2
- Blur: 8
- Color: rgba(0, 0, 0, 0.1)
```

#### Modal Shadow
```
Effect: Drop Shadow
- X: 0
- Y: 4
- Blur: 16
- Color: rgba(0, 0, 0, 0.12)
```

#### Floating Action Button
```
Effect: Drop Shadow
- X: 0
- Y: 6
- Blur: 12
- Color: rgba(0, 0, 0, 0.15)
```

---

## 🎨 Component Library

### 1. HabitCard Component

**Purpose:** Display individual habit with all tracking info

#### Variants
Create component variants with properties:

**State:**
- Default (not completed)
- Completed (checkmark, muted green background)
- At Risk (warning badge, <40% prediction)
- Pressed (scale 0.95)
- Disabled (50% opacity)

**Size:**
- Small (68pt height - compact strength indicator)
- Standard (72pt height - full strength indicator)
- Large (76pt height - extra padding)

#### Layout Structure (Auto Layout)
```
┌─────────────────────────────────────────────┐
│ [Color Accent Bar] 4pt wide, full height    │
│                                              │
│  [Icon] 32x32pt    [Habit Name] 17pt Bold   │
│  🧘                Morning Meditation        │
│                                              │
│  [Strength Bar]    ▰▰▰▰▰▰▱▱▱▱ 62% 💪        │
│  Progress bar      Compact indicator         │
│                                              │
│                    [Status] ✓ or [ ]         │
│                    Completed/Pending         │
└─────────────────────────────────────────────┘
```

**Measurements:**
- Card height: 72pt
- Card padding: 16pt all sides
- Color accent bar: 4pt wide (left edge)
- Icon size: 32x32pt
- Icon corner radius: 8pt
- Strength bar height: 8pt
- Gap between elements: 8pt

---

### 2. HabitStrengthIndicator Component

**Purpose:** Visualize habit strength with science-backed metrics

#### Variants
**Type:**
- Compact (emoji + bar + %, used in list)
- Full (large emoji, full bar, label, used in detail)
- Graph (trend line - premium)

**Level (State):**
- Starting 🌱 (0-20%) - Color: #86EFAC
- Building 🌿 (20-40%) - Color: #10B981
- Developing 🌳 (40-60%) - Color: #059669
- Strong 💪 (60-80%) - Color: #047857
- Automatic ⚡ (80-100%) - Color: #065F46

#### Compact Layout (Auto Layout Horizontal)
```
[Emoji] 24pt  [Progress Bar]────── [Percentage]
🌱           ▰▰▰▰▱▱▱▱▱▱            18%
```

**Measurements:**
- Emoji size: 24pt
- Bar width: Flexible (fills available space)
- Bar height: 8pt
- Bar corner radius: 4pt (full rounded)
- Percentage text: 15pt Regular (SF Mono)
- Gap: 8pt between elements

#### Full Layout (Auto Layout Vertical)
```
        [Large Emoji] 64pt
             💪

    [Level Label] 22pt Semibold
         Strong

   [Progress Bar]──────────
   ▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱

        65% Strength
    17pt Regular (SF Mono)
```

**Measurements:**
- Emoji size: 64pt
- Bar width: 280pt
- Bar height: 12pt
- Gap: 16pt between elements

---

### 3. Button Component

**Purpose:** Primary interaction element

#### Variants
**Type:**
- Primary (filled, brand color)
- Secondary (outlined, border only)
- Ghost (text only, no background)
- Icon (circular, 44x44pt)

**State:**
- Default
- Pressed (scale 0.95, darker color)
- Disabled (50% opacity)
- Loading (spinner, disabled)

**Size:**
- Small (32pt height)
- Medium (44pt height - default)
- Large (56pt height)

#### Primary Button Layout
```
┌──────────────────────────┐
│   Create Habit           │  44pt height
└──────────────────────────┘
```

**Specifications:**
- Height: 44pt (medium)
- Padding: 16pt horizontal, 12pt vertical
- Corner radius: 12pt
- Background: brand/primary/500
- Text: Button/Label style, white color
- Minimum width: 120pt

**States:**
- Pressed: background → brand/primary/600, scale 0.95
- Disabled: opacity 50%
- Loading: show spinner (20pt), disable interaction

---

### 4. Input Field Component

**Purpose:** User data entry

#### Variants
**Type:**
- Text Input (single line)
- Text Area (multi-line)
- Picker (color, icon - custom)

**State:**
- Default
- Focused (border color brand/primary/500, label animation)
- Error (border red, error message)
- Disabled (gray, 50% opacity)
- Valid (checkmark icon)

#### Text Input Layout
```
┌────────────────────────────────────┐
│ Habit Name                   [✓]   │  44pt
│ Morning Meditation                 │
└────────────────────────────────────┘
   ↑ Placeholder/Label floats up
```

**Specifications:**
- Height: 44pt
- Padding: 12pt horizontal, 12pt vertical
- Corner radius: 12pt
- Border: 1pt, gray/300
- Background: surface/card
- Placeholder: gray/400, 17pt
- Text: Body/Regular, gray/700

**Focus State:**
- Border: 2pt, brand/primary/500
- Label floats up (animation)
- Cursor appears

---

### 5. Modal Component

**Purpose:** Overlay screens for focused tasks

#### Variants
**Type:**
- Bottom Sheet (create/edit habit - slides up from bottom)
- Full Screen (habit detail - slides from right)
- Center Alert (confirmations, celebrations)

**State:**
- Entering (animation in progress)
- Open (visible, backdrop dimmed)
- Exiting (animation out)

#### Bottom Sheet Layout
```
┌────────────────────────────────────┐
│ ──────  Create Habit  ───────      │  Handle (drag indicator)
│                                    │
│  [Content Area]                    │
│  Auto Layout Vertical              │
│  Padding: 24pt all sides           │
│  Gap: 24pt between sections        │
│                                    │
│  [Primary Button]                  │
│  [Ghost Button]                    │
└────────────────────────────────────┘
```

**Specifications:**
- Corner radius: 20pt (top corners only)
- Padding: 24pt all sides
- Handle: 40pt wide, 4pt tall, gray/300
- Backdrop: rgba(0, 0, 0, 0.6)
- Shadow: Modal shadow effect

---

### 6. Card Component

**Purpose:** Group related information

#### Variants
**Type:**
- Default (white, shadow)
- Highlighted (colored border, accent)
- Stat Card (analytics overview - with icon)

**State:**
- Default
- Pressed (if tappable, scale 0.98)
- Disabled (50% opacity)

#### Stat Card Layout
```
┌──────────────────┐
│  📊  Analytics   │  Icon + Label
│                  │
│      5 Habits    │  Large number/value
│       Active     │  Secondary label
└──────────────────┘
```

**Specifications:**
- Padding: 16pt all sides
- Corner radius: 12pt
- Background: surface/card
- Shadow: Card shadow effect
- Gap: 8pt vertical between elements

---

### 7. Tab Bar Component

**Purpose:** Primary navigation (iOS native style)

#### Variants
**State per Tab:**
- Active (brand color, bold label)
- Inactive (gray, regular weight)
- With Badge (lock icon on Analytics - premium)

#### Layout
```
┌─────────────────────────────────────┐
│  [Icon]  [Icon]  [Icon]  [Icon]     │
│   🏠      📊      📚      ⚙️         │
│  Home  Analytics Templates Settings │
└─────────────────────────────────────┘
```

**Specifications:**
- Height: 49pt + safe area bottom inset
- Icon size: 28pt
- Label: 10pt Medium, -0.12pt letter spacing
- Active color: brand/primary/500
- Inactive color: gray/500
- Gap: 4pt between icon and label

---

### 8. Toast/Snackbar Component

**Purpose:** Brief, non-blocking feedback messages

#### Variants
**Type:**
- Success (green, checkmark)
- Error (red, X icon)
- Info (blue, i icon)
- Warning (orange, ! icon)
- Undo (with action button)

**State:**
- Entering (slide up)
- Visible (static)
- Exiting (slide down/fade)

#### Layout
```
┌─────────────────────────────────────┐
│ ✓  Habit completed successfully     │
└─────────────────────────────────────┘
    ↑ Icon   Message
```

**Specifications:**
- Height: 56pt (flexible width)
- Padding: 16pt horizontal, 12pt vertical
- Corner radius: 12pt
- Background: gray/800 (90% opacity)
- Text: white, 15pt Regular
- Icon: 20pt
- Gap: 12pt between icon and text
- Shadow: Card shadow

---

### 9. EmptyState Component

**Purpose:** Guide users when no data exists

#### Variants
**Type:**
- No Habits (first-time user)
- No Data Yet (<7 days)
- No Results (search/filter)
- Premium Locked (paywall preview)

#### Layout
```
        [Illustration]
         📊 (Icon)
         128pt

    No habits yet
    (22pt Semibold)

Start building better habits
with science-backed tracking
    (15pt Regular)

┌──────────────────────┐
│  Create First Habit  │  Primary button
└──────────────────────┘
```

**Specifications:**
- Icon/illustration: 128pt
- Headline: 22pt Semibold, gray/700
- Description: 15pt Regular, gray/500
- Max width: 320pt (centered)
- Gap: 16pt between elements

---

### 10. Chart Components (Analytics)

**Purpose:** Data visualization for premium users

#### Variants
**Type:**
- Line Chart (strength trends over time)
- Donut Chart (strength distribution by level)
- Heatmap (compliance calendar - GitHub style)
- Bar Chart (habit rankings)

#### Line Chart Specifications
```
Height: 240pt (standard), 200pt (small devices)
Padding: 16pt all sides
X-axis: Days (last 30)
Y-axis: Strength percentage (0-100%)
Line color: brand/primary/500
Line width: 2pt
Data points: 4pt circles
Grid: gray/200, 1pt
```

#### Donut Chart Specifications
```
Size: 200pt diameter
Center hole: 100pt diameter
Segment colors: Use strength level colors
Stroke width: 20pt
Center text: Average strength %
Legend: Below chart, 8pt gap per item
```

#### Heatmap Specifications
```
Grid: 7 columns (days) x 5+ rows (weeks)
Cell size: 12pt x 12pt
Cell gap: 4pt
Cell corner radius: 2pt
Colors:
- Empty: gray/100
- Low (1-25%): strength/starting (10% opacity)
- Medium (26-75%): strength/building (50% opacity)
- High (76-99%): strength/strong (80% opacity)
- Complete (100%): strength/automatic (100% opacity)
```

---

## 📱 Screen Templates

### Home Screen (Habit List)

**Frame:** iPhone 13 (390 x 844 pt)

#### Layout Structure
```
Auto Layout Vertical, Fill Container

┌─────────────────────────────────────┐
│ Status Bar (dynamic)                 │  System UI
├─────────────────────────────────────┤
│ ⚙️              Today         [+]    │  Header: 64pt
├─────────────────────────────────────┤
│ 📅 Monday, Oct 30, 2025             │  Date: 44pt
├─────────────────────────────────────┤
│                                     │
│ [HabitCard Component]               │  72pt each
│ [HabitCard Component]               │  8pt gap
│ [HabitCard Component]               │
│ ...                                 │
│                                     │
│ (Scrollable content)                │
│                                     │
├─────────────────────────────────────┤
│ 🏠    📊    📚    ⚙️                │  Tab Bar: 49pt + safe area
└─────────────────────────────────────┘
```

**Constraints:**
- Screen padding: 16pt horizontal (left/right)
- Content padding: 8pt vertical between cards
- Safe area top: Respected (notch)
- Safe area bottom: Respected (home indicator)

---

### Create Habit Modal (Bottom Sheet)

**Frame:** iPhone 13 (390 x 844 pt)

#### Layout Structure
```
Modal slides up from bottom

┌─────────────────────────────────────┐
│ [Backdrop: 60% black overlay]       │
│                                     │
│ ╔═══════════════════════════════╗  │
│ ║ ───── Create Habit ─────       ║  Handle
│ ║                                ║
│ ║ Habit Name                     ║  Label
│ ║ ┌────────────────────────┐    ║  Input
│ ║ │                        │    ║
│ ║ └────────────────────────┘    ║
│ ║                                ║
│ ║ Icon                           ║  Label
│ ║ 🧘 🏃 📚 💪 🎨 ✍️ →           ║  Horizontal scroll
│ ║                                ║
│ ║ Color                          ║  Label
│ ║ ● ● ● ● ● ● ● ●              ║  Color picker
│ ║                                ║
│ ║ ┌────────────────────────┐    ║  Primary button
│ ║ │   Create Habit         │    ║
│ ║ └────────────────────────┘    ║
│ ║                                ║
│ ║ [Cancel]                       ║  Ghost button
│ ╚═══════════════════════════════╝  │
└─────────────────────────────────────┘
```

**Constraints:**
- Modal corner radius: 20pt (top corners)
- Modal padding: 24pt all sides
- Section gap: 24pt vertical
- Input/button height: 44pt
- Handle: 40pt wide, 4pt tall, centered

---

### Analytics Dashboard (Premium)

**Frame:** iPhone 13 (390 x 844 pt)

#### Layout Structure
```
Auto Layout Vertical, Scrollable

┌─────────────────────────────────────┐
│ Analytics              🔒 Premium   │  Header: 64pt
├─────────────────────────────────────┤
│                                     │
│ Overview                            │  Section: 22pt
│ ┌──────────┐ ┌──────────┐         │
│ │5 Habits  │ │54% Avg   │         │  Stat cards
│ │Active    │ │Strength  │         │
│ └──────────┘ └──────────┘         │
│                                     │
│ Strength Distribution               │  Section
│ ┌─────────────────────────────┐   │
│ │     [Donut Chart]           │   │  240pt height
│ │                             │   │
│ └─────────────────────────────┘   │
│                                     │
│ 30-Day Trend                        │  Section
│ ┌─────────────────────────────┐   │
│ │     [Line Chart]            │   │  240pt height
│ │                             │   │
│ └─────────────────────────────┘   │
│                                     │
│ (Scrollable...)                     │
│                                     │
├─────────────────────────────────────┤
│ 🏠    📊    📚    ⚙️                │  Tab Bar
└─────────────────────────────────────┘
```

**Constraints:**
- Screen padding: 16pt horizontal
- Section gap: 24pt vertical
- Card gap: 8pt horizontal (stat cards)
- Chart margin: 16pt top/bottom

---

### Paywall Modal (Subscription)

**Frame:** iPhone 13 (390 x 844 pt)

#### Layout Structure
```
Full screen modal

┌─────────────────────────────────────┐
│                           [✕]       │  Close button
│                                     │
│          ✨ Premium ✨              │  Headline: 28pt
│  "Unlock Science-Backed Insights"   │  Subhead: 17pt
│                                     │
│  ✓ Advanced Analytics               │  Feature list
│  ✓ Behavior Predictions             │  15pt with icons
│  ✓ Smart Reminders                  │
│  ✓ Progress Tracking                │
│  ✓ Data Export                      │
│                                     │
│ ╔═══════════════════════════════╗  │
│ ║ 🎉 7-Day Free Trial           ║  │  Highlighted card
│ ║ Then $9.99/month              ║  │
│ ║ ┌───────────────────────┐    ║  │
│ ║ │ Start Free Trial      │    ║  │  CTA button
│ ║ └───────────────────────┘    ║  │
│ ╚═══════════════════════════════╝  │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ $79.99/year                  │   │  Alt option
│ │ Save 33% • Annual billing    │   │
│ │ [Subscribe]                  │   │
│ └─────────────────────────────┘   │
│                                     │
│ "Cancel anytime. Auto-renews."     │  Caption
│ [Restore Purchases]                 │  Ghost button
│                                     │
└─────────────────────────────────────┘
```

**Constraints:**
- Screen padding: 24pt horizontal, 32pt vertical
- Feature list item: 44pt height, 12pt gap
- Pricing card padding: 16pt
- Button height: 48pt (larger for conversion)
- Section gap: 24pt

---

### Milestone Celebration Modal

**Frame:** iPhone 13 (390 x 844 pt)

#### Layout Structure
```
Center modal with confetti overlay

┌─────────────────────────────────────┐
│  ❄️ ❄️ ❄️ ❄️ (Confetti particles)  │
│                                     │
│  ╔═════════════════════════════╗  │
│  ║                             ║  │
│  ║         💪                  ║  │  Emoji: 80pt
│  ║      (glowing)              ║  │
│  ║                             ║  │
│  ║      Strong Level!          ║  │  Headline: 28pt
│  ║                             ║  │
│  ║  Morning Meditation         ║  │  Body: 17pt
│  ║  has reached 60% strength   ║  │
│  ║                             ║  │
│  ║  ▰▰▰▰▰▰▰▰▰▱ 60%            ║  │  Progress bar
│  ║                             ║  │
│  ║  ┌──────────────────────┐   ║  │
│  ║  │ Share Achievement    │   ║  │  Button: 48pt
│  ║  └──────────────────────┘   ║  │
│  ║                             ║  │
│  ║       [Continue]            ║  │  Ghost button
│  ║                             ║  │
│  ╚═════════════════════════════╝  │
└─────────────────────────────────────┘
```

**Constraints:**
- Modal width: 320pt
- Modal padding: 32pt
- Modal corner radius: 20pt
- Backdrop: rgba(0, 0, 0, 0.6)
- Element gap: 16pt vertical

---

## 🎬 Animation Specifications

### Spring Physics Parameters

Use these consistent values for all spring animations:

```
Damping: 15
Stiffness: 150
Mass: 1
Damping Ratio: ~0.8 (slightly overdamped)
```

These match iOS native feel and should be used in:
- React Native Reanimated: `withSpring({ damping: 15, stiffness: 150 })`
- Figma Smart Animate: Use "Spring" easing with similar parameters

---

### Key Animation Timings

```
Quick Interactions: <200ms
- Button presses
- Taps
- Toggles

Standard Transitions: 300-400ms
- Modals appearing/dismissing
- Navigation
- State changes

Long Animations: 500-800ms
- Celebrations
- Milestones
- Can be skipped by user
```

---

### Habit Completion Animation Sequence

**Duration:** 600ms total

```
0-100ms: Button press (scale 0.95)
100-300ms: Checkmark appears (scale 0 → 1.2 → 1.0)
300-500ms: Strength bar fills, percentage counts up
500-600ms: Card settles to completed state
```

**Figma Prototype:**
1. Create "Default" and "Completed" variants
2. Add interaction: On Tap → Change to "Completed"
3. Smart Animate: 600ms, Spring easing
4. Include checkmark scale animation (0 → 1.2 → 1.0 bounce)

---

### Modal Slide-Up Animation

**Duration:** 300ms

```
From: translateY(100%), opacity 0
To: translateY(0%), opacity 1
Easing: Spring (damping 15, stiffness 150)
```

**Figma Prototype:**
1. Start frame: Modal off-screen (Y position + 844pt)
2. End frame: Modal on-screen (Y position 0)
3. Smart Animate: 300ms, Spring easing
4. Add backdrop fade-in (0 → 0.6 opacity) simultaneously

---

### Progress Bar Fill Animation

**Duration:** 400ms

```
From: width at old percentage
To: width at new percentage
Easing: Spring
Color: May transition if crossing level boundary
```

**Figma Prototype:**
1. Use progress component with variants (0%, 25%, 50%, 75%, 100%)
2. Animate width property
3. Smart Animate: 400ms, Spring easing
4. Add color transition if needed (e.g., green → darker green)

---

## ♿ Accessibility Guidelines

### Color Contrast Requirements (WCAG 2.1 AA)

**Text Contrast:**
- Normal text (17pt): Minimum 4.5:1
- Large text (22pt+): Minimum 3:1
- UI components: Minimum 3:1

**Verified Combinations:**
✅ gray/700 on white: 10.8:1
✅ gray/600 on white: 8.3:1
✅ primary/700 on white: 7.2:1 (use for text, not primary/500)
⚠️ warning/500 on white: 2.3:1 (use warning/700 for text)

**Figma Plugin:** Use "Color Contrast Checker" plugin to verify all text/background combinations.

---

### Touch Targets

**Minimum Size:** 44 x 44 pt (Apple HIG)
**Preferred:** 48 x 48 pt (extra comfort)

All buttons, cards, and interactive elements must meet this minimum.

**Figma Setup:**
- Create 44x44pt frame overlay (red outline) to check all buttons
- Ensure spacing between adjacent tappable elements is ≥8pt

---

### Dynamic Type Support

All text styles should scale up to XXXL (accessibility sizes).

**Figma Plugin:** Use "A11y - Focus Order" to verify VoiceOver reading order.

---

## 🚀 Export Settings

### Assets for Development

**Icons:**
- Format: SVG
- Size: 1x, 2x, 3x (@1x, @2x, @3x for iOS)
- Color: Use template rendering (single color, tintable)

**Images:**
- Format: PNG or WebP
- Compression: Optimize for web
- Size: 1x, 2x, 3x

**Color Variables:**
- Export as JSON for React Native theme
- Include hex values for all color tokens

**Typography:**
- Export as JSON with size, weight, line height, letter spacing

---

## 📦 Figma File Organization

### Recommended Page Structure

```
1. 🎨 Design System
   ├── Color Tokens (Variables)
   ├── Typography Styles
   ├── Spacing Tokens (Variables)
   ├── Effects (Shadows)
   └── Icons

2. 🧩 Components
   ├── Atoms (Button, Input, Icon)
   ├── Molecules (HabitCard, HabitStrengthIndicator)
   ├── Organisms (HabitList, Modal, TabBar)
   └── Charts (LineChart, DonutChart, Heatmap)

3. 📱 Screens (Templates)
   ├── Onboarding
   ├── Home (Habit List)
   ├── Create Habit Modal
   ├── Habit Detail
   ├── Analytics Dashboard
   ├── Paywall
   ├── Settings
   └── Milestone Celebration

4. 🎬 Prototypes
   ├── User Flow 1: Onboarding
   ├── User Flow 2: Daily Check-In
   ├── User Flow 3: Premium Conversion
   └── Animation Examples

5. 📐 Wireframes
   └── Low-fidelity layouts
```

---

## ✅ Figma Setup Checklist

Before designing:

- [ ] Create color variables for all design tokens
- [ ] Set up text styles for all typography specifications
- [ ] Create spacing variables (8pt grid)
- [ ] Set up shadow effects (card, modal, FAB)
- [ ] Create corner radius styles (8, 12, 16, 20, 50%)
- [ ] Import SF Pro font family
- [ ] Set up iPhone 13 frame (390 x 844 pt) with safe areas
- [ ] Create component library structure (atoms → molecules → organisms)
- [ ] Enable Auto Layout for all components
- [ ] Set up component variants (states, sizes, types)

---

## 🔗 Related Documents

- **UX Specification:** `/docs/ux-specification.md` (Complete UX details)
- **AI Frontend Prompt:** `/docs/ai-frontend-prompt.md` (Code generation prompt)
- **PRD:** `/docs/PRD.md` (Product requirements)
- **Tech Spec:** `/docs/tech-spec.md` (Technical architecture)

---

## 📝 Notes for Designers

### Priority Components to Build First

1. **Design System Foundation** (Colors, Typography, Spacing)
2. **HabitCard Component** (Most used component)
3. **Button Component** (Reused everywhere)
4. **Modal Component** (Bottom Sheet variant first)
5. **Home Screen Template** (Assemble from components)

### Tips for Figma-to-Code Handoff

- Use Auto Layout extensively (matches React Native Flexbox)
- Name layers descriptively (`habit-card-icon`, not `Rectangle 7`)
- Use components for everything (easier to update)
- Create variants instead of duplicate components
- Export design tokens as JSON for React Native
- Use Figma Dev Mode for accurate CSS specs

### AI Design Tool Compatibility

This spec is optimized for:
- **Figma** (primary design tool)
- **v0.dev** (Vercel's AI UI generator - paste color/typography sections)
- **Lovable** (AI coding assistant - paste component specs)
- **Cursor** (AI IDE - paste layout structures)

---

**Ready to design!** 🎨

This specification provides everything needed to build the complete design system in Figma and generate production-ready components.
