# Habit Creation Flow - Styling Guide

## Overview

This guide shows you exactly where to customize colors, spacing, typography, and animations across all three implementation approaches.

---

## 1. React Native Implementation (Actual Code)

### File: `CreateHabitWizard.tsx`

#### **Colors**

```typescript
// Location: Line ~100-120 (Progress Bar)
<View style={{ width: `${progress}%` }} className="h-full bg-emerald-500" />
//                                                           ↑ Change this
// Options: bg-blue-500, bg-purple-500, bg-pink-500, etc.

// Location: Line ~200-220 (Continue Button)
style={{
  backgroundColor: canProceedFromName ? '#10B981' : '#D6D3D1',
  //                                     ↑ Change these hex codes
  opacity: canProceedFromName ? 1 : 0.5,
}}

// Location: Line ~280-300 (Time Selection - Selected State)
className={`... ${
  isSelected
    ? 'bg-emerald-50'  // ← Selected background
    : 'border border-stone-200 bg-white'  // ← Unselected
}`}

// Location: Line ~320-340 (Reminder Confirmation Box)
<View style={{ background: '#D1FAE5', border: '1px solid #10B981' }}>
//                          ↑ Light green      ↑ Dark green border
```

**Color Token Reference:**
```typescript
// Emerald (current accent)
bg-emerald-50   → #ECFDF5 (lightest)
bg-emerald-500  → #10B981 (primary)
bg-emerald-700  → #047857 (darkest)

// Alternative Palettes
// Blue
bg-blue-50   → #EFF6FF
bg-blue-500  → #3B82F6
bg-blue-700  → #1D4ED8

// Purple
bg-purple-50   → #FAF5FF
bg-purple-500  → #A855F7
bg-purple-700  → #7E22CE

// Pink
bg-pink-50   → #FDF2F8
bg-pink-500  → #EC4899
bg-pink-700  → #BE185D
```

---

#### **Typography**

```typescript
// Location: Line ~150-160 (Step Titles)
<Text className="text-2xl font-bold text-stone-900">
//                ↑ Size    ↑ Weight  ↑ Color
  What habit do you want to build?
</Text>

// Size options:
text-xl   → 20px
text-2xl  → 24px
text-3xl  → 30px

// Weight options:
font-normal   → 400
font-medium   → 500
font-semibold → 600
font-bold     → 700
font-extrabold → 800

// Location: Line ~165-170 (Step Descriptions)
<Text className="text-base text-stone-500">
//                ↑ 16px    ↑ Gray color
  Keep it simple and specific
</Text>

// Color options:
text-stone-500  → #78716c (medium gray)
text-stone-600  → #57534e (darker gray)
text-stone-700  → #44403c (darkest gray)
```

---

#### **Spacing**

```typescript
// Location: Line ~180-190 (Input Field Padding)
className="bg-white border-2 border-stone-200 rounded-2xl px-5 py-4"
//                                                          ↑ Horizontal ↑ Vertical

// Padding scale (px-* / py-*):
p-2  → 8px
p-3  → 12px
p-4  → 16px
p-5  → 20px
p-6  → 24px

// Location: Line ~200-210 (Section Margins)
<View className="mt-6">
//                ↑ Top margin

// Margin scale (mt-* / mb-* / my-*):
m-4  → 16px
m-5  → 20px
m-6  → 24px
m-8  → 32px
m-10 → 40px
```

---

#### **Border Radius**

```typescript
// Location: Line ~180-190 (Input Fields)
className="... rounded-2xl ..."
//                ↑ Border radius

// Radius options:
rounded-lg   → 8px  (subtle)
rounded-xl   → 12px (moderate)
rounded-2xl  → 16px (prominent - current)
rounded-3xl  → 24px (very round)

// Location: Line ~250-260 (Time Buttons)
className="... rounded-12px ..."
```

---

#### **Shadows & Elevation**

```typescript
// Location: Line ~290-300 (Button Shadow)
style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  //                               ↑ Vertical offset (depth)
  shadowOpacity: 0.1,
  //             ↑ Darkness (0-1)
  shadowRadius: 8,
  //            ↑ Blur amount
  elevation: 3, // Android-specific
}}

// Shadow presets:
// Subtle
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.05
shadowRadius: 4

// Medium (current)
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 8

// Prominent
shadowOffset: { width: 0, height: 8 }
shadowOpacity: 0.15
shadowRadius: 16
```

---

#### **Animations**

```typescript
// Location: Line ~10-20 (Animation Imports)
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

// Location: Line ~140-150 (Step Transitions)
<Animated.View
  entering={FadeInRight.duration(300)}
  //                     ↑ Speed (milliseconds)
  exiting={FadeOutLeft.duration(300)}
>

// Duration options:
duration(200)  → Fast/snappy
duration(300)  → Balanced (current)
duration(400)  → Smooth
duration(600)  → Slow/dramatic

// Alternative animations:
FadeIn         → Simple opacity
SlideInRight   → Slide from right
ZoomIn         → Scale up
BounceIn       → Bouncy entrance
```

