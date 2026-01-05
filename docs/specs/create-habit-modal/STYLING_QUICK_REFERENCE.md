# Styling Quick Reference - Visual Guide

## 🎨 At-a-Glance: What Each Style Controls

```
┌─────────────────────────────────────────┐
│  Create Habit                      [×]  │ ← ModalHeader.tsx
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   • fontSize: 20px (line 25)
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  33%         │   • color: #1c1917 (line 26)
│  ↑ Progress Bar                         │
│  Step 1 of 3                            │ ← Progress indicator
│                                         │   • bg-emerald-500 (line 95)
├─────────────────────────────────────────┤   • height: 4px (line 92)
│                                         │
│  What habit do you want to build?      │ ← Step title
│  ↑ Line 152 (text-2xl font-bold)       │   • text-2xl = 24px
│                                         │   • font-bold = 700 weight
│  Keep it simple and specific           │ ← Step description
│  ↑ Line 157 (text-base text-stone-500) │   • text-base = 16px
│                                         │   • text-stone-500 = #78716c
│  ┌─────────────────────────────────┐   │
│  │ e.g., Read for 20 minutes       │   │ ← Input field
│  └─────────────────────────────────┘   │   • Line 180-190
│  ↑ border-2 border-stone-200           │   • border: 2px solid #e7e5e4
│    rounded-2xl px-5 py-4               │   • borderRadius: 16px
│                                         │   • padding: 20px horizontal
│  0/50 characters                        │     16px vertical
│  ↑ Line 195 (text-xs text-stone-400)   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✨ Popular habits               │   │ ← Suggestions box
│  │ ┌─────────────────────────────┐ │   │   • bg-stone-50 (line 210)
│  │ │ Read for 20 minutes         │ │   │   • border-stone-100 (line 211)
│  │ └─────────────────────────────┘ │   │   • rounded-12px (line 212)
│  └─────────────────────────────────┘   │
│  ↑ Line 208-230                         │
│                                         │
├─────────────────────────────────────────┤
│  [     Continue →     ]                 │ ← Primary button
│  ↑ Line 290-300                         │   • bg: #10B981 (enabled)
│    backgroundColor: #10B981             │   • bg: #d6d3d1 (disabled)
│    borderRadius: 16px                   │   • height: 56px (14 * 4)
│    shadowOffset: { width: 0, height: 4 }│   • padding: 16px
└─────────────────────────────────────────┘   • shadow: 0 4px 8px
```

---

## 📍 File-Specific Styling Locations

### `CreateHabitWizard.tsx` (Main Component)

```typescript
// ╔═══════════════════════════════════════════════╗
// ║  COLORS                                       ║
// ╚═══════════════════════════════════════════════╝

Line 95:  Progress bar fill
          className="h-full bg-emerald-500"
          ↓ Change to: bg-blue-500, bg-purple-500, etc.

Line 165: Primary button background (enabled)
          backgroundColor: '#10B981'
          ↓ Change to: '#3B82F6' (blue), '#A855F7' (purple)

Line 166: Primary button background (disabled)
          backgroundColor: '#D6D3D1'
          ↓ Change to lighter/darker gray

Line 248: Time button selected background
          className="bg-emerald-50"
          ↓ Change to: bg-blue-50, bg-purple-50

Line 280: Reminder confirmation box
          style={{ background: '#D1FAE5', border: '1px solid #10B981' }}
          ↓ Change both to match your accent color


// ╔═══════════════════════════════════════════════╗
// ║  TYPOGRAPHY                                   ║
// ╚═══════════════════════════════════════════════╝

Line 152: Step title size & weight
          className="text-2xl font-bold text-stone-900"
          ↓ Size: text-xl (20px), text-3xl (30px)
          ↓ Weight: font-semibold (600), font-extrabold (800)

Line 157: Step description
          className="text-base text-stone-500"
          ↓ Size: text-sm (14px), text-lg (18px)
          ↓ Color: text-stone-400 (lighter), text-stone-600 (darker)

Line 195: Character counter
          className="text-xs text-stone-400"
          ↓ Size: text-xs (12px) - smallest readable


// ╔═══════════════════════════════════════════════╗
// ║  SPACING                                      ║
// ╚═══════════════════════════════════════════════╝

Line 185: Input field padding
          className="px-5 py-4"
          ↓ Horizontal: px-3 (12px), px-4 (16px), px-6 (24px)
          ↓ Vertical: py-2 (8px), py-3 (12px), py-5 (20px)

Line 200: Section margins
          className="mt-6"
          ↓ Margin top: mt-4 (16px), mt-8 (32px), mt-10 (40px)

Line 215: Gap between elements
          className="gap-2"
          ↓ Gap: gap-3 (12px), gap-4 (16px), gap-6 (24px)


// ╔═══════════════════════════════════════════════╗
// ║  BORDER RADIUS                                ║
// ╚═══════════════════════════════════════════════╝

Line 185: Input field corners
          className="rounded-2xl"
          ↓ Options: rounded-lg (8px), rounded-xl (12px), rounded-3xl (24px)

Line 245: Time button corners
          className="rounded-12px"
          ↓ Custom values: rounded-8px, rounded-16px, rounded-20px

Line 295: Primary button corners
          style={{ borderRadius: 16 }}
          ↓ Change to: 12, 20, 24


// ╔═══════════════════════════════════════════════╗
// ║  SHADOWS                                      ║
// ╚═══════════════════════════════════════════════╝

Line 298: Button shadow
          shadowOffset: { width: 0, height: 4 }
          shadowOpacity: 0.1
          shadowRadius: 8
          ↓ Lighter: height: 2, opacity: 0.05, radius: 4
          ↓ Heavier: height: 8, opacity: 0.15, radius: 16


// ╔═══════════════════════════════════════════════╗
// ║  ANIMATIONS                                   ║
// ╚═══════════════════════════════════════════════╝

Line 140: Step transition speed
          entering={FadeInRight.duration(300)}
          ↓ Faster: duration(200)
          ↓ Slower: duration(400)

Line 142: Step exit animation
          exiting={FadeOutLeft.duration(300)}
          ↓ Alternative: FadeOut, SlideOutRight, ZoomOut
```

---

### `CreateHabitModalSimple.tsx` (Modal Wrapper)

```typescript
// ╔═══════════════════════════════════════════════╗
// ║  MODAL OVERLAY                                ║
// ╚═══════════════════════════════════════════════╝

Line 105: Background overlay darkness
          className="flex-1 bg-black/50"
          ↓ Lighter: bg-black/30 (30% opacity)
          ↓ Darker: bg-black/70 (70% opacity)


// ╔═══════════════════════════════════════════════╗
// ║  MODAL BACKGROUND                             ║
// ╚═══════════════════════════════════════════════╝

Line 115: Modal background color
          className="bg-[#faf9f7]"
          ↓ Pure white: bg-white
          ↓ Cool gray: bg-stone-50
          ↓ Custom: bg-[#f8f8f8]


// ╔═══════════════════════════════════════════════╗
// ║  MODAL SHAPE                                  ║
// ╚═══════════════════════════════════════════════╝

Line 116: Top corner rounding
          className="rounded-t-3xl"
          ↓ Less round: rounded-t-2xl (16px)
          ↓ More round: rounded-t-[32px]
```

---

### Component-Specific Files

```typescript
// ╔═══════════════════════════════════════════════╗
// ║  TimeOfDaySelector.tsx                        ║
// ╚═══════════════════════════════════════════════╝

Line 46: Selected button style
         className={isSelected
           ? 'border-2 border-emerald-500 bg-emerald-50'
           : 'border border-stone-200 bg-white'}
         ↓ Change emerald to your accent color

Line 54: Button text color
         className={isSelected ? 'text-emerald-700' : 'text-stone-600'}


// ╔═══════════════════════════════════════════════╗
// ║  EmojiPicker.tsx                              ║
// ╚═══════════════════════════════════════════════╝

Line 35: Grid columns
         style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
         ↓ More columns: repeat(8, 1fr)
         ↓ Fewer columns: repeat(4, 1fr)

Line 42: Emoji size
         style={{ fontSize: 28 }}
         ↓ Smaller: 24, Larger: 32


// ╔═══════════════════════════════════════════════╗
// ║  ColorPickerSection.tsx                       ║
// ╚═══════════════════════════════════════════════╝

Line 28: Color swatch size
         className="w-10 h-10"
         ↓ Smaller: w-8 h-8 (32px)
         ↓ Larger: w-12 h-12 (48px)

Line 30: Selected border
         style={{ border: selected ? '3px solid #1f2937' : 'none' }}
         ↓ Thicker: 4px, Thinner: 2px


// ╔═══════════════════════════════════════════════╗
// ║  HabitNameField.tsx                           ║
// ╚═══════════════════════════════════════════════╝

Line 32: Input border
         className="border-2 border-stone-200"
         ↓ Thicker: border-3
         ↓ Different color: border-stone-300

Line 35: Focus state
         :focus { border-color: #10B981 }
         ↓ Change to your accent color
```