---

### File: `CreateHabitModalSimple.tsx`

#### **Modal Background Overlay**

```typescript
// Location: Line ~100-110
<View className="flex-1 bg-black/50">
//                        ↑ Black with 50% opacity

// Opacity options:
bg-black/30  → Subtle overlay
bg-black/50  → Balanced (current)
bg-black/70  → Heavy overlay
bg-black/90  → Nearly opaque
```

#### **Modal Background Color**

```typescript
// Location: Line ~115-120
className="... bg-[#faf9f7] ..."
//                ↑ Warm off-white

// Alternative backgrounds:
bg-white        → Pure white (#FFFFFF)
bg-stone-50     → Cool off-white (#FAFAF9)
bg-[#faf9f7]    → Warm off-white (current)
bg-[#f8f8f8]    → Neutral gray-white
```

---

## 2. HTML Mockups (For Prototyping)

### File: `habit_creation_wizard_mockup.html`

#### **Phone Frame Styling**

```html
<!-- Location: Line ~60-70 -->
<style>
  .phone-frame {
    width: 390px;           /* ← iPhone 14 Pro width */
    height: 844px;          /* ← iPhone 14 Pro height */
    background: #000;       /* ← Frame color */
    border-radius: 50px;    /* ← Corner roundness */
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);  /* ← Drop shadow */
  }
</style>

<!-- Alternative phone sizes: -->
<!-- iPhone SE: 375x667 -->
<!-- iPhone 14 Plus: 428x926 -->
<!-- Android (Pixel 7): 412x915 -->
```

#### **Background Gradient**

```html
<!-- Location: Line ~50-55 -->
<style>
  body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /*                                   ↑ Start    ↑ End       */
  }
</style>

<!-- Alternative gradients: -->
<!-- Blue to Purple -->
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

<!-- Pink to Orange -->
background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);

<!-- Green to Teal -->
background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);

<!-- Dark Mode -->
background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
```

#### **Button Hover Effects**

```html
<!-- Location: Line ~120-130 -->
<style>
  .btn-primary:hover:not(:disabled) {
    background: #059669;    /* ← Darker green on hover */
    transform: translateY(-2px);  /* ← Lift up 2px */
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);  /* ← Larger shadow */
  }
</style>

<!-- Hover effect variations: -->
<!-- Subtle lift -->
transform: translateY(-1px);

<!-- No lift, just color -->
transform: none;

<!-- Scale up -->
transform: scale(1.02);
```

---

### File: `habit_creation_quick_mode.html`

#### **Suggestion Chips**

```html
<!-- Location: Line ~80-95 -->
<style>
  .suggestion-chip {
    padding: 10px 16px;
    background: white;
    border: 2px solid #e7e5e4;  /* ← Border color */
    border-radius: 20px;        /* ← Pill shape */
  }

  .suggestion-chip:hover {
    border-color: #10B981;      /* ← Hover border */
    background: #D1FAE5;        /* ← Hover background */
    transform: translateY(-2px); /* ← Lift effect */
  }
</style>

<!-- Chip style variations: -->
<!-- Rounded rectangle (less pill-like) -->
border-radius: 12px;

<!-- No border, shadow instead -->
border: none;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

<!-- Filled by default (not hollow) -->
background: #f5f5f4;
border: 2px solid transparent;
```

---

### File: `habit_creation_before_after_comparison.html`

#### **Stat Cards**

```html
<!-- Location: Line ~150-165 -->
<style>
  .stat-card {
    background: rgba(255, 255, 255, 0.1);  /* ← Glass effect */
    backdrop-filter: blur(10px);           /* ← Blur background */
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 20px;
  }
</style>

<!-- Glass morphism variations: -->
<!-- Light glass -->
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(15px);

<!-- Dark glass -->
background: rgba(0, 0, 0, 0.2);
backdrop-filter: blur(10px);

<!-- Solid (no transparency) -->
background: #1e293b;
backdrop-filter: none;
```

---

## 3. Design Token System (Centralized Styling)

### Recommended Approach: Create Theme File

```typescript
// File: src/theme/habitCreationTheme.ts

export const HABIT_CREATION_THEME = {
  colors: {
    primary: '#10B981',        // Emerald-500
    primaryLight: '#D1FAE5',   // Emerald-50
    primaryDark: '#047857',    // Emerald-700

    background: '#faf9f7',     // Warm off-white
    surface: '#ffffff',        // White cards

    text: {
      primary: '#1c1917',      // Stone-900
      secondary: '#78716c',    // Stone-500
      tertiary: '#a8a29e',     // Stone-400
    },

    border: '#e7e5e4',         // Stone-200
    disabled: '#d6d3d1',       // Stone-300
  },

  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },

  typography: {
    title: {
      fontSize: 24,
      fontWeight: '700',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
    },
  },

  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 400,
    },
  },
} as const;
```

#### **Usage in Components**

```typescript
// Import theme
import { HABIT_CREATION_THEME as theme } from '../../theme/habitCreationTheme';

// Use in styles
<View style={{
  backgroundColor: theme.colors.primary,
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
}} />

// Or with inline styles
<Text style={{
  color: theme.colors.text.primary,
  fontSize: theme.typography.title.fontSize,
  fontWeight: theme.typography.title.fontWeight,
}}>
```

---

## 4. Quick Customization Recipes

### **Recipe 1: Change Accent Color to Blue**

**React Native:**
```typescript
// CreateHabitWizard.tsx
// Find: bg-emerald-500
// Replace with: bg-blue-500

// Find: #10B981
// Replace with: #3B82F6

// Find: bg-emerald-50
// Replace with: bg-blue-50

// Find: #D1FAE5
// Replace with: #DBEAFE
```

**HTML Mockups:**
```css
/* Find all instances of: */
#10B981 → #3B82F6  (blue-500)
#D1FAE5 → #DBEAFE  (blue-50)
#047857 → #1D4ED8  (blue-700)
```

---

### **Recipe 2: Make It More Rounded**

**React Native:**
```typescript
// Find: rounded-xl
// Replace with: rounded-2xl

// Find: rounded-2xl
// Replace with: rounded-3xl

// Find: rounded-12px (custom)
// Replace with: rounded-16px
```

---

### **Recipe 3: Increase Spacing (More Breathing Room)**

**React Native:**
```typescript
// Find: p-4
// Replace with: p-6

// Find: mt-6
// Replace with: mt-8

// Find: gap-2
// Replace with: gap-4
```

---

### **Recipe 4: Softer Shadows**

**React Native:**
```typescript
// Find:
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1

// Replace with:
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.05
```

---

### **Recipe 5: Faster Animations**

**React Native:**
```typescript
// Find: duration(300)
// Replace with: duration(200)

// Find: withSpring(0, { damping: 20, stiffness: 300 })
// Replace with: withSpring(0, { damping: 25, stiffness: 400 })
```

---

## 5. File-by-File Styling Summary

| File | Primary Styling Areas | Line Range |
|------|----------------------|------------|
| **CreateHabitWizard.tsx** | Colors, typography, spacing, animations | 100-400 |
| **CreateHabitModalSimple.tsx** | Modal overlay, background, swipe gesture | 50-150 |
| **TimeOfDaySelector.tsx** | Time button colors, selected state | 30-70 |
| **EmojiPicker.tsx** | Grid layout, emoji size | 20-60 |
| **ColorPickerSection.tsx** | Color swatch sizes, selected border | 25-65 |
| **HabitNameField.tsx** | Input field border, focus state | 15-45 |
| **ModalHeader.tsx** | Header background, title size | 10-40 |

---

## 6. VS Code Quick Find/Replace

### **Change Primary Color Across All Files**

1. Open VS Code
2. Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows)
3. In "Search" box: `#10B981`
4. In "Replace" box: `#3B82F6` (or your color)
5. In "files to include": `src/components/CreateHabitModal/**/*.tsx`
6. Click "Replace All"

### **Change All Border Radius**

1. Search: `rounded-2xl`
2. Replace: `rounded-3xl`
3. Files: `src/components/CreateHabitModal/**/*.tsx`

---

## 7. Testing Your Changes

### **React Native (Hot Reload)**
1. Make styling changes
2. Save file (`Cmd+S`)
3. App auto-reloads on device/simulator
4. No rebuild needed!

### **HTML Mockups**
1. Edit HTML file
2. Save file
3. Refresh browser (`Cmd+R`)
4. Changes appear immediately

---

## 8. Common Customizations

### **Dark Mode Support**

```typescript
// Add to CreateHabitWizard.tsx
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme();
const isDark = colorScheme === 'dark';

// Use conditional styling
<View style={{
  backgroundColor: isDark ? '#1c1917' : '#faf9f7',
}} />
```

### **Custom Font Family**

```typescript
// Add to theme
typography: {
  fontFamily: 'Inter', // or 'SF Pro', 'Roboto', etc.
}

// Use in Text components
<Text style={{ fontFamily: theme.typography.fontFamily }}>
```

---

## Need Help?

**Quick reference locations:**
- Colors: Lines 100-300 in `CreateHabitWizard.tsx`
- Spacing: Lines 150-400 in `CreateHabitWizard.tsx`
- Animations: Lines 10-20 (imports), 140-200 (usage)
- Typography: Lines 150-250 in step content sections
- Shadows: Button components (lines 290-310)

**Pro tip:** Use `Cmd+F` to find `className="` or `style={{` to locate all styling in a file!