---

## 🎯 Most Common Customizations

### 1. Change Accent Color (5 locations)

```bash
# Find & Replace in VS Code
# Cmd+Shift+F (Mac) or Ctrl+Shift+F (Windows)

Find:    #10B981
Replace: #3B82F6    # Blue

Find:    bg-emerald-500
Replace: bg-blue-500

Find:    bg-emerald-50
Replace: bg-blue-50

Find:    text-emerald-700
Replace: text-blue-700

Find:    border-emerald-500
Replace: border-blue-500
```

---

### 2. Make Everything Rounder (3 locations)

```bash
Find:    rounded-xl
Replace: rounded-2xl

Find:    rounded-2xl
Replace: rounded-3xl

Find:    borderRadius: 16
Replace: borderRadius: 24
```

---

### 3. Increase All Spacing (4 locations)

```bash
Find:    p-4
Replace: p-6

Find:    mt-6
Replace: mt-8

Find:    gap-2
Replace: gap-4

Find:    px-5
Replace: px-6
```

---

### 4. Make Typography Bolder (2 locations)

```bash
Find:    font-bold
Replace: font-extrabold

Find:    fontWeight: '600'
Replace: fontWeight: '700'
```

---

## 📊 Complete Color Palette Map

```typescript
// Current Palette (Emerald Green)
Primary:       #10B981  (emerald-500)
Primary Light: #D1FAE5  (emerald-50)
Primary Dark:  #047857  (emerald-700)

// Alternative Palettes

// Blue (Professional)
Primary:       #3B82F6  (blue-500)
Primary Light: #DBEAFE  (blue-50)
Primary Dark:  #1D4ED8  (blue-700)

// Purple (Creative)
Primary:       #A855F7  (purple-500)
Primary Light: #F3E8FF  (purple-50)
Primary Dark:  #7E22CE  (purple-700)

// Pink (Friendly)
Primary:       #EC4899  (pink-500)
Primary Light: #FCE7F3  (pink-50)
Primary Dark:  #BE185D  (pink-700)

// Orange (Energetic)
Primary:       #F59E0B  (amber-500)
Primary Light: #FEF3C7  (amber-50)
Primary Dark:  #D97706  (amber-700)

// Teal (Calm)
Primary:       #14B8A6  (teal-500)
Primary Light: #CCFBF1  (teal-50)
Primary Dark:  #0F766E  (teal-700)
```

---

## 🔥 Pro Tips

### Tip 1: Use Browser DevTools for HTML Mockups
```
1. Right-click any element in the mockup
2. Select "Inspect Element"
3. Edit CSS live in DevTools
4. Copy working styles back to HTML file
```

### Tip 2: Hot Reload in React Native
```
1. Make style changes
2. Press 'r' in Metro bundler terminal
3. Or save file (auto-reloads in < 2 seconds)
```

### Tip 3: Test Dark Mode Easily
```typescript
// Add to top of CreateHabitWizard.tsx
const FORCE_DARK = true; // Toggle this

const isDark = FORCE_DARK || useColorScheme() === 'dark';
```

### Tip 4: Quick Visual Debugging
```typescript
// Temporarily add bright border to see layout
style={{ borderWidth: 2, borderColor: 'red' }}
```

---

## 📁 Files You'll Edit Most

1. **`CreateHabitWizard.tsx`** (90% of styling)
   - Colors, spacing, typography, animations
   - Lines: 100-400

2. **`CreateHabitModalSimple.tsx`** (10% of styling)
   - Modal overlay, background
   - Lines: 100-120

3. **HTML Mockups** (for rapid prototyping)
   - `habit_creation_wizard_mockup.html`
   - `habit_creation_quick_mode.html`
   - Edit `<style>` sections (lines 10-150)

---

## ✅ Change Verification Checklist

After making styling changes, check:

- [ ] Progress bar color updated (Step 1, 2, 3)
- [ ] Continue button color matches accent
- [ ] Time selection buttons highlight correctly
- [ ] Input field focus state uses accent color
- [ ] Reminder confirmation box matches theme
- [ ] Success animation checkmark color
- [ ] All text remains readable (contrast check)
- [ ] Spacing feels balanced on device
- [ ] Animations don't feel too fast/slow

---

**Need more help?** Check `STYLING_GUIDE.md` for detailed explanations and code examples!
